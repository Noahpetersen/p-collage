import { useRef } from 'react';
import EditorCanvas from './components/editor/EditorCanvas';
import Navbar from './components/ui/Navbar';
import SidePanel from './components/ui/SidePanel';
import ExportModal from './components/ui/ExportModal';
import TitleInput from './components/ui/TitleInput';
import CloverLogo from './assets/PollenLogo.png';
import { useImages } from './hooks/useImages';
import { useLayout } from './hooks/useLayout';
import { useExport } from './hooks/useExport';
import { useDecorations } from './hooks/useDecorations';
import { useFreeLayout } from './hooks/useFreeLayout';
import { templates } from './templates';
import type { Template } from './types';
import { useState } from 'react';

function App() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showSlots, setShowSlots] = useState(true);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
  const [freeMode, setFreeMode] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0].id);
  const [fileName, setFileName] = useState('');
  const bgImageUrlRef = useRef<string | null>(null);

  function handleBgImageChange(url: string | null) {
    if (bgImageUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(bgImageUrlRef.current);
    }
    bgImageUrlRef.current = url;
    setBgImageUrl(url);
  }

  const { images, handleFiles, removeImage } = useImages();
  const { slots, assignImage, clearSlot, loadTemplate, updateCrop: updateSlotCrop } = useLayout(templates[0]);
  const { exportPdf, exporting } = useExport();
  const { decorations, addDecoration, moveDecoration, removeDecoration, resizeDecoration } = useDecorations();
  const { freeImages, addFreeImage, moveFreeImage, resizeFreeImage, updateCrop: updateFreeImageCrop, removeFreeImage, clearFreeImages } = useFreeLayout();

  function handleSelectTemplate(t: Template) {
    setFreeMode(false);
    setActiveTemplateId(t.id);
    loadTemplate(t);
  }

  function handleFreeMode() {
    setFreeMode(true);
    clearFreeImages();
  }

  return (
    <div className="min-h-screen bg-bg relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[42vw] h-[42vh]" style={{ background: 'radial-gradient(ellipse at top right, rgba(255, 182, 193, 0.38) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[38vw] h-[38vh]" style={{ background: 'radial-gradient(ellipse at bottom left, rgba(134, 210, 172, 0.32) 0%, transparent 70%)' }} />
      </div>
      <SidePanel
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
        bgColor={bgColor}
        onBgColorChange={setBgColor}
        bgImageUrl={bgImageUrl}
        onBgImageChange={handleBgImageChange}
        onAddDecoration={addDecoration}
        freeMode={freeMode}
        activeTemplateId={activeTemplateId}
        onFreeMode={handleFreeMode}
        images={images}
        onFiles={handleFiles}
        onRemoveImage={removeImage}
      />
      <TitleInput value={fileName} onChange={setFileName} />
      <div className="fixed top-5 left-5 z-40">
        <div
          className="flex items-center gap-2.5 pl-4 pr-6 py-3 rounded-2xl border"
          style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow-soft)' }}
        >
          <img src={CloverLogo} alt="Clover" className="h-7 w-auto" />
          <span className="text-[20px] font-semibold font-display tracking-[-0.02em] text-ink">Clover</span>
        </div>
      </div>
      <EditorCanvas
        slots={slots}
        images={images}
        bgColor={bgColor}
        bgImageUrl={bgImageUrl}
        decorations={decorations}
        showSlots={showSlots}
        freeMode={freeMode}
        freeImages={freeImages}
        onDropImage={assignImage}
        onClearSlot={clearSlot}
        onUpdateSlotCrop={updateSlotCrop}
        onMoveDecoration={moveDecoration}
        onRemoveDecoration={removeDecoration}
        onResizeDecoration={resizeDecoration}
        onDropFreeImage={addFreeImage}
        onMoveFreeImage={moveFreeImage}
        onResizeFreeImage={resizeFreeImage}
        onRemoveFreeImage={removeFreeImage}
        onUpdateFreeImageCrop={updateFreeImageCrop}
      />
      {showExportModal && (
        <ExportModal
          onConfirm={() => { setShowExportModal(false); exportPdf(slots, images, bgColor, bgImageUrl, decorations, freeImages, fileName); }}
          onCancel={() => setShowExportModal(false)}
        />
      )}
      <Navbar
        exporting={exporting}
        showSlots={showSlots}
        onExport={() => setShowExportModal(true)}
        onToggleSlots={() => setShowSlots(p => !p)}
      />
    </div>
  );
}

export default App;
