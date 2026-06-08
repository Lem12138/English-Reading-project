import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { ArticleItem as ArticleItemType, CategoryInfo } from '../types';
import ArticleCard from '../components/ArticleCard';

const CAT_ICONS: Record<string, string> = {
  general: '📰', business: '💼', technology: '🔧', sports: '⚽',
  science: '🔬', health: '🏥', entertainment: '🎬',
};

const CAT_COLORS: Record<string, string> = {
  general: 'from-slate-500 to-slate-700',
  business: 'from-amber-500 to-orange-600',
  technology: 'from-cyan-500 to-blue-600',
  sports: 'from-emerald-500 to-green-600',
  science: 'from-violet-500 to-purple-600',
  health: 'from-rose-500 to-pink-600',
  entertainment: 'from-yellow-500 to-amber-500',
};

export default function Home() {
  // Restore saved state or use defaults
  const saved = (() => {
    try { return JSON.parse(sessionStorage.getItem('home_state') || '{}'); } catch { return {}; }
  })();

  const [articles, setArticles] = useState<ArticleItemType[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [activeCategory, setActiveCategory] = useState(saved.category || '');
  const [page, setPage] = useState(saved.page || 1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 20;

  // Save scroll position on scroll (throttled)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          sessionStorage.setItem('home_state', JSON.stringify({
            category: activeCategory,
            page,
            scrollY: window.scrollY,
          }));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeCategory, page]);

  // Restore scroll position
  useEffect(() => {
    if (!loading && saved.scrollY > 0) {
      let attempts = 0;
      const tryScroll = () => {
        const docH = document.documentElement.scrollHeight;
        if (docH >= saved.scrollY || attempts > 5) {
          window.scrollTo(0, saved.scrollY);
        } else {
          attempts++;
          requestAnimationFrame(tryScroll);
        }
      };
      requestAnimationFrame(tryScroll);
    }
  }, [loading]);

  const fetchCategories = async () => {
    try {
      const data = await api.articles.categories();
      setCategories(data.categories);
    } catch { /* ignore */ }
  };

  const fetchArticles = async (p: number, cat: string) => {
    setLoading(true);
    try {
      const data = await api.articles.list({ page: p, pageSize, category: cat || undefined });
      setArticles(data.articles);
      setTotal(data.total);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchArticles(page, activeCategory); }, [page, activeCategory]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveCategory(''); setPage(1); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === ''
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
              }`}
            >
              <span className="text-base mr-2">🏠</span> All News
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                  activeCategory === cat.key
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
              >
                <span>
                  <span className="text-base mr-2">{CAT_ICONS[cat.key] || '📄'}</span>
                  {cat.label}
                </span>
                {cat.count > 0 && (
                  <span className="text-xs text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded-full min-w-[24px] text-center">
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Mobile pills */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => { setActiveCategory(''); setPage(1); }}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === '' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setPage(1); }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.key ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {CAT_ICONS[cat.key] || ''} {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4" />
            <p className="text-sm">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-gray-400 text-lg font-medium">No articles yet</p>
            <p className="text-gray-300 text-sm mt-1">News will appear here automatically</p>
          </div>
        ) : (
          <>
            {/* Hero banner */}
            {!activeCategory && page === 1 && (
              <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 md:p-14">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-300 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10">
                  <p className="text-blue-200 text-sm font-medium mb-3 tracking-wide uppercase">Welcome to EnglishReader</p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-2xl">
                    Hope you find some peace in your time here
                  </h1>
                  <p className="text-blue-200/80 mt-4 text-lg max-w-xl leading-relaxed">
                    Read real English news from world-class sources. Tap any word to translate. Build your vocabulary. Enjoy the journey.
                  </p>
                </div>
              </div>
            )}

            {/* Section header */}
            {activeCategory && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  {CAT_ICONS[activeCategory] || ''} {categories.find(c => c.key === activeCategory)?.label || activeCategory}
                </h2>
              </div>
            )}

            {/* Article list */}
            <div className="space-y-4">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10 pb-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-400 font-medium">{page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
