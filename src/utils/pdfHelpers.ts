import { A4 } from '../constants';
import { getCoverCrop } from './cropMath';

export interface PdfPhoto {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  cornerRadius: number;
}

export function resolveColor(color: string): string {
  if (color.startsWith('#')) return color;
  // Canvas converts any CSS color (oklch, hsl, named, etc.) to sRGB integers
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function svgToBase64(svgUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = A4.width;
      canvas.height = A4.height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, A4.width, A4.height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
}

async function blobToBase64(blobUrl: string): Promise<string> {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function resolveForPdf(url: string): Promise<string> {
  if (url.startsWith('data:image/svg+xml')) return svgToBase64(url);
  if (url.startsWith('blob:')) return blobToBase64(url);
  return Promise.resolve(url);
}

export function prerenderCropped(
  resolvedUrl: string,
  slotW: number,
  slotH: number,
  cropX: number,
  cropY: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      // 2× for sharper output
      const outW = Math.round(slotW * 2);
      const outH = Math.round(slotH * 2);
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d')!;
      const crop = getCoverCrop(img.naturalWidth, img.naturalHeight, slotW, slotH, cropX, cropY);
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, outW, outH);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = reject;
    img.src = resolvedUrl;
  });
}
