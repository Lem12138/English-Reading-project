import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index.js';
import { AuthRequest, authMiddleware, generateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(409).json({
        error: existing.email === email ? 'Email already registered' : 'Username already taken',
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    });

    const token = generateToken(user.id);
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch {
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: { id: user.id, username: user.username, email: user.email } });
});

export default router;
