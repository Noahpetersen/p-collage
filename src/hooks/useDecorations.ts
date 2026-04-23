import { useState } from 'react';
import type { CanvasDecoration } from '../types';
import { A4 } from '../constants';

export function useDecorations() {
  const [decorations, setDecorations] = useState<CanvasDecoration[]>([]);

  function addDecoration(url: string) {
    const size = 80;
    setDecorations(prev => [...prev, {
      id: crypto.randomUUID(),
      x: A4.width / 2 - size / 2,
      y: A4.height / 2 - size / 2,
      size,
      rotation: 0,
      url,
    }]);
  }

  function moveDecoration(id: string, x: number, y: number) {
    setDecorations(prev => prev.map(d => d.id === id ? { ...d, x, y } : d));
  }

  function removeDecoration(id: string) {
    setDecorations(prev => prev.filter(d => d.id !== id));
  }

  function resizeDecoration(id: string, size: number, rotation: number) {
    setDecorations(prev => prev.map(d => d.id === id ? { ...d, size, rotation } : d));
  }

  return { decorations, addDecoration, moveDecoration, removeDecoration, resizeDecoration };
}
