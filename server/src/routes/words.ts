import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { word, phonetic, translation, enDefinition, context, articleId } = req.body;
  if (!word || !translation) {
    return res.status(400).json({ error: 'Word and translation are required' });
  }

  const saved = await prisma.savedWord.create({
    data: { userId, word: word.toLowerCase(), phonetic, translation, enDefinition, context, articleId },
  });
  return res.json({ word: saved });
});

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = 20;

  const [words, total] = await Promise.all([
    prisma.savedWord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { article: { select: { title: true } } },
    }),
    prisma.savedWord.count({ where: { userId } }),
  ]);

  return res.json({ words, total, page, pageSize });
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const word = await prisma.savedWord.findFirst({ where: { id, userId } });
  if (!word) return res.status(404).json({ error: 'Word not found' });

  await prisma.savedWord.delete({ where: { id } });
  return res.json({ success: true });
});

export default router;
