import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// Toggle favorite (add if not exists, remove if exists)
router.post('/:articleId', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const articleId = parseInt(req.params.articleId);
  if (isNaN(articleId)) return res.status(400).json({ error: 'Invalid article id' });

  const existing = await prisma.favorite.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return res.json({ favorited: false });
  }

  await prisma.favorite.create({ data: { userId, articleId } });
  return res.json({ favorited: true });
});

// Check if article is favorited
router.get('/:articleId', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const articleId = parseInt(req.params.articleId);
  if (isNaN(articleId)) return res.status(400).json({ error: 'Invalid article id' });

  const existing = await prisma.favorite.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  return res.json({ favorited: !!existing });
});

// List user's favorites
router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      article: {
        select: { id: true, title: true, description: true, source: true, category: true, imageUrl: true, publishedAt: true },
      },
    },
  });
  return res.json({ favorites });
});

export default router;
