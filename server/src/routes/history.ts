import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { articleId } = req.body;
  if (!articleId) return res.status(400).json({ error: 'articleId is required' });

  try {
    await prisma.readingHistory.upsert({
      where: { userId_articleId: { userId, articleId } },
      update: { readAt: new Date() },
      create: { userId, articleId },
    });
  } catch { /* article may have been deleted */ }

  return res.json({ success: true });
});

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const histories = await prisma.readingHistory.findMany({
    where: { userId },
    orderBy: { readAt: 'desc' },
    take: 50,
    include: { article: { select: { id: true, title: true, source: true } } },
  });
  return res.json({ histories });
});

export default router;
