import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// List essays with optional level & type filter + pagination
router.get('/', async (req: AuthRequest, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));
  const level = req.query.level as string | undefined;
  const type = req.query.type as string | undefined;

  const where: any = {};
  if (level) where.level = level;
  if (type) where.type = type;

  const [essays, total] = await Promise.all([
    prisma.essay.findMany({
      where,
      orderBy: { examDate: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        level: true,
        type: true,
        title: true,
        prompt: true,
        examDate: true,
        createdAt: true,
      },
    }),
    prisma.essay.count({ where }),
  ]);

  return res.json({ essays, total, page, pageSize });
});

// Get essay detail
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid essay id' });

  const essay = await prisma.essay.findUnique({ where: { id } });
  if (!essay) return res.status(404).json({ error: 'Essay not found' });

  // Parse content JSON for writing type
  if (essay.type === 'writing' && essay.content) {
    try {
      essay.content = JSON.parse(essay.content);
    } catch { /* keep as string */ }
  }

  return res.json({ essay });
});

export default router;
