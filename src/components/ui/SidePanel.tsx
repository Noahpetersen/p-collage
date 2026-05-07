import { useState, useRef } from 'react';
import { A4 } from '../../constants';
import type { Template, UploadedImage, CanvasText } from '../../types';
import { backgrounds } from '../../backgrounds';
import { stickers } from '../../decorations';

const TEXT_PRESETS: {
  label: string;
  meta: string;
  previewStyle: React.CSSProperties;
  partial: Omit<CanvasText, 'id' | 'x' | 'y'>;
}[] = [
  {
    label: 'Page title',
    meta: 'Plus Jakarta · 32pt',
    previewStyle: { fontFamily: "'Plus Jakarta Sans'", fontSize: 20, fontWeight: 700, color: '#1B2422' },
    partial: { text: 'Page title', fontFamily: 'Plus Jakarta Sans', fontSize: 32, bold: true, italic: false, underline: false, align: 'left', color: '#1B2422' },
  },
  {
    label: 'Subtitle or date',
    meta: 'Inter · 16pt',
    previewStyle: { fontFamily: "'Inter'", fontSize: 16, fontWeight: 500, color: '#1B2422' },
    partial: { text: 'Subtitle or date', fontFamily: 'Inter', fontSize: 16, bold: false, italic: false, underline: false, align: 'left', color: '#1B2422' },
  },
  {
    label: 'A short caption for a photo',
    meta: 'Inter italic · 12pt',
    previewStyle: { fontFamily: "'Inter'", fontSize: 13, fontStyle: 'italic', color: '#5C6661' },
    partial: { text: 'A short caption', fontFamily: 'Inter', fontSize: 12, bold: false, italic: true, underline: false, align: 'left', color: '#5C6661' },
  },
  {
    label: new Date().toLocaleDateString('de-DE'),
    meta: 'Mono · 11pt',
    previewStyle: { fontFamily: "'JetBrains Mono'", fontSize: 13, color: 'oklch(0.66 0.09 160)' },
    partial: { text: new Date().toLocaleDateString('de-DE'), fontFamily: 'JetBrains Mono', fontSize: 11, bold: false, italic: false, underline: false, align: 'left', color: 'oklch(0.66 0.09 160)' },
  },
];

const TEXT_COLORS = [
  '#ffffff',
  '#1B2422',
  '#7a7a82',
  'oklch(0.48 0.08 160)',
  'oklch(0.62 0.12 160)',
  '#f4a0b5',
  '#c4714a',
];

const FONT_FAMILIES = [
  'Plus Jakarta Sans',
  'Inter',
  'Nunito',
  'Lora',
  'Playfair Display',
  'Caveat',
  'Pacifico',
  'JetBrains Mono',
];

const THUMB_W = 100;
const THUMB_H = Math.round(THUMB_W * (A4.height / A4.width));
const SCALE = THUMB_W / A4.width;

const BG_PRESETS = [
  { label: 'White',    value: '#ffffff' },
  { label: 'Cream',    value: '#fdf6e3' },
  { label: 'Warm',     value: '#fef3c7' },
  { label: 'Rose',     value: '#fff1f2' },
  { label: 'Sky',      value: '#f0f9ff' },
  { label: 'Mint',     value: '#f0fdf4' },
  { label: 'Slate',    value: '#f1f5f9' },
  { label: 'Charcoal', value: '#1e293b' },
  { label: 'Black',    value: '#000000' },
];

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

type TabId = 'layouts' | 'photos' | 'background' | 'text' | 'stickers';

const TABS: { id: TabId; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'layouts',
    label: 'Layouts',
    description: 'Pick a template to arrange your photos.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'photos',
    label: 'Photos',
    description: 'Upload and drag photos onto the page.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    id: 'background',
    label: 'Background',
    description: 'Set the page color or pattern.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Text',
    description: 'Add labels and captions to your page.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 15v6m-1.5-1.5L17 21l1.5-1.5" />
      </svg>
    ),
  },
  {
    id: 'stickers',
    label: 'Stickers',
    description: 'Place decorations on your collage.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
];

