import type { CSSProperties } from 'react';
import type { CanvasText } from '../../../types';
import { A4 } from '../../../constants';

export type TabId = 'layouts' | 'photos' | 'background' | 'text' | 'stickers';

export const THUMB_W = 100;
export const THUMB_H = Math.round(THUMB_W * (A4.height / A4.width));
export const SCALE = THUMB_W / A4.width;

export const TEXT_PRESETS: {
  label: string;
  meta: string;
  previewStyle: CSSProperties;
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

export const TEXT_COLORS = [
  '#ffffff',
  '#1B2422',
  '#7a7a82',
  'oklch(0.48 0.08 160)',
  'oklch(0.62 0.12 160)',
  '#f4a0b5',
  '#c4714a',
];

export const FONT_FAMILIES = [
  'Plus Jakarta Sans',
  'Inter',
  'Nunito',
  'Lora',
  'Playfair Display',
  'Caveat',
  'Pacifico',
  'JetBrains Mono',
];

export const BG_PRESETS = [
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

export const DEV_SAMPLE_URLS = [
  'https://picsum.photos/seed/child1/800/600',
  'https://picsum.photos/seed/child2/800/600',
  'https://picsum.photos/seed/child3/800/600',
  'https://picsum.photos/seed/child4/800/600',
  'https://picsum.photos/seed/child5/800/600',
  'https://picsum.photos/seed/child6/800/600',
];

export async function fetchSampleFiles(): Promise<File[]> {
  return Promise.all(
    DEV_SAMPLE_URLS.map(async (url, i) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], `sample-${i + 1}.jpg`, { type: 'image/jpeg' });
    })
  );
}

export const TABS: { id: TabId; label: string; description: string; icon: React.ReactNode }[] = [
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
