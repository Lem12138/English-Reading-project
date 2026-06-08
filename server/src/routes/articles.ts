import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';
import { summarizeArticle } from '../services/summarizer.js';
import { proxyFetch } from '../utils/proxyFetch.js';
import { JSDOM } from 'jsdom';

const router = Router();

const CATEGORIES = ['general', 'business', 'technology', 'sports', 'science', 'health', 'entertainment'];
const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  business: 'Business',
  technology: 'Technology',
  sports: 'Sports',
  science: 'Science',
  health: 'Health',
  entertainment: 'Entertainment',
};

// Get categories with article counts
router.get('/categories', async (_req, res: Response) => {
  const counts = await prisma.article.groupBy({
    by: ['category'],
    _count: { id: true },
  });
  const categories = CATEGORIES.map((cat) => ({
    key: cat,
    label: CATEGORY_LABELS[cat] || cat,
    count: counts.find((c) => c.category === cat)?._count.id || 0,
  }));
  return res.json({ categories });
});

// List articles with pagination & category filter
router.get('/', async (req: AuthRequest, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));
  const category = req.query.category as string | undefined;

  const where = category ? { category } : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        description: true,
        source: true,
        category: true,
        author: true,
        imageUrl: true,
        publishedAt: true,
      },
    }),
    prisma.article.count({ where }),
  ]);

  return res.json({ articles, total, page, pageSize });
});

// Get article detail (with lazy full-text scraping)
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid article id' });

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return res.status(404).json({ error: 'Article not found' });

  // Lazy scrape full content if RSS snippet is short or unformatted
  const needsScrape = article.content.length < 600 || !article.content.includes('\n\n');
  if (needsScrape && article.url) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await proxyFetch(article.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const html = await res.text();
        const doc = new JSDOM(html, { url: article.url });
        const updateData: any = {};

        // Extract paragraphs from <p> tags inside <article> or whole document
        const container = doc.window.document.querySelector('article');
        const paragraphs = (container || doc.window.document).querySelectorAll('p');
        if (paragraphs.length > 0) {
          const text = Array.from(paragraphs)
            .map((p: any) => p.textContent?.trim())
            .filter(Boolean)
            .join('\n\n');
          if (text.includes('\n\n') && text.length > 200) {
            updateData.content = text;
            article.content = text;
          }
        }

        // Extract og:image if article has no image
        if (!article.imageUrl) {
          const ogImage = doc.window.document.querySelector('meta[property="og:image"]');
          if (ogImage?.getAttribute('content')) {
            updateData.imageUrl = ogImage.getAttribute('content');
            article.imageUrl = updateData.imageUrl;
          }
        }

        if (Object.keys(updateData).length > 0) {
          await prisma.article.update({ where: { id }, data: updateData });
        }
      }
    } catch { /* keep snippet */ }
  }

  return res.json({ article });
});

// Generate Chinese summary + outline for an article
router.post('/:id/enhance', async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid article id' });

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return res.status(404).json({ error: 'Article not found' });

  // Return cached if exists
  if (article.summary && article.outline) {
    return res.json({ summary: article.summary, outline: article.outline });
  }

  // Use AI to generate smart summary + outline
  const result = await summarizeArticle(article.title, article.content);

  if (result) {
    await prisma.article.update({
      where: { id },
      data: { summary: result.summary, outline: result.outline },
    });
    return res.json({ summary: result.summary, outline: result.outline });
  }

  return res.json({ summary: null, outline: null });
});

export default router;
