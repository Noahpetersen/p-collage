import { useRef, useState, useCallback, useMemo } from 'react';
import type Konva from 'konva';
import EditorCanvas, { type EditorCanvasHandle } from './components/editor/EditorCanvas';
import Navbar from './components/ui/Navbar';
import SidePanel from './components/ui/SidePanel';
import ExportModal from './components/ui/ExportModal';
import TitleInput from './components/ui/TitleInput';
import RotateDeviceOverlay from './components/ui/RotateDeviceOverlay';
import CloverLogo from './assets/PollenLogo.png';
import { useImages } from './hooks/useImages';
import { useLayout } from './hooks/useLayout';
import { useExport } from './hooks/useExport';
import { useDecorations } from './hooks/useDecorations';
import { useFreeLayout } from './hooks/useFreeLayout';
import { useTexts } from './hooks/useTexts';
import { templates } from './templates';
import type { Template, UploadedImage } from './types';

// Static — never changes, no need to recreate on every render
const BG_GRADIENTS = (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute top-0 right-0 w-[42vw] h-[42vh]" style={{ background: 'radial-gradient(ellipse at top right, rgba(255, 182, 193, 0.38) 0%, transparent 70%)' }} />
    <div className="absolute bottom-0 left-0 w-[38vw] h-[38vh]" style={{ background: 'radial-gradient(ellipse at bottom left, rgba(134, 210, 172, 0.32) 0%, transparent 70%)' }} />
  </div>
);

