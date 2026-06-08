import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { sentence, translation, articleId } = req.body;
  if (!sentence) {
    return res.status(400).json({ error: 'Sentence is required' });
  }

  const saved = await prisma.savedSentence.create({
    data: { userId, sentence, translation, articleId },
  });
  return res.json({ sentence: saved });
});

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const sentences = await prisma.savedSentence.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { article: { select: { title: true } } },
  });
  return res.json({ sentences });
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const sentence = await prisma.savedSentence.findFirst({ where: { id, userId } });
  if (!sentence) return res.status(404).json({ error: 'Sentence not found' });

  await prisma.savedSentence.delete({ where: { id } });
  return res.json({ success: true });
});

export default router;
