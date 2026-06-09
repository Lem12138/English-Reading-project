import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// Toggle: POST /api/essay-favorites/:essayId
router.post('/:essayId', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const essayId = parseInt(req.params.essayId);
  if (isNaN(essayId)) return res.status(400).json({ error: 'Invalid essay id' });

  const existing = await prisma.essayFavorite.findUnique({
    where: { userId_essayId: { userId, essayId } },
  });

  if (existing) {
    await prisma.essayFavorite.delete({ where: { id: existing.id } });
    return res.json({ favorited: false });
  } else {
    await prisma.essayFavorite.create({ data: { userId, essayId } });
    return res.json({ favorited: true });
  }
});

// Check: GET /api/essay-favorites/:essayId
router.get('/:essayId', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const essayId = parseInt(req.params.essayId);
  if (isNaN(essayId)) return res.status(400).json({ error: 'Invalid essay id' });

  const existing = await prisma.essayFavorite.findUnique({
    where: { userId_essayId: { userId, essayId } },
  });
  return res.json({ favorited: !!existing });
});

// List: GET /api/essay-favorites
router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const favorites = await prisma.essayFavorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      essay: {
        select: { id: true, title: true, level: true, type: true, examDate: true, prompt: true },
      },
    },
  });
  return res.json({ favorites });
});

export default router;