function TemplateThumbnail({ template }: { template: Template }) {
  return (
    <svg width={THUMB_W} height={THUMB_H} viewBox={`0 0 ${THUMB_W} ${THUMB_H}`}
      className="rounded-md overflow-hidden flex-shrink-0" style={{ background: 'white' }}>
      {template.slots.map(s => (
        <rect key={s.id}
          x={s.x * SCALE} y={s.y * SCALE}
          width={s.width * SCALE} height={s.height * SCALE}
          rx={(s.cornerRadius ?? 0) * SCALE}
          fill="oklch(0.93 0.016 160)"
        />
      ))}
    </svg>
  );
}

interface SidePanelProps {
  templates: Template[];
  onSelectTemplate: (t: Template) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
  bgImageUrl: string | null;
  onBgImageChange: (url: string | null) => void;
  onAddDecoration: (url: string) => void;
  freeMode: boolean;
  activeTemplateId: string;
  onFreeMode: () => void;
  images: UploadedImage[];
  onFiles: (files: FileList | File[]) => void;
  onRemoveImage: (id: string) => void;
  selectedText: CanvasText | null;
  onAddText: (partial: Omit<CanvasText, 'id' | 'x' | 'y'>) => void;
  onUpdateText: (id: string, changes: Partial<CanvasText>) => void;
  onRemoveText: (id: string) => void;
}

