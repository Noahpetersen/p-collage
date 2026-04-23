import { useState, useRef } from 'react';
import { A4 } from '../../constants';
import type { Template } from '../../types';
import { backgrounds } from '../../backgrounds';
import { stickers } from '../../decorations';

const THUMB_W = 58;
const THUMB_H = Math.round(THUMB_W * (A4.height / A4.width));
const SCALE = THUMB_W / A4.width;

const BG_PRESETS = [
  { label: 'White',   value: '#ffffff' },
  { label: 'Cream',   value: '#fdf6e3' },
  { label: 'Warm',    value: '#fef3c7' },
  { label: 'Rose',    value: '#fff1f2' },
  { label: 'Sky',     value: '#f0f9ff' },
  { label: 'Mint',    value: '#f0fdf4' },
  { label: 'Slate',   value: '#f1f5f9' },
  { label: 'Charcoal',value: '#1e293b' },
  { label: 'Black',   value: '#000000' },
];

interface SidePanelProps {
  templates: Template[];
  onSelectTemplate: (t: Template) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
  bgImageUrl: string | null;
  onBgImageChange: (url: string | null) => void;
  onAddDecoration: (url: string) => void;
  freeMode: boolean;
  onFreeMode: () => void;
}

function TemplateThumbnail({ template }: { template: Template }) {
  return (
    <svg width={THUMB_W} height={THUMB_H} viewBox={`0 0 ${THUMB_W} ${THUMB_H}`}
      className="rounded-md overflow-hidden flex-shrink-0" style={{ background: 'white' }}>
      {template.slots.map(s => (
        <rect key={s.id}
          x={s.x * SCALE} y={s.y * SCALE}
          width={s.width * SCALE} height={s.height * SCALE}
          rx={(s.cornerRadius ?? 0) * SCALE}
          fill="#d1d5db"
        />
      ))}
    </svg>
  );
}

export default function SidePanel({ templates, onSelectTemplate, bgColor, onBgColorChange, bgImageUrl, onBgImageChange, onAddDecoration, freeMode, onFreeMode }: SidePanelProps) {
  const [tab, setTab] = useState<'templates' | 'background' | 'decorations'>('templates');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    onBgImageChange(URL.createObjectURL(file));
    e.target.value = '';
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-102 flex flex-col h-[60vh]">
      <div className="rounded-2xl bg-gray-900/90 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-white/10 flex-shrink-0">
          {(['templates', 'background', 'decorations'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs capitalize transition-colors ${
                tab === t ? 'text-white border-b-2 border-white/60' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Templates tab */}
        {tab === 'templates' && (
          <div className="overflow-y-auto p-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Free arrange mode */}
              <button
                onClick={onFreeMode}
                className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-colors group ${
                  freeMode ? 'bg-white/15' : 'hover:bg-white/10'
                }`}
              >
                <svg width={THUMB_W} height={THUMB_H} viewBox={`0 0 ${THUMB_W} ${THUMB_H}`}
                  className="rounded-md overflow-hidden flex-shrink-0" style={{ background: 'white' }}>
                  <rect x="4"  y="6"  width="22" height="16" rx="1" fill="#d1d5db" />
                  <rect x="30" y="4"  width="24" height="14" rx="1" fill="#d1d5db" />
                  <rect x="8"  y="27" width="18" height="20" rx="1" fill="#d1d5db" />
                  <rect x="29" y="22" width="26" height="18" rx="1" fill="#d1d5db" />
                  <rect x="6"  y="52" width="30" height="14" rx="1" fill="#d1d5db" />
                  <rect x="38" y="44" width="16" height="24" rx="1" fill="#d1d5db" />
                </svg>
                <span className={`text-[10px] leading-none transition-colors ${
                  freeMode ? 'text-white/80' : 'text-white/50 group-hover:text-white/80'
                }`}>Free</span>
              </button>
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => onSelectTemplate(t)}
                  className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <TemplateThumbnail template={t} />
                  <span className="text-white/50 text-[10px] group-hover:text-white/80 transition-colors leading-none">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Background tab */}
        {tab === 'background' && (
          <div className="p-3 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {BG_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => onBgColorChange(preset.value)}
                  title={preset.label}
                  className={`aspect-square rounded-lg border-2 transition-all ${
                    bgColor === preset.value ? 'border-white/70 scale-95' : 'border-white/10 hover:border-white/30'
                  }`}
                  style={{ background: preset.value }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-white/40 text-xs">Custom</label>
              <input
                type="color"
                value={bgColor}
                onChange={e => onBgColorChange(e.target.value)}
                className="flex-1 h-7 rounded-lg cursor-pointer bg-transparent border border-white/10"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 rounded-xl text-xs text-white/60 hover:text-white border border-dashed border-white/20 hover:border-white/40 transition-colors"
            >
              Upload background image
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
            <p className="text-white/40 text-xs">Pattern</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onBgImageChange(null)}
                className={`rounded-lg border-2 transition-all h-14 flex items-center justify-center text-white/40 text-xs ${
                  bgImageUrl === null ? 'border-white/70' : 'border-white/10 hover:border-white/30'
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
                    bgImageUrl === bg.url ? 'border-white/70' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Decorations tab */}
        {tab === 'decorations' && (
          <div className="overflow-y-auto p-2">
            <p className="text-white/40 text-xs px-1 pb-2">Click to place · Drag to move · Click to remove</p>
            <div className="grid grid-cols-3 gap-2">
              {stickers.map(sticker => (
                <button
                  key={sticker.id}
                  onClick={() => onAddDecoration(sticker.url)}
                  title={sticker.name}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <img src={sticker.url} alt={sticker.name} className="w-10 h-10" />
                  <span className="text-white/40 text-[10px] group-hover:text-white/70 transition-colors">{sticker.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
