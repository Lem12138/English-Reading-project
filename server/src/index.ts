import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import wordRoutes from './routes/words.js';
import sentenceRoutes from './routes/sentences.js';
import historyRoutes from './routes/history.js';
import dictRoutes from './routes/dictionary.js';
import favoriteRoutes from './routes/favorites.js';
import adminRoutes from './routes/admin.js';
import { authMiddleware } from './middleware/auth.js';
import { fetchAndSaveArticles } from './services/newsFetcher.js';

export const prisma = new PrismaClient();

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/articles', authMiddleware, articleRoutes);
app.use('/api/words', authMiddleware, wordRoutes);
app.use('/api/sentences', authMiddleware, sentenceRoutes);
app.use('/api/history', authMiddleware, historyRoutes);
app.use('/api/dict', authMiddleware, dictRoutes);
app.use('/api/favorites', authMiddleware, favoriteRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Cron: fetch news at 8:00 and 20:00
cron.schedule('0 8,20 * * *', () => {
  console.log('[Cron] Fetching news...');
  fetchAndSaveArticles().catch(console.error);
});

// Fetch on startup
fetchAndSaveArticles().catch(console.error);

// Serve frontend static files in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
