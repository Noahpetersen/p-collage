import { useRef } from 'react';
import { backgrounds } from '../../../backgrounds';
import { BG_PRESETS } from './constants';

interface BackgroundTabProps {
  bgColor: string;
  onBgColorChange: (color: string) => void;
  bgImageUrl: string | null;
  onBgImageChange: (url: string | null) => void;
}

export default function BackgroundTab({ bgColor, onBgColorChange, bgImageUrl, onBgImageChange }: BackgroundTabProps) {
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);

  function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    onBgImageChange(URL.createObjectURL(file));
    e.target.value = '';
  }

  const isCustomColor = !BG_PRESETS.some(p => p.value === bgColor);

  return (
    <div className="overflow-y-auto flex-1 min-h-0">
      <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2">
        {BG_PRESETS.map(preset => (
          <button
            key={preset.value}
            onClick={() => onBgColorChange(preset.value)}
            title={preset.label}
            className={`aspect-square rounded-lg border-2 transition-all ${
              bgColor === preset.value ? 'border-accent scale-95' : 'border-line hover:border-line-strong'
            }`}
            style={{ background: preset.value }}
          />
        ))}
        <button
          onClick={() => bgColorInputRef.current?.click()}
          title="Custom color"
          className={`aspect-square rounded-lg border-2 transition-all relative flex items-center justify-center overflow-hidden ${
            isCustomColor ? 'border-accent scale-95' : 'border-line hover:border-line-strong'
          }`}
          style={{ background: isCustomColor ? bgColor : '#E7EBE4' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={isCustomColor ? 'white' : '#5C6661'} className="w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
      </div>

      <input
        ref={bgColorInputRef}
        type="color"
        value={bgColor}
        onChange={e => onBgColorChange(e.target.value)}
        className="sr-only"
      />

      <button
        onClick={() => bgFileInputRef.current?.click()}
        className="w-full py-2 rounded-xl text-xs text-ink-soft hover:text-ink border border-dashed border-line-strong hover:border-accent transition-colors font-sans"
      >
        Upload background image
      </button>
      <input ref={bgFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />

      <p className="text-ink-soft text-xs font-sans">Pattern</p>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onBgImageChange(null)}
          className={`rounded-lg border-2 transition-all h-14 flex items-center justify-center text-ink-soft text-xs font-sans ${
            bgImageUrl === null ? 'border-accent' : 'border-line hover:border-line-strong'
          }`}
        >
          None
        </button>
        {backgrounds.map(bg => (
          <button
            key={bg.id}
            onClick={() => onBgImageChange(bg.url)}
            title={bg.name}
            className={`rounded-lg border-2 transition-all h-14 overflow-hidden ${
              bgImageUrl === bg.url ? 'border-accent' : 'border-line hover:border-line-strong'
            }`}
          >
            <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