export default function SidePanel({
  templates, onSelectTemplate,
  bgColor, onBgColorChange,
  bgImageUrl, onBgImageChange,
  onAddDecoration,
  freeMode, activeTemplateId, onFreeMode,
  images, onFiles, onRemoveImage,
  selectedText, onAddText, onUpdateText, onRemoveText,
}: SidePanelProps) {
  const [tab, setTab] = useState<TabId | null>('layouts');
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);

  async function handleLoadSamples() {
    setLoadingSamples(true);
    const files = await fetchSampleFiles();
    onFiles(files);
    setLoadingSamples(false);
  }

  function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    onBgImageChange(URL.createObjectURL(file));
    e.target.value = '';
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

  const currentTab = TABS.find(t => t.id === tab);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex gap-2 items-center">

      {/* Vertical icon pill */}
      <nav
        className="flex flex-col items-center gap-1 px-2 py-2 rounded-3xl border"
        style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow)' }}
      >
        {TABS.map(tabItem => (
          <button
            key={tabItem.id}
            onClick={() => setTab(prev => prev === tabItem.id ? null : tabItem.id)}
            title={tabItem.label}
            className={`w-16 h-16 flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors font-sans ${
              tab === tabItem.id
                ? 'bg-accent text-white'
                : 'text-ink-soft hover:bg-[rgba(27,36,34,0.05)] hover:text-ink'
            }`}
          >
            {tabItem.icon}
            <span className="text-[10px] font-medium leading-none">{tabItem.label}</span>
          </button>
        ))}
      </nav>

      {/* Content panel — only shown when a tab is active */}
      {currentTab && (
      <div
        className="w-[448px] h-[60vh] rounded-2xl border flex flex-col overflow-hidden"
        style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow)' }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-line flex-shrink-0 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold font-display tracking-[-0.025em] text-ink leading-tight">{currentTab.label}</h2>
            <p className="text-[13px] text-ink-soft font-sans mt-1">{currentTab.description}</p>
          </div>
          <button
            onClick={() => setTab(null)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-soft hover:text-ink hover:bg-[rgba(27,36,34,0.06)] transition-colors flex-shrink-0 mt-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Layouts tab */}
        {tab === 'layouts' && (
          <div className="overflow-y-auto p-4 flex-1">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={onFreeMode}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-colors group ${
                  freeMode
                    ? 'bg-accent-soft border-accent'
                    : 'border-transparent hover:bg-[rgba(27,36,34,0.04)]'
                }`}
              >
                <svg width={THUMB_W} height={THUMB_H} viewBox={`0 0 ${THUMB_W} ${THUMB_H}`}
                  className="rounded-md overflow-hidden flex-shrink-0" style={{ background: 'white' }}>
                  <rect x="4"  y="6"  width="22" height="16" rx="1" fill="oklch(0.93 0.016 160)" />
                  <rect x="30" y="4"  width="24" height="14" rx="1" fill="oklch(0.93 0.016 160)" />
                  <rect x="8"  y="27" width="18" height="20" rx="1" fill="oklch(0.93 0.016 160)" />
                  <rect x="29" y="22" width="26" height="18" rx="1" fill="oklch(0.93 0.016 160)" />
                  <rect x="6"  y="52" width="30" height="14" rx="1" fill="oklch(0.93 0.016 160)" />
                  <rect x="38" y="44" width="16" height="24" rx="1" fill="oklch(0.93 0.016 160)" />
                </svg>
                <span className={`text-[12px] leading-none transition-colors font-sans ${
                  freeMode ? 'text-accent-deep font-semibold' : 'text-ink-soft group-hover:text-ink'
                }`}>Free</span>
              </button>
              {templates.map(t => {
                const active = !freeMode && t.id === activeTemplateId;
                return (
                <button
                  key={t.id}
                  onClick={() => onSelectTemplate(t)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-colors group ${
                    active
                      ? 'bg-accent-soft border-accent'
                      : 'border-transparent hover:bg-[rgba(27,36,34,0.04)]'
                  }`}
                >
                  <TemplateThumbnail template={t} />
                  <span className={`text-[12px] leading-none transition-colors font-sans ${
                    active ? 'text-accent-deep font-semibold' : 'text-ink-soft group-hover:text-ink'
                  }`}>
                    {t.name}
                  </span>
                </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Photos tab */}
        {tab === 'photos' && (
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
          </div>
        )}

        {/* Background tab */}
        {tab === 'background' && (
          <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4">
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
              {/* Custom color picker square */}
              {(() => {
                const isCustom = !BG_PRESETS.some(p => p.value === bgColor);
                return (
                  <button
                    onClick={() => bgColorInputRef.current?.click()}
                    title="Custom color"
                    className={`aspect-square rounded-lg border-2 transition-all relative flex items-center justify-center overflow-hidden ${
                      isCustom ? 'border-accent scale-95' : 'border-line hover:border-line-strong'
                    }`}
                    style={{ background: isCustom ? bgColor : '#E7EBE4' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={isCustom ? 'white' : '#5C6661'} className="w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </button>
                );
              })()}
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
        )}

        {/* Text tab */}
        {tab === 'text' && (
          <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
            {TEXT_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => onAddText(preset.partial)}
                className="w-full text-left px-4 py-3 rounded-xl border border-line hover:border-line-strong bg-paper hover:bg-[rgba(27,36,34,0.01)] transition-colors"
              >
                <div style={preset.previewStyle}>{preset.label}</div>
                <div className="text-[11px] text-ink-soft font-sans mt-0.5">{preset.meta}</div>
              </button>
            ))}

            {selectedText && (
              <div className="mt-2 rounded-xl border border-line-strong bg-bg-soft overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-line flex-shrink-0 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold font-sans text-ink-soft tracking-widest uppercase truncate">
                    Selected · "{selectedText.text.length > 22 ? selectedText.text.slice(0, 22) + '…' : selectedText.text}"
                  </span>
                  <button
                    onClick={() => onRemoveText(selectedText.id)}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 flex flex-col gap-2.5">
                  {/* Text content */}
                  <textarea
                    value={selectedText.text}
                    onChange={e => onUpdateText(selectedText.id, { text: e.target.value })}
                    onBlur={() => { if (!selectedText.text.trim()) onRemoveText(selectedText.id); }}
                    rows={2}
                    className="w-full text-[13px] font-sans text-ink bg-paper border border-line rounded-lg px-3 py-2 outline-none focus:border-accent resize-none"
                  />
                  {/* Font + Size */}
                  <div className="flex gap-2">
                    <select
                      value={selectedText.fontFamily}
                      onChange={e => onUpdateText(selectedText.id, { fontFamily: e.target.value })}
                      className="flex-1 text-[13px] font-sans text-ink bg-paper border border-line rounded-lg px-2 py-1.5 outline-none focus:border-accent cursor-pointer"
                    >
                      {FONT_FAMILIES.map(f => <option key={f}>{f}</option>)}
                    </select>
                    <input
                      type="number"
                      value={selectedText.fontSize}
                      onChange={e => onUpdateText(selectedText.id, { fontSize: Math.max(6, Number(e.target.value)) })}
                      min={6} max={200}
                      className="w-14 text-[13px] font-sans text-ink text-center bg-paper border border-line rounded-lg px-2 py-1.5 outline-none focus:border-accent"
                    />
                  </div>
                  {/* Format + Align */}
                  <div className="flex gap-1 flex-wrap">
                    {([
                      { key: 'bold', label: 'B', style: 'font-bold' },
                      { key: 'italic', label: 'I', style: 'italic' },
                      { key: 'underline', label: 'U', style: 'underline' },
                    ] as const).map(btn => (
                      <button
                        key={btn.key}
                        onClick={() => onUpdateText(selectedText.id, { [btn.key]: !selectedText[btn.key] })}
                        className={`w-8 h-8 rounded-lg text-[13px] font-sans transition-colors ${btn.style} ${
                          selectedText[btn.key] ? 'bg-accent text-white' : 'bg-paper border border-line text-ink-soft hover:text-ink'
                        }`}
                      >{btn.label}</button>
                    ))}
                    <div className="w-px bg-line mx-0.5 self-stretch" />
                    {(['left', 'center', 'right'] as const).map(a => (
                      <button
                        key={a}
                        onClick={() => onUpdateText(selectedText.id, { align: a })}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          selectedText.align === a ? 'bg-accent text-white' : 'bg-paper border border-line text-ink-soft hover:text-ink'
                        }`}
                      >
                        <svg viewBox="0 0 14 12" className="w-3.5 h-3" fill="none">
                          <line x1={a === 'right' ? 0 : 0} y1="1" x2="14" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line
                            x1={a === 'center' ? 2 : a === 'right' ? 4 : 0}
                            y1="5.5"
                            x2={a === 'center' ? 12 : a === 'right' ? 14 : 9}
                            y2="5.5"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                          />
                          <line
                            x1={a === 'center' ? 1 : a === 'right' ? 3 : 0}
                            y1="10"
                            x2={a === 'center' ? 13 : a === 'right' ? 14 : 11}
                            y2="10"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {/* Color swatches */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[12px] text-ink-soft font-sans">Color</span>
                    <div className="flex gap-1.5">
                      {TEXT_COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => onUpdateText(selectedText.id, { color: c })}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            selectedText.color === c ? 'border-ink scale-90' : 'border-transparent hover:scale-95'
                          }`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stickers tab */}
        {tab === 'stickers' && (
          <div className="overflow-y-auto flex-1 p-4">
            <p className="text-ink-soft text-xs px-1 pb-2 font-sans">Click to place · Drag to move · Click to remove</p>
            <div className="grid grid-cols-4 gap-2">
              {stickers.map(sticker => (
                <button
                  key={sticker.id}
                  onClick={() => onAddDecoration(sticker.url)}
                  title={sticker.name}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-[rgba(27,36,34,0.04)] transition-colors group"
                >
                  <img src={sticker.url} alt={sticker.name} className="w-10 h-10" />
                  <span className="text-ink-soft text-[10px] group-hover:text-ink transition-colors font-sans">{sticker.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
      )}

      <input ref={photoInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoInputChange} />
    </div>
  );
}
