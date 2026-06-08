import { prisma } from '../index.js';
import { proxyFetch } from '../utils/proxyFetch.js';
import RssParser from 'rss-parser';

const rssParser = new RssParser({
  timeout: 15000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
});

function htmlToText(html: string): string {
  return html
    .replace(/<(p|br|div|h\d|li|tr)[^>]*>/gi, '\n')
    .replace(/<\/?(p|div|h\d|li|tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .split('\n').map((l) => l.trim()).filter((l) => l.length > 0)
    .join('\n\n');
}

function extractContent(item: any): string {
  const html = item['content:encoded'] || item.content || '';
  if (html && html.length > 100) {
    return htmlToText(html);
  }
  const snippet = item.contentSnippet || item.summary || '';
  return snippet;
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await proxyFetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^">]+)"/);
    return match?.[1] || null;
  } catch {
    return null;
  }
}

const PAYWALL_SOURCES = [
  'Financial Times', 'The Wall Street Journal', 'The Economist',
  'Bloomberg', 'The Times', 'The Sunday Times', 'The Telegraph',
  'Business Insider', 'Harvard Business Review', 'MIT Technology Review',
];

const FEEDS: { category: string; url: string; source: string }[] = [
  // General
  { category: 'general', url: 'https://feeds.npr.org/1001/rss.xml', source: 'NPR' },
  { category: 'general', url: 'https://www.cbsnews.com/latest/rss/main', source: 'CBS News' },
  { category: 'general', url: 'https://abcnews.go.com/abcnews/topstories', source: 'ABC News' },

  // Business
  { category: 'business', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10001147', source: 'CNBC' },

  // Technology
  { category: 'technology', url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
  { category: 'technology', url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica' },
  { category: 'technology', url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
  { category: 'technology', url: 'https://www.wired.com/feed/rss', source: 'Wired' },

  // Sports
  { category: 'sports', url: 'https://www.espn.com/espn/rss/news', source: 'ESPN' },
  { category: 'sports', url: 'https://www.cbssports.com/rss/headlines/', source: 'CBS Sports' },

  // Science
  { category: 'science', url: 'https://www.sciencedaily.com/rss/all.xml', source: 'Science Daily' },
  { category: 'science', url: 'https://www.space.com/feeds/all', source: 'Space.com' },

  // Health
  { category: 'health', url: 'https://www.who.int/rss-feeds/news-english.xml', source: 'WHO' },

  // Entertainment
  { category: 'entertainment', url: 'https://variety.com/feed/', source: 'Variety' },
];

function extractImage(item: any): string | null {
  // 1. enclosure with image type
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image')) {
    return item.enclosure.url;
  }

  // 2. Parse HTML content for first img tag
  const html = item.content || item['content:encoded'] || item.summary || '';
  if (html) {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    if (match) return match[1];
  }

  // 3. media:content / media:thumbnail (rss-parser namespaced)
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;

  // 4. Common RSS image fields
  if (item.image?.url) return item.image.url;
  if (item.thumbnail) return item.thumbnail;

  return null;
}

async function fetchRssFeed(feedUrl: string): Promise<any[]> {
  try {
    const res = await proxyFetch(feedUrl);
    if (!res.ok) return [];
    const xml = await res.text();
    const feed = await rssParser.parseString(xml);
    return feed.items || [];
  } catch {
    return [];
  }
}

export async function fetchAndSaveArticles(): Promise<number> {
  console.log(`[NewsFetcher] Fetching from ${FEEDS.length} RSS feeds...`);
  let totalSaved = 0;

  for (const feed of FEEDS) {
    const items = await fetchRssFeed(feed.url);
    let saved = 0;

    for (const item of items) {
      const link = item.link || item.guid;
      if (!link) continue;

      // Skip paywalled sources
      if (PAYWALL_SOURCES.some((s) => feed.source.toLowerCase().includes(s.toLowerCase()))) continue;

      const exists = await prisma.article.findUnique({ where: { url: link } });
      if (exists) continue;

      let imageUrl = extractImage(item);

      const article = await prisma.article.create({
        data: {
          title: item.title || 'Untitled',
          description: item.contentSnippet || item.summary || '',
          content: extractContent(item),
          url: link,
          source: feed.source,
          category: feed.category,
          author: item.creator || null,
          imageUrl,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        },
      });
      saved++;

      // Fetch og:image if RSS didn't have one
      if (!imageUrl) {
        imageUrl = await fetchOgImage(link);
        if (imageUrl) {
          await prisma.article.update({ where: { id: article.id }, data: { imageUrl } });
        }
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    console.log(`  [${feed.source}] Saved ${saved} articles`);
    totalSaved += saved;

    // Pause between feeds
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`[NewsFetcher] Total saved: ${totalSaved} articles`);
  return totalSaved;
}
