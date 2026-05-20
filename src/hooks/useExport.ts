import { useState, createElement } from 'react';
import { pdf } from '@react-pdf/renderer';
import PdfDocument from '../components/export/PdfDocument';
import type { LayoutSlot, UploadedImage, CanvasDecoration, FreeImage, CanvasText } from '../types';
import { resolveColor, resolveForPdf, prerenderCropped, type PdfPhoto } from '../utils/pdfHelpers';

export type { PdfPhoto };

export function useExport() {
  const [exporting, setExporting] = useState(false);

  async function exportPdf(
    slots: LayoutSlot[],
    images: UploadedImage[],
    bgColor: string,
    bgImageUrl: string | null,
    decorations: CanvasDecoration[],
    freeImages: FreeImage[],
    texts: CanvasText[],
    fileName = 'photo-book',
  ) {
    setExporting(true);
    try {
      const [resolvedBgImageUrl, resolvedDecorations, resolvedImageMap] = await Promise.all([
        bgImageUrl ? resolveForPdf(bgImageUrl) : Promise.resolve(null),
        Promise.all(decorations.map(async d => ({ ...d, url: await resolveForPdf(d.url) }))),
        Promise.all(images.map(async img => [img.id, await resolveForPdf(img.url)] as const))
          .then(entries => new Map(entries)),
      ]);

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

      const resolvedTexts = texts.map(t => ({ ...t, color: resolveColor(t.color) }));

      const blob = await pdf(
        createElement(PdfDocument as any, {
          bgColor,
          bgImageUrl: resolvedBgImageUrl,
          photoSlots,
          freePhotos,
          decorations: resolvedDecorations,
          texts: resolvedTexts,
        }) as any
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.trim() || 'untitled'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[PDF export failed]', err);
      alert('PDF export failed. Check the browser console for details.');
    } finally {
      setExporting(false);
    }
  }

  return { exportPdf, exporting };
}
