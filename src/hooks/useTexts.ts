import { useState } from 'react';
import type { CanvasText } from '../types';
import { A4 } from '../constants';
import { generateId } from '../utils/id';

export function useTexts() {
  const [texts, setTexts] = useState<CanvasText[]>([]);

  function addText(partial: Omit<CanvasText, 'id' | 'x' | 'y'>) {
    setTexts(prev => [...prev, {
      ...partial,
      id: generateId(),
      x: Math.round(A4.width / 4),
      y: Math.round(A4.height / 2 - partial.fontSize),
    }]);
  }

  function moveText(id: string, x: number, y: number) {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
  }

  function updateText(id: string, changes: Partial<CanvasText>) {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));
  }

  function removeText(id: string) {
    setTexts(prev => prev.filter(t => t.id !== id));
  }

  return { texts, addText, moveText, updateText, removeText };
}
