import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import type { ReadingHistoryItem } from '../types';

export default function History() {
  const [histories, setHistories] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.history.list()
      .then((data) => setHistories(data.histories))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Reading History</h2>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : histories.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No reading history yet. Start reading some articles!
        </p>
      ) : (
        <div className="space-y-2">
          {histories.map((h) => (
            <Link
              key={h.id}
              to={`/article/${h.articleId}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{h.article.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{h.article.source}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(h.readAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
