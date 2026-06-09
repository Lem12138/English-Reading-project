import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import type { ArticleItem, EssayItem } from '../types';

type Tab = 'articles' | 'essays';

const LEVEL_TAG: Record<string, string> = {
  'CET-4': 'bg-emerald-100 text-emerald-700',
  'CET-6': 'bg-blue-100 text-blue-700',
  'TEM-8': 'bg-purple-100 text-purple-700',
};

export default function Favorites() {
  const [tab, setTab] = useState<Tab>('articles');
  const [articleFavs, setArticleFavs] = useState<{ id: number; article: ArticleItem }[]>([]);
  const [essayFavs, setEssayFavs] = useState<{ id: number; essay: EssayItem }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (tab === 'articles') {
      api.favorites.list().then(d => setArticleFavs(d.favorites)).finally(() => setLoading(false));
    } else {
      api.essayFavorites.list().then(d => setEssayFavs(d.favorites)).finally(() => setLoading(false));
    }
  }, [tab]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Favorites</h2>

      <div className="flex gap-2 mb-6">
        {(['articles', 'essays'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            {t === 'articles' ? 'Articles' : 'Essays'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : tab === 'articles' ? (
        articleFavs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No favorite articles yet.</p>
        ) : (
          <div className="space-y-2">
            {articleFavs.map(f => (
              <Link key={f.id} to={`/article/${f.article.id}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm">
                <p className="font-medium text-gray-900">{f.article.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{f.article.source} · {f.article.category}</p>
              </Link>
            ))}
          </div>
        )
      ) : (
        essayFavs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No favorite essays yet.</p>
        ) : (
          <div className="space-y-2">
            {essayFavs.map(f => (
              <Link key={f.id} to={`/essay/${f.essay.id}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${LEVEL_TAG[f.essay.level] || 'bg-gray-100 text-gray-600'}`}>{f.essay.level}</span>
                  <span className="text-xs text-gray-400">{f.essay.type === 'writing' ? 'Writing' : 'Translation'}</span>
                </div>
                <p className="font-medium text-gray-900">{f.essay.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{f.essay.prompt}</p>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
