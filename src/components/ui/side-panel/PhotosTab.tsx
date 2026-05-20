import { useState, useRef } from 'react';
import type { UploadedImage } from '../../../types';
import { fetchSampleFiles } from './constants';

interface PhotosTabProps {
  images: UploadedImage[];
  onFiles: (files: FileList | File[]) => void;
  onRemoveImage: (id: string) => void;
}

export default function PhotosTab({ images, onFiles, onRemoveImage }: PhotosTabProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

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
    <div className="flex flex-col flex-1 overflow-hidden">
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
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          <div className="grid grid-cols-4 gap-1.5">
            {images.map(img => (
              <div
                key={img.id}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('imageId', img.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="relative aspect-square overflow-hidden rounded-lg bg-bg-soft group cursor-grab"
              >
                <img src={img.url} alt={img.name} draggable={false} className="w-full h-full object-cover pointer-events-none" />
                <button
                  onClick={() => onRemoveImage(img.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input ref={photoInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoInputChange} />
    </div>
  );
}
