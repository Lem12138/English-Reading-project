import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { ArticleItem } from '../types';
import ArticleCard from '../components/ArticleCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState<{ id: number; article: ArticleItem }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    setLoading(true);
    api.favorites.list()
      .then((data) => setFavorites(data.favorites))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFavorites(); }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Favorites</h2>
      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No saved articles yet. Click ☆ on any article to save it here.</p>
      ) : (
        <div className="space-y-3">
          {favorites.map((f) => (
            <ArticleCard key={f.id} article={f.article} onToggle={fetchFavorites} />
          ))}
        </div>
      )}
    </div>
  );
}
