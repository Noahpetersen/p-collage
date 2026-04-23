import { useState } from 'react';
import type { FreeImage } from '../types';

const DEFAULT_W = 220;
const DEFAULT_H = 165;

export function useFreeLayout() {
  const [freeImages, setFreeImages] = useState<FreeImage[]>([]);

  function addFreeImage(imageId: string, x: number, y: number) {
    setFreeImages(prev => [...prev, {
      id: crypto.randomUUID(),
      imageId,
      x: x - DEFAULT_W / 2,
      y: y - DEFAULT_H / 2,
      width: DEFAULT_W,
      height: DEFAULT_H,
      rotation: 0,
      cropX: 0.5,
      cropY: 0.5,
    }]);
  }

  function moveFreeImage(id: string, x: number, y: number) {
    setFreeImages(prev => prev.map(f => f.id === id ? { ...f, x, y } : f));
  }

  function resizeFreeImage(id: string, width: number, height: number, rotation: number) {
    setFreeImages(prev => prev.map(f => f.id === id ? { ...f, width, height, rotation } : f));
  }

  function updateCrop(id: string, cropX: number, cropY: number) {
    setFreeImages(prev => prev.map(f => f.id === id ? { ...f, cropX, cropY } : f));
  }

  function removeFreeImage(id: string) {
    setFreeImages(prev => prev.filter(f => f.id !== id));
  }

  function clearFreeImages() {
    setFreeImages([]);
  }

  return { freeImages, addFreeImage, moveFreeImage, resizeFreeImage, updateCrop, removeFreeImage, clearFreeImages };
}
