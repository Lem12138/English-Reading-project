import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import type { EssayDetail, DictResult, EssayVersion } from '../types';
import WordPopup from '../components/WordPopup';

const LEVEL_COLOR: Record<string, string> = {
  'CET-4': 'bg-emerald-50 text-emerald-600',
  'CET-6': 'bg-blue-50 text-blue-600',
  'TEM-8': 'bg-purple-50 text-purple-600',
};

export default function EssayReader() {
  const { id } = useParams<{ id: string }>();
  const [essay, setEssay] = useState<EssayDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [panelMode, setPanelMode] = useState<'word' | 'sentence' | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [dictResult, setDictResult] = useState<DictResult | null>(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.essays.get(parseInt(id))
      .then((data) => setEssay(data.essay))
      .finally(() => setLoading(false));
    api.essayHistory.record(parseInt(id)).catch(() => {});
    api.essayFavorites.check(parseInt(id)).then(d => setFavorited(d.favorited)).catch(() => {});
  }, [id]);

  const handleToggleFav = async () => {
    if (!id) return;
    try {
      const res = await api.essayFavorites.toggle(parseInt(id));
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
    const now = Date.now();
    if (now - lastSelectionRef.current < 500) return;
    lastSelectionRef.current = now;

    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      const text = selection.toString().trim();
      if (!text) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPopupPos({ x: rect.left + rect.width / 2, y: rect.bottom });

      setSelectedText(text);
      setPanelMode(/^[a-zA-Z]+$/.test(text) ? 'word' : 'sentence');
      setDictLoading(true);
      setDictResult(null);
      api.dict.lookup(text)
        .then((data) => setDictResult(data.result))
        .finally(() => setDictLoading(false));
    }, 0);
  }, []);

  const savingWord = useRef(false);
  const savingSentence = useRef(false);

  const handleSaveWord = () => {
    if (!dictResult || !id) {
      setToast(!dictResult ? 'Waiting for lookup...' : 'No essay id');
      return;
    }
    if (savingWord.current) return;
    savingWord.current = true;
    api.words.save({
      word: dictResult.word,
      phonetic: dictResult.phonetic,
      translation: dictResult.translation,
      enDefinition: dictResult.enDefinitions?.[0]?.definition || '',
    }).then(() => {
      setToast(`"${dictResult.word}" saved to My Words`);
    }).catch((e: any) => {
      setToast(e?.message || 'Save failed');
    }).finally(() => { savingWord.current = false; });
  };

  const handleSaveSentence = () => {
    if (!selectedText || !id) {
      setToast(!selectedText ? 'No text selected' : 'No essay id');
      return;
    }
    if (savingSentence.current) return;
    savingSentence.current = true;
    api.sentences.save({
      sentence: selectedText,
      translation: dictResult?.translation || '',
    }).then(() => {
      setToast('Sentence saved');
    }).catch((e: any) => {
      setToast(e?.message || 'Save failed');
    }).finally(() => { savingSentence.current = false; });
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading essay...</div>;
  }
  if (!essay) {
    return <div className="text-center py-12 text-gray-400">Essay not found</div>;
  }

  const versions: EssayVersion[] = Array.isArray(essay.content) ? essay.content as unknown as EssayVersion[] : [];

  const dictPanelContent = (
    <>
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          {panelMode === 'word' ? 'Selected Word' : 'Selected Text'}
        </h4>
        <p className="text-lg font-bold text-gray-900">{selectedText}</p>
        {dictResult?.phonetic && (
          <p className="text-sm text-gray-400 mt-0.5">{dictResult.phonetic}</p>
        )}
      </div>
      {dictResult && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Translation</h4>
          <p className="text-base text-blue-700 leading-relaxed">{dictResult.translation}</p>
        </div>
      )}
      {dictResult?.enDefinitions && dictResult.enDefinitions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">English Definition</h4>
          <ul className="space-y-2">
            {dictResult.enDefinitions.map((d, i) => (
              <li key={i} className="text-sm text-gray-700">
                <span className="text-xs text-gray-400 italic">{d.partOfSpeech}</span>
                <p className="mt-0.5">{d.definition}</p>
                {d.example && <p className="text-xs text-gray-400 mt-0.5 italic">"{d.example}"</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dictResult?.explains && dictResult.explains.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Details</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {dictResult.explains.map((e, i) => (
              <li key={i} className="pl-2 border-l-2 border-gray-200">{e}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-2 pt-2 border-t border-gray-100 sticky bottom-0 bg-white">
        {panelMode === 'word' ? (
          <button
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); handleSaveWord(); }}
            onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); handleSaveWord(); }}
            className="flex-1 text-sm py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >Save Word</button>
        ) : (
          <button
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); handleSaveSentence(); }}
            onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); handleSaveSentence(); }}
            className="flex-1 text-sm py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >Save Sentence</button>
        )}
      </div>
    </>
  );

  return (
    <div className="flex gap-8 max-w-7xl mx-auto relative">
      <article className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full font-semibold text-xs tracking-wide uppercase ${LEVEL_COLOR[essay.level] || 'bg-gray-50 text-gray-600'}`}>
                {essay.level}
              </span>
              <span className="text-xs text-gray-400 uppercase font-medium">
                {essay.type === 'writing' ? 'Writing' : 'Translation'}
              </span>
              <span className="text-xs text-gray-400">{essay.examDate}</span>
            </div>
            <button
              onClick={handleToggleFav}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                favorited
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-300'
                  : 'bg-white text-gray-400 border border-gray-200 hover:border-yellow-300 hover:text-yellow-600'
              }`}
            >
              {favorited ? '★ Collected' : '☆ Collect'}
            </button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-6">
            {essay.title}
          </h1>

          {/* Prompt */}
          <div
            className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8"
            onMouseUp={handleSelection}
            onTouchEnd={handleSelection}
          >
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Prompt</h3>
            <div className="text-sm text-gray-600 leading-relaxed">
              {essay.prompt.split('\n').filter(Boolean).map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {essay.type === 'writing' && versions.length > 0 && (
          <div className="space-y-10">
            {versions.map((v, i) => (
              <div key={i}>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">
                  Sample Essay {i + 1}
                </h3>
                <div
                  className="text-lg text-gray-800 leading-[1.8] tracking-[0.01em] bg-white border border-gray-100 rounded-xl p-8"
                  onMouseUp={handleSelection}
                  onTouchEnd={handleSelection}
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                >
                  {v.essay.split(/\n\n+/).filter(Boolean).map((p, j) => {
                    const trimmed = p.trim();
                    if (!trimmed) return null;
                    return <p key={j} className="mb-4" style={{ textIndent: '2em' }}>{trimmed}</p>;
                  })}
                </div>

                {/* Chinese translation toggle */}
                {v.translation && (
                  <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">Chinese Translation</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{v.translation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Translation type */}
        {essay.type === 'translation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Reference Translation</h3>
              <div
                className="text-lg text-gray-800 leading-[1.8] tracking-[0.01em] bg-white border border-gray-100 rounded-xl p-8"
                onMouseUp={handleSelection}
                onTouchEnd={handleSelection}
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                {(typeof essay.content === 'string' ? essay.content : '').split(/\n\n+/).filter(Boolean).map((p, j) => {
                  const trimmed = p.trim();
                  if (!trimmed) return null;
                  return <p key={j} className="mb-4">{trimmed}</p>;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Highlights */}
        {essay.highlights && (
          <div className="mt-10 p-6 bg-amber-50/50 border border-amber-100 rounded-xl">
            <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wide mb-3">Key Expressions & Highlights</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{essay.highlights}</div>
          </div>
        )}
      </article>

      {/* Dict panel (desktop) */}
      {panelMode !== null && (
        <>
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
          {/* Mobile popup */}
          <div className="lg:hidden">
            <WordPopup x={popupPos.x} y={popupPos.y} onClose={() => setPanelMode(null)}>
              {dictLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Looking up...
                </div>
              ) : (
                <div className="space-y-4">{dictPanelContent}</div>
              )}
            </WordPopup>
          </div>
        </>
      )}

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

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
