import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1',
  fetch: globalThis.fetch,
});

interface SummaryResult {
  summary: string;
  outline: string;
}

export async function summarizeArticle(title: string, content: string): Promise<SummaryResult | null> {
  if (!process.env.DEEPSEEK_API_KEY) return null;

  const text = content.slice(0, 6000);

  const prompt = `你是一个专业的新闻编辑。请根据以下英文新闻文章，生成两个内容，用中文输出：

1. **中文摘要**（2-3句话，概括文章核心内容，让读者快速了解文章讲什么）
2. **文章框架**（用编号列表列出3-6个关键要点，每个要点一句话）

请按以下JSON格式输出，不要输出其他内容：
{
  "summary": "中文摘要内容",
  "outline": "1. 要点一\\n2. 要点二\\n3. 要点三"
}

标题：${title}

正文：
${text}`;

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) return null;

    // Strip markdown code fences
    const json = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(json);
    return {
      summary: parsed.summary || '',
      outline: parsed.outline || '',
    };
  } catch (err) {
    console.error('[Summarizer] Failed:', err);
    return null;
  }
}
