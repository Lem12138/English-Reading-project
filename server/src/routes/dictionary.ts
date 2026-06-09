import { Router, Response } from 'express';
import crypto from 'crypto';
import { proxyFetch } from '../utils/proxyFetch.js';

const router = Router();

const YOUDAO_APP_KEY = process.env.YOUDAO_APP_KEY || '';
const YOUDAO_APP_SECRET = process.env.YOUDAO_APP_SECRET || '';

function truncate(input: string): string {
  if (input.length <= 20) return input;
  return input.slice(0, 10) + input.length.toString() + input.slice(-10);
}

function generateSign(input: string, salt: string, curtime: string): string {
  const q = truncate(input);
  return crypto
    .createHash('sha256')
    .update(YOUDAO_APP_KEY + q + salt + curtime + YOUDAO_APP_SECRET)
    .digest('hex');
}

async function fetchContext(term: string): Promise<string | null> {
  // Try Wikipedia first (free, fast)
  try {
    const res = await proxyFetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
    if (res.ok) {
      const data: any = await res.json();
      if (data.extract) return data.extract.slice(0, 300);
    }
  } catch { /* fall through */ }

  // Fallback to DeepSeek
  if (!process.env.DEEPSEEK_API_KEY) return null;
  try {
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com/v1' });
    const resp = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: `In one short sentence (max 200 chars), explain what "${term}" is in news context. English only.` }],
      max_tokens: 80,
      temperature: 0,
    });
    return resp.choices[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

function findProperNouns(text: string): string[] {
  const terms = new Set<string>();
  const abbrs = text.match(/\b[A-Z]{2,}(?:\.[A-Z]{2,})*\b/g);
  if (abbrs) abbrs.forEach((t) => terms.add(t.replace(/\./g, '')));
  const proper = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g);
  if (proper) proper.forEach((t) => terms.add(t));
  const single = text.match(/\b[A-Z][a-z]{3,}\b/g);
  if (single) single.forEach((t) => terms.add(t));
  return [...terms].slice(0, 5);
}

async function fetchEnDefinitions(word: string) {
  try {
    const res = await proxyFetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) return [];
    const data: any = await res.json();
    const defs: { partOfSpeech: string; definition: string; example?: string }[] = [];
    for (const entry of data) {
      for (const meaning of entry.meanings || []) {
        for (const def of meaning.definitions || []) {
          defs.push({
            partOfSpeech: meaning.partOfSpeech,
            definition: def.definition,
            example: def.example || undefined,
          });
        }
      }
    }
    return defs.slice(0, 5);
  } catch {
    return [];
  }
}

router.post('/lookup', async (req, res: Response) => {
  const { word } = req.body;
  if (!word || !word.trim()) {
    return res.status(400).json({ error: 'Word is required' });
  }

  const original = word.trim();
  const trimmed = original.toLowerCase();
  const isSingleWord = /^[a-zA-Z]+$/.test(trimmed);

  const enDefsPromise = isSingleWord ? fetchEnDefinitions(trimmed) : Promise.resolve([]);

  const properNouns = findProperNouns(original);
  const contextPromise: Promise<{ term: string; summary: string }[]> = properNouns.length > 0
    ? Promise.all(
        properNouns.map(async (term) => {
          const summary = await fetchContext(term);
          return summary ? { term, summary } : null;
        })
      ).then((results) => results.filter(Boolean) as { term: string; summary: string }[])
    : Promise.resolve([]);

  if (!YOUDAO_APP_KEY) {
    const [enDefinitions, contextNotes] = await Promise.all([enDefsPromise, contextPromise]);
    return res.json({
      result: {
        word: original, phonetic: '', translation: '(请在 server/.env 中配置有道 API)',
        explains: [], enDefinitions, contextNotes,
      },
    });
  }

  try {
    const salt = Date.now().toString();
    const curtime = Math.floor(Date.now() / 1000).toString();
    const sign = generateSign(trimmed, salt, curtime);

    const params = new URLSearchParams({
      q: trimmed, from: 'en', to: 'zh-CHS',
      appKey: YOUDAO_APP_KEY, salt, sign, signType: 'v3', curtime,
    });

    const [youdaoResp, enDefinitions, contextNotes] = await Promise.all([
      proxyFetch('https://openapi.youdao.com/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      }),
      enDefsPromise,
      contextPromise,
    ]);

    const data = await youdaoResp.json();

    if (data.errorCode !== '0') {
      return res.json({
        result: {
          word: original, phonetic: '',
          translation: data.translation?.[0] || `查词失败 (errorCode: ${data.errorCode})`,
          explains: [], enDefinitions, contextNotes,
        },
      });
    }

    return res.json({
      result: {
        word: data.query || original,
        phonetic: data.basic?.phonetic || '',
        translation: data.translation?.[0] || '',
        explains: data.basic?.explains || [],
        enDefinitions, contextNotes,
      },
    });
  } catch (err: any) {
    console.error('[Dict] Youdao lookup failed:', err?.message || err);
    const [enDefinitions, contextNotes] = await Promise.all([enDefsPromise, contextPromise]);
    const fallback = enDefinitions.length > 0
      ? enDefinitions.slice(0, 2).map(d => d.definition).join(' | ')
      : '';
    return res.json({
      result: {
        word: original, phonetic: '', translation: fallback || '查词服务暂不可用',
        explains: [], enDefinitions, contextNotes,
      },
    });
  }
});

export default router;
