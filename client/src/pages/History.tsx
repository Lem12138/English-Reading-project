import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

type Tab = 'articles' | 'essays';

const LEVEL_TAG: Record<string, string> = {
  'CET-4': 'bg-emerald-100 text-emerald-700',
  'CET-6': 'bg-blue-100 text-blue-700',
  'TEM-8': 'bg-purple-100 text-purple-700',
};

export default function History() {
  const [tab, setTab] = useState<Tab>('articles');
  const [articleHistory, setArticleHistory] = useState<any[]>([]);
  const [essayHistory, setEssayHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (tab === 'articles') {
      api.history.list().then(d => setArticleHistory(d.histories)).finally(() => setLoading(false));
    } else {
      api.essayHistory.list().then(d => setEssayHistory(d.histories)).finally(() => setLoading(false));
    }
  }, [tab]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Reading History</h2>

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
        articleHistory.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No article reading history yet.</p>
        ) : (
          <div className="space-y-2">
            {articleHistory.map((h: any) => (
              <Link key={h.id} to={`/article/${h.articleId}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{h.article.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{h.article.source}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-4">{new Date(h.readAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        essayHistory.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No essay reading history yet.</p>
        ) : (
          <div className="space-y-2">
            {essayHistory.map((h: any) => (
              <Link key={h.id} to={`/essay/${h.essayId}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${LEVEL_TAG[h.essay.level] || 'bg-gray-100 text-gray-600'}`}>{h.essay.level}</span>
                    <p className="font-medium text-gray-900">{h.essay.title}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-4">{new Date(h.readAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
