# English Reader — 读英文新闻，划词翻译，积累词汇

http://118.25.78.61:3001

通过阅读真实英文新闻和四六级/专八真题作文提升英语阅读能力。

## 快速上手

1. 左侧边栏选择新闻分类
2. 点击文章或作文开始阅读
3. **选中单词** → 中文翻译 + 英文释义 + 背景知识
4. **选中句子** → 整句翻译
5. 收藏单词和句子，随时复习

## 功能介绍

### 新闻阅读

覆盖 14 个国际新闻源，7 大分类。每天 8:00 和 20:00 自动更新。每篇文章自带封面图和 AI 生成的中文摘要。

| 分类 | 来源 |
|------|------|
| 综合 | NPR · ABC News · CBS News |
| 商业 | CNBC |
| 科技 | The Verge · Ars Technica · TechCrunch · Wired |
| 体育 | ESPN · CBS Sports |
| 科学 | Science Daily · Space.com |
| 健康 | WHO |
| 娱乐 | Variety |

### 作文 Hub（CET-4 / CET-6 / TEM-8）

收录 2015-2025 四六级及专八真题作文和翻译，共 140 篇。每道题由 DeepSeek 生成 2 篇范文 + 中文参考 + 亮点解析。支持按级别和题型筛选，专八写作附带完整阅读材料。

### 划词翻译

选中文章中任意单词，右侧栏即时显示中文翻译、英文释义和背景知识。选中句子同样支持整句翻译。手机和平板端弹窗 Save 按钮固定在底部，触屏优化。

### 生词本

收藏的单词和句子按日期分组，折叠展开查看。每张单词卡片包含中文释义和英文解释。

### 收藏与历史

文章和作文双收藏系统，阅读历史自动记录并按 Articles/Essays 分类切换查看。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React + Vite + TypeScript + Tailwind CSS |
| 后端 | Express + TypeScript + Prisma + SQLite |
| 翻译 | 有道智云 NMT API |
| 词典 | Free Dictionary API（有道失败时兜底）|
| AI 内容 | DeepSeek（文章摘要 + 作文范文生成）|
| 新闻 | 14 个 RSS 源 |

## 开始使用

### 1. 获取 API Key

- **有道智云**: 注册 https://ai.youdao.com，创建应用获取 AppKey 和 AppSecret（每月免费 100 万字符）
- **DeepSeek**: 注册 https://platform.deepseek.com，获取 API Key

### 2. 配置环境变量

```bash
cp server/.env.example server/.env
```

编辑 `server/.env`：

```
DATABASE_URL="file:./dev.db"
JWT_SECRET=随机字符串
YOUDAO_APP_KEY=你的有道AppKey
YOUDAO_APP_SECRET=你的有道AppSecret
DEEPSEEK_API_KEY=你的DeepSeek API Key
PORT=3001
```

### 3. 启动后端

```bash
cd server
npm install
npx prisma generate --schema=src/prisma/schema.prisma
npx prisma db push --schema=src/prisma/schema.prisma
npm run dev
```

后端运行在 http://localhost:3001

### 4. 生成作文数据

```bash
cd server
npm run seed
```

首次运行生成 140 篇四六级/专八作文，之后增量运行只补新题，不重复生成。

### 5. 启动前端

```bash
cd client
npm install
npm run dev
```

前端运行在 http://localhost:5173

## 项目结构

```
English_reading_project/
├── client/                      # React 前端
│   └── src/
│       ├── pages/               # Home, Reader, EssayReader, Essays, Login, Register, WordBook, Favorites, History, Intro
│       ├── components/          # Layout, ArticleCard, WordPopup
│       ├── hooks/               # useAuth
│       └── utils/               # api.ts
├── server/                      # Express 后端
│   └── src/
│       ├── prisma/
│       │   ├── schema.prisma    # 数据库定义
│       │   └── seed.ts          # 作文种子脚本
│       ├── routes/              # auth, articles, essays, words, sentences, history, favorites, essayHistory, essayFavorites, dictionary, admin
│       ├── services/            # newsFetcher, summarizer
│       └── middleware/          # auth (JWT)
└── deploy.sh                    # 部署脚本
```

## 联系我

邮箱：2424100868@qq.com
