import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { essayId } = req.body;
  if (!essayId) return res.status(400).json({ error: 'essayId is required' });

  try {
    await prisma.essayHistory.upsert({
      where: { userId_essayId: { userId, essayId } },
      update: { readAt: new Date() },
      create: { userId, essayId },
    });
  } catch { /* essay may have been deleted */ }

  return res.json({ success: true });
});

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const histories = await prisma.essayHistory.findMany({
    where: { userId },
    orderBy: { readAt: 'desc' },
    take: 50,
    include: { essay: { select: { id: true, title: true, level: true } } },
  });
  return res.json({ histories });
});

export default router;
