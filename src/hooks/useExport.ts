import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { createElement } from 'react';
import PdfDocument from '../components/export/PdfDocument';
import type { LayoutSlot, UploadedImage, CanvasDecoration, FreeImage } from '../types';
import { getCoverCrop } from '../utils/cropMath';
import { A4 } from '../constants';

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

async function resolveForPdf(url: string): Promise<string> {
  if (url.startsWith('data:image/svg+xml')) return svgToBase64(url);
  if (url.startsWith('blob:')) return blobToBase64(url);
  return url;
}

// Bake the cover-crop into a new canvas image so react-pdf gets a perfectly
// framed JPEG — no objectFit tricks needed.
function prerenderCropped(
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

export function useExport() {
  const [exporting, setExporting] = useState(false);

  async function exportPdf(
    slots: LayoutSlot[],
    images: UploadedImage[],
    bgColor: string,
    bgImageUrl: string | null,
    decorations: CanvasDecoration[],
    freeImages: FreeImage[],
    fileName = 'photo-book',
  ) {
    setExporting(true);
    try {
      // 1. Resolve all URLs to base64 in parallel
      const [resolvedBgImageUrl, resolvedDecorations, resolvedImageMap] = await Promise.all([
        bgImageUrl ? resolveForPdf(bgImageUrl) : Promise.resolve(null),
        Promise.all(decorations.map(async d => ({ ...d, url: await resolveForPdf(d.url) }))),
        Promise.all(images.map(async img => [img.id, await resolveForPdf(img.url)] as const))
          .then(entries => new Map(entries)),
      ]);

      // 2. Pre-render each photo with correct cover-crop baked in
      const [photoSlots, freePhotos] = await Promise.all([
        Promise.all(
          slots
            .filter(s => s.imageId && resolvedImageMap.has(s.imageId))
            .map(async (slot): Promise<PdfPhoto> => ({
              id: slot.id,
              src: await prerenderCropped(
                resolvedImageMap.get(slot.imageId!)!,
                slot.width, slot.height,
                slot.cropX ?? 0.5, slot.cropY ?? 0.5,
              ),
              x: slot.x, y: slot.y,
              width: slot.width, height: slot.height,
              rotation: 0,
              cornerRadius: slot.cornerRadius ?? 0,
            }))
        ),
        Promise.all(
          freeImages
            .filter(fi => resolvedImageMap.has(fi.imageId))
            .map(async (fi): Promise<PdfPhoto> => ({
              id: fi.id,
              src: await prerenderCropped(
                resolvedImageMap.get(fi.imageId)!,
                fi.width, fi.height,
                fi.cropX ?? 0.5, fi.cropY ?? 0.5,
              ),
              x: fi.x, y: fi.y,
              width: fi.width, height: fi.height,
              rotation: fi.rotation,
              cornerRadius: 0,
            }))
        ),
      ]);

      const blob = await pdf(
        createElement(PdfDocument, {
          bgColor,
          bgImageUrl: resolvedBgImageUrl,
          photoSlots,
          freePhotos,
          decorations: resolvedDecorations,
        })
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.trim() || 'photo-book'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return { exportPdf, exporting };
}
