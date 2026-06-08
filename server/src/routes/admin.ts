import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// Admin middleware
router.use((req: AuthRequest, res: Response, next) => {
  prisma.user.findUnique({ where: { id: req.userId! } }).then((user) => {
    if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    next();
  });
});

// List all users
router.get('/users', async (_req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, createdAt: true,
      _count: { select: { words: true, sentences: true, favorites: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ users });
});

// Delete user
router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  if (id === req.userId) return res.status(400).json({ error: 'Cannot delete yourself' });

  await prisma.user.delete({ where: { id } });
  return res.json({ success: true });
});

// Stats
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  const [users, articles, words, sentences, favorites] = await Promise.all([
    prisma.user.count(),
    prisma.article.count(),
    prisma.savedWord.count(),
    prisma.savedSentence.count(),
    prisma.favorite.count(),
  ]);
  return res.json({ users, articles, words, sentences, favorites });
});

export default router;
