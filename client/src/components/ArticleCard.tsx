import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import type { ArticleItem } from '../types';

export default function ArticleCard({ article, featured, onToggle }: { article: ArticleItem; featured?: boolean; onToggle?: () => void }) {
  const [fav, setFav] = useState(false);

  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.favorites.toggle(article.id);
      setFav(res.favorited);
      onToggle?.();
    } catch { /* ignore */ }
  };

  if (featured) {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {article.imageUrl ? (
            <div className="relative h-72 overflow-hidden">
              <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wide">
                    {article.source}
                  </span>
                  <span className="text-xs text-white/70">{date}</span>
                </div>
                <h2 className="text-2xl font-bold leading-tight line-clamp-2">{article.title}</h2>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {article.source}
                </span>
                <span className="text-xs text-gray-400">{date}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{article.title}</h2>
              {article.description && (
                <p className="text-gray-500 mt-3 leading-relaxed line-clamp-2">{article.description}</p>
              )}
            </div>
          )}
          <div className="absolute top-4 right-4">
            <button onClick={handleFav}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                article.imageUrl
                  ? (fav ? 'bg-yellow-400/80 text-white' : 'bg-white/20 text-white/70 hover:bg-white/40')
                  : (fav ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100')
              }`}>
              {fav ? '★' : '☆'}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`} className="block group">
      <article className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-200">
        <div className="flex gap-5">
          {article.imageUrl ? (
            <div className="w-36 h-24 shrink-0 rounded-lg overflow-hidden">
              <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          ) : (
            <div className="w-36 h-24 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-2xl font-extrabold text-gray-300">{article.source.charAt(0)}</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{article.source}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{date}</span>
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug text-[15px]">
              {article.title}
            </h3>
            {article.description && (
              <p className="text-sm text-gray-500 line-clamp-1 mt-1">{article.description}</p>
            )}
          </div>
          <button onClick={handleFav}
            className={`shrink-0 self-start px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              fav
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : 'text-gray-300 border-transparent hover:border-gray-200 hover:text-gray-500'
            }`}>
            {fav ? '★ Saved' : '☆ Save'}
          </button>
        </div>
      </article>
    </Link>
  );
}
