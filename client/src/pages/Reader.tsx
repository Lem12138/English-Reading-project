import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import type { ArticleDetail, DictResult } from '../types';
import WordPopup from '../components/WordPopup';

export default function Reader() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Side panel state
  const [panelMode, setPanelMode] = useState<'word' | 'sentence' | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [dictResult, setDictResult] = useState<DictResult | null>(null);
  const [dictLoading, setDictLoading] = useState(false);

  // Favorite state
  const [favorited, setFavorited] = useState(false);

  // Summary & outline
  const [summary, setSummary] = useState<string | null>(null);
  const [outline, setOutline] = useState<string | null>(null);

  // Toast feedback
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.articles.get(parseInt(id))
      .then((data) => setArticle(data.article))
      .finally(() => setLoading(false));
    api.history.record(parseInt(id)).catch(() => {});
    api.favorites.check(parseInt(id)).then((d) => setFavorited(d.favorited)).catch(() => {});
    api.articles.enhance(parseInt(id)).then((d) => {
      setSummary(d.summary);
      setOutline(d.outline);
    }).catch(() => {});
  }, [id]);

  const handleToggleFav = async () => {
    if (!id) return;
    try {
      const res = await api.favorites.toggle(parseInt(id));
      setFavorited(res.favorited);
      setToast(res.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const lastSelectionRef = useRef(0);

  const handleSelection = useCallback(() => {
    // Debounce: iOS fires both touchend and delayed mouseup for the same selection
    const now = Date.now();
    if (now - lastSelectionRef.current < 500) return;
    lastSelectionRef.current = now;

    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const text = selection.toString().trim();
      if (!text) return;

      // Capture selection position for popup
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPopupPos({ x: rect.left + rect.width / 2, y: rect.bottom });

      if (/^[a-zA-Z]+$/.test(text)) {
        setSelectedText(text);
        setPanelMode('word');
        setDictLoading(true);
        setDictResult(null);
        api.dict.lookup(text)
          .then((data) => setDictResult(data.result))
          .finally(() => setDictLoading(false));
      } else {
        setSelectedText(text);
        setPanelMode('sentence');
        setDictLoading(true);
        setDictResult(null);
        api.dict.lookup(text)
          .then((data) => setDictResult(data.result))
          .finally(() => setDictLoading(false));
      }
    }, 0);
  }, []);

  const handleSaveWord = async () => {
    if (!dictResult || !id) return;
    try {
      await api.words.save({
        word: dictResult.word,
        phonetic: dictResult.phonetic,
        translation: dictResult.translation,
        enDefinition: dictResult.enDefinitions?.[0]?.definition || '',
        articleId: parseInt(id),
      });
      setToast(`"${dictResult.word}" saved to My Words`);
    } catch { /* ignore */ }
  };

  const handleSaveSentence = async () => {
    if (!selectedText || !id) return;
    try {
      await api.sentences.save({
        sentence: selectedText,
        translation: dictResult?.translation || '',
        articleId: parseInt(id),
      });
      setToast('Sentence saved');
    } catch { /* ignore */ }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading article...</div>;
  }
  if (!article) {
    return <div className="text-center py-12 text-gray-400">Article not found</div>;
  }

  const dictPanelContent = (
    <>
      {/* Selected text */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          {panelMode === 'word' ? 'Selected Word' : 'Selected Text'}
        </h4>
        <p className="text-lg font-bold text-gray-900">{selectedText}</p>
        {dictResult?.phonetic && (
          <p className="text-sm text-gray-400 mt-0.5">{dictResult.phonetic}</p>
        )}
      </div>

      {/* Translation */}
      {dictResult && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Translation
          </h4>
          <p className="text-base text-blue-700 leading-relaxed">{dictResult.translation}</p>
        </div>
      )}

      {/* English definitions */}
      {dictResult?.enDefinitions && dictResult.enDefinitions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            English Definition
          </h4>
          <ul className="space-y-2">
            {dictResult.enDefinitions.map((d, i) => (
              <li key={i} className="text-sm text-gray-700">
                <span className="text-xs text-gray-400 italic">{d.partOfSpeech}</span>
                <p className="mt-0.5">{d.definition}</p>
                {d.example && (
                  <p className="text-xs text-gray-400 mt-0.5 italic">"{d.example}"</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Background context */}
      {dictResult?.contextNotes && dictResult.contextNotes.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Background
          </h4>
          <ul className="space-y-2">
            {dictResult.contextNotes.map((c, i) => (
              <li key={i} className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm font-semibold text-gray-800">{c.term}</span>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explains */}
      {dictResult?.explains && dictResult.explains.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Details
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {dictResult.explains.map((e, i) => (
              <li key={i} className="pl-2 border-l-2 border-gray-200">{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        {panelMode === 'word' ? (
          <button
            onClick={handleSaveWord}
            className="flex-1 text-sm py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Word
          </button>
        ) : (
          <button
            onClick={handleSaveSentence}
            className="flex-1 text-sm py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Save Sentence
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="flex gap-8 max-w-7xl mx-auto relative">
      {/* Main article column */}
      <article className="flex-1 min-w-0">
        {article.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full max-h-80 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        <header className="mb-10" onMouseUp={handleSelection} onTouchEnd={handleSelection}>
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-5">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-semibold text-xs tracking-wide uppercase">
              {article.source}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
            {article.author && (
              <span className="text-sm text-gray-400">· By {article.author}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">
            {article.title}
          </h1>

          {/* Description + collect */}
          <div className="flex items-start gap-4 mb-4">
            {article.description && (
              <p className="text-base text-gray-500 leading-relaxed flex-1">
                {article.description}
              </p>
            )}
            <button
              onClick={handleToggleFav}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                favorited
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-300'
                  : 'bg-white text-gray-400 border border-gray-200 hover:border-yellow-300 hover:text-yellow-600'
              }`}
            >
              {favorited ? '★ Collected' : '☆ Collect'}
            </button>
          </div>

          {/* Summary */}
          {summary && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg px-4 py-3">
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">中文摘要</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
            </div>
          )}
        </header>

        <div
          className="text-lg text-gray-800 leading-[1.8] tracking-[0.01em]"
          onMouseUp={handleSelection}
          onTouchEnd={handleSelection}
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          {article.content.split('\n').map((p, i) => {
            const trimmed = p.trim();
            if (!trimmed) return null;
            return (
              <p key={i} className="mb-6 indent-6">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Outline */}
        {outline && (
          <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">文章框架</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{outline}</div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
          >
            Original article →
          </a>
        </div>
      </article>

      {/* Shared dict content panel */}
      {panelMode !== null && (
        <>
          {/* Desktop: right sidebar */}
          <aside className="hidden lg:block w-80 shrink-0" style={{ alignSelf: 'start', position: 'sticky', top: '4rem' }}>
            {dictLoading ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Looking up...
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                {dictPanelContent}
              </div>
            )}
          </aside>

          {/* Mobile: floating popup */}
          <div className="lg:hidden">
            <WordPopup x={popupPos.x} y={popupPos.y} onClose={() => setPanelMode(null)}>
              {dictLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Looking up...
                </div>
              ) : (
                <div className="space-y-4">
                  {dictPanelContent}
                </div>
              )}
            </WordPopup>
          </div>
        </>
      )}

      {/* Idle state: only show on desktop */}
      {panelMode === null && (
        <aside className="hidden lg:block w-80 shrink-0" style={{ alignSelf: 'start', position: 'sticky', top: '4rem' }}>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Dictionary</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Select a <span className="text-blue-500 font-medium">word</span> to translate,
              or select a <span className="text-green-500 font-medium">sentence</span> to save.
            </p>
          </div>
        </aside>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
