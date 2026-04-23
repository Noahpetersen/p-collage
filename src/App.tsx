import { useState, useRef } from 'react';
import EditorCanvas from './components/editor/EditorCanvas';
import Navbar from './components/ui/Navbar';
import UploadZone from './components/upload/UploadZone';
import SidePanel from './components/ui/SidePanel';
import ExportModal from './components/ui/ExportModal';
import { useImages } from './hooks/useImages';
import { useLayout } from './hooks/useLayout';
import { useExport } from './hooks/useExport';
import { useDecorations } from './hooks/useDecorations';
import { useFreeLayout } from './hooks/useFreeLayout';
import { templates } from './templates';
import type { Template } from './types';

function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showSlots, setShowSlots] = useState(true);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
  const [freeMode, setFreeMode] = useState(false);
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

  function handleNavClick(index: number) {
    if (index === 0) setShowUpload(prev => !prev);
    if (index === 1) { setShowExportModal(true); setShowUpload(false); }
  }

  function handleSelectTemplate(t: Template) {
    setFreeMode(false);
    loadTemplate(t);
  }

  function handleFreeMode() {
    setFreeMode(true);
    clearFreeImages();
  }

  return (
    <div className="min-h-screen bg-gray-200">
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
      <SidePanel
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
        bgColor={bgColor}
        onBgColorChange={setBgColor}
        bgImageUrl={bgImageUrl}
        onBgImageChange={handleBgImageChange}
        onAddDecoration={addDecoration}
        freeMode={freeMode}
        onFreeMode={handleFreeMode}
      />
      {showUpload && (
        <UploadZone
          images={images}
          onFiles={handleFiles}
          onRemove={removeImage}
          onClose={() => setShowUpload(false)}
        />
      )}
      {showExportModal && (
        <ExportModal
          onConfirm={() => { setShowExportModal(false); exportPdf(slots, images, bgColor, bgImageUrl, decorations, freeImages); }}
          onCancel={() => setShowExportModal(false)}
        />
      )}
      <Navbar
        activeIndex={showUpload ? 0 : exporting ? 2 : null}
        showSlots={showSlots}
        onNavClick={handleNavClick}
        onToggleSlots={() => setShowSlots(p => !p)}
      />
    </div>
  );
}

export default App;
