import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import type { SavedWordItem, SavedSentenceItem } from '../types';

function groupByDate<T extends { createdAt: string }>(items: T[]) {
  const groups: { label: string; items: T[] }[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  for (const item of items) {
    const d = new Date(item.createdAt);
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let label: string;
    if (dateOnly.getTime() === today.getTime()) {
      label = 'Today';
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      label = 'Yesterday';
    } else {
      label = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }
  return groups;
}

export default function WordBook() {
  const [words, setWords] = useState<SavedWordItem[]>([]);
  const [sentences, setSentences] = useState<SavedSentenceItem[]>([]);
  const [tab, setTab] = useState<'words' | 'sentences'>('words');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Today']));

  useEffect(() => {
    setLoading(true);
    api.words.list(page).then((data) => {
      setWords(data.words);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    api.sentences.list().then((data) => setSentences(data.sentences)).catch(() => {});
  }, []);

  const handleDeleteWord = async (id: number) => {
    await api.words.delete(id);
    setWords((w) => w.filter((x) => x.id !== id));
  };

  const handleDeleteSentence = async (id: number) => {
    await api.sentences.delete(id);
    setSentences((s) => s.filter((x) => x.id !== id));
  };

  const toggleGroup = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const totalPages = Math.ceil(total / 20);
  const dateGroups = useMemo(() => groupByDate(words), [words]);
  const sentDateGroups = useMemo(() => groupByDate(sentences), [sentences]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('words')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            tab === 'words' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          My Words
        </button>
        <button
          onClick={() => setTab('sentences')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            tab === 'sentences' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Saved Sentences
        </button>
      </div>

      {tab === 'words' ? (
        <>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : words.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No saved words yet. Select words while reading to save them here.
            </p>
          ) : (
            <div className="space-y-2">
              {dateGroups.map((group) => {
                const isOpen = expanded.has(group.label);
                return (
                  <div key={group.label}>
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        {group.label}
                        <span className="text-gray-400 font-normal ml-2">{group.items.length} words</span>
                      </span>
                      <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                    </button>
                    {isOpen && (
                      <div className="space-y-2 mt-2">
                        {group.items.map((w) => (
                          <div key={w.id} className="bg-white border border-gray-100 rounded-lg p-4 ml-2 border-l-2 border-l-blue-100">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-bold text-lg text-gray-900">{w.word}</span>
                                  {w.phonetic && <span className="text-sm text-gray-400">{w.phonetic}</span>}
                                </div>
                                <p className="text-sm text-blue-600 mb-1">{w.translation}</p>
                                {w.enDefinition && (
                                  <p className="text-xs text-gray-500 mb-1">{w.enDefinition}</p>
                                )}
                                {w.article && (
                                  <p className="text-xs text-gray-300 mt-1">
                                    From: <Link to={`/article/${w.articleId}`} className="hover:underline">{w.article.title}</Link>
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteWord(w.id)}
                                className="text-xs text-gray-300 hover:text-red-500 shrink-0 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1 rounded border text-sm disabled:opacity-30">Prev</button>
                  <span className="text-sm text-gray-500 self-center">{page}/{totalPages}</span>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-3 py-1 rounded border text-sm disabled:opacity-30">Next</button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        sentences.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No saved sentences yet.</p>
        ) : (
          <div className="space-y-2">
            {sentDateGroups.map((group) => {
              const isOpen = expanded.has(group.label);
              return (
                <div key={group.label}>
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      {group.label}
                      <span className="text-gray-400 font-normal ml-2">{group.items.length} sentences</span>
                    </span>
                    <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                  </button>
                  {isOpen && (
                    <div className="space-y-2 mt-2">
                      {(group.items as SavedSentenceItem[]).map((s) => (
                        <div key={s.id} className="bg-white border border-gray-100 rounded-lg p-4 ml-2 border-l-2 border-l-green-100">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm text-gray-800 mb-1">{s.sentence}</p>
                              {s.translation && <p className="text-sm text-blue-600 mb-1">{s.translation}</p>}
                              {s.article && (
                                <p className="text-xs text-gray-300 mt-1">
                                  From: <Link to={`/article/${s.articleId}`} className="hover:underline">{s.article.title}</Link>
                                </p>
                              )}
                            </div>
                            <button onClick={() => handleDeleteSentence(s.id)}
                              className="text-xs text-gray-300 hover:text-red-500 shrink-0 transition-colors">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
