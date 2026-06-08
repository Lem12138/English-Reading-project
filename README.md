# English Reader — 英语新闻阅读学习平台

一个帮助你通过真实英文新闻提升阅读能力的网页应用。

## 功能

- **英文新闻阅读** — 自动从 NewsAPI 拉取主流英文报纸文章（BBC、CNN 等）
- **选词翻译** — 阅读时选中单词即可弹出有道词典释义、音标、中文翻译
- **生词收藏** — 收藏单词保存到生词本，带上下文句子方便复习
- **句子收藏** — 选中句子一键收藏
- **阅读历史** — 自动记录阅读过的文章
- **用户系统** — 注册登录，每个人的生词本和历史独立存储

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS |
| 后端 | Express 4 + TypeScript + Prisma ORM |
| 数据库 | SQLite（零配置） |
| 认证 | JWT |
| 新闻 | NewsAPI |
| 词典 | 有道智云词典 API |

## 快速开始

### 1. 获取 API Key

- **NewsAPI**: 注册 https://newsapi.org，获取免费 API Key（100 次/天）
- **有道词典**: 注册 https://ai.youdao.com，创建应用获取 AppKey 和 AppSecret（每月免费 100万字符）

### 2. 配置环境变量

编辑 `server/.env`：

```
NEWS_API_KEY=你的NewsAPI_Key
YOUDAO_APP_KEY=你的有道AppKey
YOUDAO_APP_SECRET=你的有道AppSecret
```

### 3. 启动后端

```bash
cd server
npm install
npx prisma db push --schema=src/prisma/schema.prisma
npm run dev
```

后端运行在 http://localhost:3001

### 4. 启动前端

```bash
cd client
npm install
npm run dev
```

前端运行在 http://localhost:5173

## 项目结构

```
English_reading_project/
├── client/                      # 前端 React 项目
│   └── src/
│       ├── pages/               # Login, Register, Home, Reader, WordBook, History
│       ├── components/          # Layout, ArticleCard, WordPopup
│       ├── hooks/               # useAuth
│       └── utils/               # api.ts
├── server/                      # 后端 Express 项目
│   └── src/
│       ├── prisma/schema.prisma # 数据库定义（5 张表）
│       ├── routes/              # auth, articles, words, sentences, history, dictionary
│       ├── services/            # newsFetcher.ts, dictionary.ts
│       └── middleware/          # auth.ts (JWT 鉴权)
```

## 使用流程

1. 访问 http://localhost:5173 → 注册账号 → 登录
2. 首页会看到拉取的英文新闻（首次启动会自动拉取一次）
3. 点击文章进入阅读页
4. **选中单词** → 弹出翻译弹窗 → 点击 "Save Word" 收藏
5. **选中句子** → 点击 "Save Sentence" 收藏
6. 在 "My Words" 页面复习已收藏的单词
