import { useState, useEffect, useRef } from 'react';
import type { UploadedImage } from '../types';

export function useImages() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const imagesRef = useRef<UploadedImage[]>([]);
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, []);

  function handleFiles(files: FileList | File[]) {
    const accepted = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newImages: UploadedImage[] = accepted.map(file => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages(prev => [...prev, ...newImages]);
  }

  function removeImage(id: string) {
    setImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(img => img.id !== id);
    });
  }

  return { images, handleFiles, removeImage };
}