function App() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showSlots, setShowSlots] = useState(true);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
  const [freeMode, setFreeMode] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0].id);
  const [fileName, setFileName] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [dragImage, setDragImage] = useState<{ image: UploadedImage; x: number; y: number } | null>(null);
  const bgImageUrlRef = useRef<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const editorCanvasRef = useRef<EditorCanvasHandle>(null);

  function handleBgImageChange(url: string | null) {
    if (bgImageUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(bgImageUrlRef.current);
    }
    bgImageUrlRef.current = url;
    setBgImageUrl(url);
  }

  function handleBgColorChange(color: string) {
    setBgColor(color);
    handleBgImageChange(null);
  }

  const { images, handleFiles, removeImage } = useImages();

  const handleSelectImage = useCallback((id: string) => {
    setSelectedImageId(prev => prev === id ? null : id);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    removeImage(id);
    setSelectedImageId(prev => prev === id ? null : prev);
  }, [removeImage]);
  const { slots, assignImage, clearSlot, loadTemplate, updateCrop: updateSlotCrop } = useLayout(templates[0]);
  const { freeImages, addFreeImage, moveFreeImage, resizeFreeImage, updateCrop: updateFreeImageCrop, removeFreeImage, clearFreeImages } = useFreeLayout();

  const handleDragImageStart = useCallback((image: UploadedImage, x: number, y: number) => {
    setSelectedImageId(null);
    setDragImage({ image, x, y });
  }, []);

  const handleDragImageMove = useCallback((x: number, y: number) => {
    setDragImage(prev => prev ? { ...prev, x, y } : prev);
  }, []);

  const handleDragImageCancel = useCallback(() => {
    setDragImage(null);
  }, []);

  const handleDragImageEnd = useCallback((image: UploadedImage, x: number, y: number) => {
    setDragImage(null);
    const point = editorCanvasRef.current?.screenToCanvas(x, y);
    if (!point) return;

    if (freeMode) {
      addFreeImage(image.id, point.x, point.y);
      return;
    }

    const hit = slots.find(
      s => point.x >= s.x && point.x <= s.x + s.width && point.y >= s.y && point.y <= s.y + s.height
    );
    const target = hit ?? slots.find(s => !s.imageId);
    if (target) assignImage(target.id, image.id);
  }, [freeMode, slots, addFreeImage, assignImage]);
  const { exportPdf, exportJpeg, exporting } = useExport();
  const { decorations, addDecoration, moveDecoration, removeDecoration, resizeDecoration } = useDecorations();
  const { texts, addText, moveText, updateText, removeText } = useTexts();
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // Memoized: avoids O(n) find on every render
  const selectedText = useMemo(
    () => texts.find(t => t.id === selectedTextId) ?? null,
    [texts, selectedTextId],
  );

  const handleSelectTemplate = useCallback((t: Template) => {
    setFreeMode(false);
    setActiveTemplateId(t.id);
    loadTemplate(t);
  }, [loadTemplate]);

  const handleFreeMode = useCallback(() => {
    setFreeMode(true);
    clearFreeImages();
  }, [clearFreeImages]);

  const handleRemoveText = useCallback((id: string) => {
    removeText(id);
    setSelectedTextId(null);
  }, [removeText]);

  const handleResizeText = useCallback((id: string, width: number) => {
    updateText(id, { width });
  }, [updateText]);

  const handleConfirmExport = useCallback((format: 'pdf' | 'jpeg') => {
    setShowExportModal(false);
    if (format === 'jpeg') {
      if (stageRef.current) exportJpeg(stageRef.current, fileName);
    } else {
      exportPdf(freeMode ? [] : slots, images, bgColor, bgImageUrl, decorations, freeMode ? freeImages : [], texts, fileName);
    }
  }, [exportJpeg, exportPdf, slots, images, bgColor, bgImageUrl, decorations, freeMode, freeImages, texts, fileName]);

  return (
    <div className="min-h-screen bg-bg relative">
      <RotateDeviceOverlay />
      {BG_GRADIENTS}
      <SidePanel
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
        bgColor={bgColor}
        onBgColorChange={handleBgColorChange}
        bgImageUrl={bgImageUrl}
        onBgImageChange={handleBgImageChange}
        onAddDecoration={addDecoration}
        freeMode={freeMode}
        activeTemplateId={activeTemplateId}
        onFreeMode={handleFreeMode}
        images={images}
        onFiles={handleFiles}
        onRemoveImage={handleRemoveImage}
        selectedImageId={selectedImageId}
        onSelectImage={handleSelectImage}
        onDragImageStart={handleDragImageStart}
        onDragImageMove={handleDragImageMove}
        onDragImageEnd={handleDragImageEnd}
        onDragImageCancel={handleDragImageCancel}
        selectedText={selectedText}
        onAddText={(partial) => setSelectedTextId(addText(partial))}
        onUpdateText={updateText}
        onRemoveText={handleRemoveText}
      />
      <TitleInput value={fileName} onChange={setFileName} />
      <div className="fixed top-5 left-5 z-40">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2.5 pl-4 pr-6 py-3 rounded-2xl border cursor-pointer"
          style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow-soft)' }}
        >
          <img src={CloverLogo} alt="Clover" className="h-7 w-auto" />
          <span className="text-[20px] font-semibold font-display tracking-[-0.02em] text-ink">Clover</span>
        </button>
      </div>
      <EditorCanvas
        ref={editorCanvasRef}
        stageRef={stageRef}
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
        selectedImageId={selectedImageId}
        onPlaceImage={() => setSelectedImageId(null)}
        texts={texts}
        selectedTextId={selectedTextId}
        onSelectText={setSelectedTextId}
        onMoveText={moveText}
        onResizeText={handleResizeText}
        onRemoveText={removeText}
        dragPosition={dragImage ? { x: dragImage.x, y: dragImage.y } : null}
      />
      {showExportModal && (
        <ExportModal
          onConfirm={handleConfirmExport}
          onCancel={() => setShowExportModal(false)}
        />
      )}
      <Navbar
        exporting={exporting}
        showSlots={showSlots}
        onExport={() => setShowExportModal(true)}
        onToggleSlots={() => setShowSlots(p => !p)}
      />
      {dragImage && (
        <div
          className="fixed z-50 pointer-events-none rounded-xl overflow-hidden shadow-2xl ring-1 ring-white"
          style={{ left: dragImage.x - 40, top: dragImage.y + 16, width: 80, height: 80 }}
        >
          <img src={dragImage.image.url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

export default App;
