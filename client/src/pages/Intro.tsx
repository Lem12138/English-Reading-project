export default function Intro() {
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          <span className="text-blue-600">English</span>Reader
        </h1>
        <p className="text-gray-500 mt-2 text-lg">读英文新闻，划词翻译，积累词汇。</p>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-100">快速上手</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm text-gray-700 space-y-1">
          <p><span className="text-gray-400">#</span> 左侧边栏选择分类</p>
          <p><span className="text-gray-400">#</span> 点击文章开始阅读</p>
          <p><span className="text-gray-400">#</span> 选中单词 → 中文翻译 + 英文释义</p>
          <p><span className="text-gray-400">#</span> 选中句子 → 整句翻译</p>
          <p><span className="text-gray-400">#</span> 收藏单词和句子，随时复习</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-100">功能介绍</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">新闻阅读</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              覆盖 14 个国际新闻源，7 大分类。每天 8:00 和 20:00 自动更新。
              每篇文章自带封面图和 AI 生成的中文摘要。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">划词翻译</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              选中文章中任意单词，右侧栏即时显示
              <span className="text-blue-600 font-medium"> 中文翻译</span>、
              <span className="text-gray-700 font-medium"> 英文释义</span> 和
              <span className="text-purple-600 font-medium"> 背景知识</span>。
              选中句子同样支持整句翻译。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">生词本</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              收藏的单词和句子按日期分组，折叠展开查看。
              每张单词卡片包含中文释义和英文解释。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">AI 摘要</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              每篇文章顶部有 AI 生成的中文摘要，底部有逻辑框架，
              帮助你快速抓住文章要点。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">收藏与历史</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              一键收藏文章，阅读历史自动记录，导航栏随时查看。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-100">新闻来源</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            ['综合', 'NPR · ABC News · CBS News'],
            ['商业', 'CNBC'],
            ['科技', 'The Verge · Ars Technica · TechCrunch · Wired'],
            ['体育', 'ESPN · CBS Sports'],
            ['科学', 'Science Daily · Space.com'],
            ['健康', 'WHO'],
            ['娱乐', 'Variety'],
          ].map(([cat, srcs]) => (
            <div key={cat} className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 mb-0.5">{cat}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{srcs}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-100">技术栈</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-xs text-gray-600 space-y-1">
          <p><span className="text-gray-400">前端</span>  React + Vite + TypeScript + Tailwind CSS</p>
          <p><span className="text-gray-400">后端</span>  Express + TypeScript + Prisma + SQLite</p>
          <p><span className="text-gray-400">翻译</span>  有道智云 NMT API</p>
          <p><span className="text-gray-400">词典</span>  Free Dictionary API</p>
          <p><span className="text-gray-400">AI 摘要</span>  DeepSeek</p>
          <p><span className="text-gray-400">新闻</span>  14 个 RSS 源</p>
        </div>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-100">联系我</h2>
        <p className="text-sm text-gray-600">
          邮箱：<a href="mailto:2424100868@qq.com" className="text-blue-600 hover:underline">2424100868@qq.com</a>
        </p>
        <p className="text-sm text-gray-400 mt-1">Any questions or suggestions, just let me know.</p>
      </section>

      <div className="mt-16 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-300 italic">A gift for Faye</p>
      </div>
    </div>
  );
}
