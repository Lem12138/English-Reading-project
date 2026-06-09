import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import type { EssayItem } from '../types';

const LEVELS = [
  { key: '', label: 'All' },
  { key: 'CET-4', label: 'CET-4' },
  { key: 'CET-6', label: 'CET-6' },
  { key: 'TEM-8', label: 'TEM-8' },
];

const TYPES = [
  { key: '', label: 'All' },
  { key: 'writing', label: 'Writing' },
  { key: 'translation', label: 'Translation' },
];

const LEVEL_TAG: Record<string, string> = {
  'CET-4': 'bg-emerald-100 text-emerald-700',
  'CET-6': 'bg-blue-100 text-blue-700',
  'TEM-8': 'bg-purple-100 text-purple-700',
};

const TYPE_LABEL: Record<string, string> = {
  writing: 'Writing',
  translation: 'Translation',
};

export default function Essays() {
  const [essays, setEssays] = useState<EssayItem[]>([]);
  const [total, setTotal] = useState(0);
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 20;

  const fetchEssays = async (p: number, lvl: string, tp: string) => {
    setLoading(true);
    try {
      const data = await api.essays.list({
        page: p,
        pageSize,
        level: lvl || undefined,
        type: tp || undefined,
      });
      setEssays(data.essays);
      setTotal(data.total);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchEssays(page, level, type);
  }, [page, level, type]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Excellent Essays & Translations</h1>
        <p className="text-gray-500 mt-1">CET-4 / CET-6 / TEM-8 real exam sample essays and translation exercises</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level</span>
          <div className="flex gap-1">
            {LEVELS.map((l) => (
              <button
                key={l.key}
                onClick={() => { setLevel(l.key); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  level === l.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</span>
          <div className="flex gap-1">
            {TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => { setType(t.key); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  type === t.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading essays...</p>
        </div>
      ) : essays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-gray-400 text-lg font-medium">No essays found</p>
          <p className="text-gray-300 text-sm mt-1">Seed data may not have been added yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {essays.map((e) => (
              <Link
                key={e.id}
                to={`/essay/${e.id}`}
                className="block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${LEVEL_TAG[e.level] || 'bg-gray-100 text-gray-600'}`}>
                        {e.level}
                      </span>
                      <span className="text-xs text-gray-400">{TYPE_LABEL[e.type] || e.type}</span>
                      <span className="text-xs text-gray-300">{e.examDate}</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{e.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 truncate">{e.prompt}</p>
                  </div>
                  <span className="text-gray-300 text-lg shrink-0 mt-1">→</span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10 pb-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 transition-all"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-400 font-medium">{page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
