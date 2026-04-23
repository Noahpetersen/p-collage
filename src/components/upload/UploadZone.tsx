import { useRef, useState } from 'react';

const DEV_SAMPLE_URLS = [
  'https://picsum.photos/seed/child1/800/600',
  'https://picsum.photos/seed/child2/800/600',
  'https://picsum.photos/seed/child3/800/600',
  'https://picsum.photos/seed/child4/800/600',
  'https://picsum.photos/seed/child5/800/600',
  'https://picsum.photos/seed/child6/800/600',
];

async function fetchSampleFiles(): Promise<File[]> {
  const results = await Promise.all(
    DEV_SAMPLE_URLS.map(async (url, i) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], `sample-${i + 1}.jpg`, { type: 'image/jpeg' });
    })
  );
  return results;
}
import type { UploadedImage } from '../../types';

interface UploadZoneProps {
  images: UploadedImage[];
  onFiles: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export default function UploadZone({ images, onFiles, onRemove, onClose }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleLoadSamples() {
    setLoadingSamples(true);
    const files = await fetchSampleFiles();
    onFiles(files);
    setLoadingSamples(false);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    onFiles(e.dataTransfer.files);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      onFiles(e.target.files);
      e.target.value = '';
    }
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-72">
      <div className="rounded-2xl bg-gray-900/90 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            cursor-pointer m-2 rounded-xl border-2 border-dashed transition-colors
            flex flex-col items-center justify-center gap-2 h-32
            ${isDragging ? 'border-white/70 bg-white/10' : 'border-white/20 hover:border-white/40'}
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white/40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-white/40 text-xs text-center">
            Drop photos or <span className="text-white/70 underline">browse</span>
          </p>
        </div>

        {import.meta.env.DEV && (
          <button
            onClick={handleLoadSamples}
            disabled={loadingSamples}
            className="mx-2 mb-2 w-[calc(100%-1rem)] py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 transition-colors disabled:opacity-40"
          >
            {loadingSamples ? 'Loading…' : 'DEV: load sample images'}
          </button>
        )}

        {/* Thumbnail grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-1.5 px-2 pb-2">
            {images.map(img => (
              <div
                key={img.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('imageId', img.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="relative aspect-square overflow-hidden rounded-lg bg-black/20 group cursor-grab"
              >
                <img src={img.url} alt={img.name} draggable={false} className="w-full h-full object-cover pointer-events-none" />
                <button
                  onClick={() => onRemove(img.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
