import { useState, useRef } from 'react';
import type { UploadedImage } from '../../../types';
import { fetchSampleFiles } from './constants';

interface PhotosTabProps {
  images: UploadedImage[];
  onFiles: (files: FileList | File[]) => void;
  onRemoveImage: (id: string) => void;
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  onDragImageStart: (image: UploadedImage, x: number, y: number) => void;
  onDragImageMove: (x: number, y: number) => void;
  onDragImageEnd: (image: UploadedImage, x: number, y: number) => void;
  onDragImageCancel: () => void;
}

const DRAG_THRESHOLD = 8;

export default function PhotosTab({ images, onFiles, onRemoveImage, selectedImageId, onSelectImage, onDragImageStart, onDragImageMove, onDragImageEnd, onDragImageCancel }: PhotosTabProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  function handleThumbPointerDown(e: React.PointerEvent, img: UploadedImage) {
    if ((e.target as HTMLElement).closest('button')) return;

    const startX = e.clientX;
    const startY = e.clientY;
    let dragStarted = false;

    function onMove(ev: PointerEvent) {
      if (!dragStarted) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
        dragStarted = true;
        onDragImageStart(img, ev.clientX, ev.clientY);
      } else {
        onDragImageMove(ev.clientX, ev.clientY);
      }
    }

    function onUp(ev: PointerEvent) {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      if (dragStarted) {
        onDragImageEnd(img, ev.clientX, ev.clientY);
      } else {
        onSelectImage(img.id);
      }
    }

    // Fires when the browser takes over the gesture (e.g. for native scrolling
    // via touch-action: pan-y) — abort instead of dropping at the last position.
    function onCancel() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      if (dragStarted) onDragImageCancel();
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
  }

  async function handleLoadSamples() {
    setLoadingSamples(true);
    const files = await fetchSampleFiles();
    onFiles(files);
    setLoadingSamples(false);
  }

  function handlePhotoDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  }

  function handlePhotoInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      onFiles(e.target.files);
      e.target.value = '';
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="p-4 flex-shrink-0">
        <div
          onClick={() => photoInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handlePhotoDrop}
          className={`cursor-pointer rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2 h-24 ${
            isDragging ? 'border-accent bg-accent-soft' : 'border-line-strong hover:border-accent'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-ink-soft">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-ink-soft text-xs text-center font-sans">
            Drop photos or <span className="text-accent-deep underline">browse</span>
          </p>
        </div>
      </div>

      {import.meta.env.DEV && (
        <div className="px-4 pb-3 flex-shrink-0">
          <button
            onClick={handleLoadSamples}
            disabled={loadingSamples}
            className="w-full py-1.5 rounded-lg text-xs text-ink-soft hover:text-ink border border-line hover:border-line-strong transition-colors disabled:opacity-40 font-sans"
          >
            {loadingSamples ? 'Loading…' : 'DEV: load sample images'}
          </button>
        </div>
      )}

      {images.length > 0 && (
        <>
          <p className="px-4 pb-2 text-ink-soft text-xs font-sans">
            {selectedImageId
              ? 'Now tap a spot on the page to place it'
              : 'Tap a photo, then tap a spot on the page · Drag to move'}
          </p>
          <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4">
            <div className="grid grid-cols-4 gap-1.5">
              {images.map(img => (
                <div
                  key={img.id}
                  onPointerDown={e => handleThumbPointerDown(e, img)}
                  style={{ touchAction: 'pan-y' }}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-bg-soft group cursor-grab transition-all ${
                    selectedImageId === img.id ? 'ring-2 ring-accent ring-offset-1' : ''
                  }`}
                >
                  <img src={img.url} alt={img.name} draggable={false} className="w-full h-full object-cover pointer-events-none" />
                  <button
                    onClick={e => { e.stopPropagation(); onRemoveImage(img.id); }}
                    className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-black/50 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <input ref={photoInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoInputChange} />
    </div>
  );
}
