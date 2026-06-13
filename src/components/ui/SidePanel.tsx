import { useState } from 'react';
import type { Template, UploadedImage, CanvasText } from '../../types';
import { TABS, type TabId } from './side-panel/constants';
import LayoutsTab from './side-panel/LayoutsTab';
import PhotosTab from './side-panel/PhotosTab';
import BackgroundTab from './side-panel/BackgroundTab';
import TextTab from './side-panel/TextTab';
import StickersTab from './side-panel/StickersTab';

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
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  onDragImageStart: (image: UploadedImage, x: number, y: number) => void;
  onDragImageMove: (x: number, y: number) => void;
  onDragImageEnd: (image: UploadedImage, x: number, y: number) => void;
  onDragImageCancel: () => void;
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
  selectedImageId, onSelectImage,
  onDragImageStart, onDragImageMove, onDragImageEnd, onDragImageCancel,
  selectedText, onAddText, onUpdateText, onRemoveText,
}: SidePanelProps) {
  const [tab, setTab] = useState<TabId | null>('layouts');
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
            className={`side-tab-btn flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors font-sans ${
              tab === tabItem.id
                ? 'bg-accent text-white'
                : 'text-ink-soft hover:bg-[rgba(27,36,34,0.05)] hover:text-ink'
            }`}
          >
            {tabItem.icon}
            <span className="side-tab-label text-[10px] font-medium leading-none">{tabItem.label}</span>
          </button>
        ))}
      </nav>

      {/* Content panel — only shown when a tab is active */}
      {currentTab && (
        <div
          className="side-panel-content rounded-2xl border flex flex-col overflow-hidden"
          style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow)' }}
        >
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

          {tab === 'layouts' && (
            <LayoutsTab
              templates={templates}
              freeMode={freeMode}
              activeTemplateId={activeTemplateId}
              onSelectTemplate={onSelectTemplate}
              onFreeMode={onFreeMode}
            />
          )}
          {tab === 'photos' && (
            <PhotosTab
              images={images}
              onFiles={onFiles}
              onRemoveImage={onRemoveImage}
              selectedImageId={selectedImageId}
              onSelectImage={onSelectImage}
              onDragImageStart={onDragImageStart}
              onDragImageMove={onDragImageMove}
              onDragImageEnd={onDragImageEnd}
              onDragImageCancel={onDragImageCancel}
            />
          )}
          {tab === 'background' && (
            <BackgroundTab
              bgColor={bgColor}
              onBgColorChange={onBgColorChange}
              bgImageUrl={bgImageUrl}
              onBgImageChange={onBgImageChange}
            />
          )}
          {tab === 'text' && (
            <TextTab
              selectedText={selectedText}
              onAddText={onAddText}
              onUpdateText={onUpdateText}
              onRemoveText={onRemoveText}
            />
          )}
          {tab === 'stickers' && (
            <StickersTab onAddDecoration={onAddDecoration} />
          )}
        </div>
      )}
    </div>
  );
}
