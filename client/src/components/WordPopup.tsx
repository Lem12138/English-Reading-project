import { useEffect, useRef, useState } from 'react';

interface WordPopupProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export default function WordPopup({ x, y, onClose, children }: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x, top: y + 8 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: keep popup within viewport
    let left = x - rect.width / 2;
    if (left < 8) left = 8;
    if (left + rect.width > vw - 8) left = vw - rect.width - 8;

    // Vertical: prefer below selection, flip above if needed
    let top = y + 8;
    if (top + rect.height > vh - 8) {
      top = y - rect.height - 8;
    }
    if (top < 8) top = 8;

    setPos({ left, top });
  }, [x, y]);

  useEffect(() => {
    const handler = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 overflow-y-auto"
      style={{
        left: pos.left,
        top: pos.top,
        maxWidth: 'calc(100vw - 16px)',
        width: 'min(320px, calc(100vw - 24px))',
        maxHeight: '60vh',
      }}
    >
      {children}
    </div>
  );
}
