import { useState, useEffect } from 'react';

export function useKonvaImage(url: string): HTMLImageElement | undefined {
  const [img, setImg] = useState<HTMLImageElement | undefined>(undefined);

  useEffect(() => {
    setImg(undefined);
    if (!url) return;
    const image = new window.Image();
    image.src = url;
    image.onload = () => setImg(image);
    image.onerror = () => setImg(undefined);
    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [url]);

  return img;
}
