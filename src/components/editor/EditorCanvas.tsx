import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import type Konva from 'konva';
import { A4 } from '../../constants';
import type { LayoutSlot, UploadedImage, CanvasDecoration, FreeImage, CanvasText } from '../../types';
import ImageSlot from './ImageSlot';
import DecorationNode from './DecorationNode';
import FreeImageNode from './FreeImageNode';
import TextNode from './TextNode';
import { useKonvaImage } from '../../hooks/useKonvaImage';

export interface EditorCanvasHandle {
  /** Converts viewport (clientX/clientY) coordinates to A4 canvas coordinates. */
  screenToCanvas: (clientX: number, clientY: number) => { x: number; y: number } | null;
}

interface EditorCanvasProps {
  stageRef?: React.RefObject<Konva.Stage | null>;
  slots: LayoutSlot[];
  images: UploadedImage[];
  bgColor: string;
  bgImageUrl: string | null;
  decorations: CanvasDecoration[];
  showSlots: boolean;
  freeMode: boolean;
  freeImages: FreeImage[];
  onDropImage: (slotId: string, imageId: string) => void;
  onClearSlot: (slotId: string) => void;
  onUpdateSlotCrop: (slotId: string, cropX: number, cropY: number) => void;
  onMoveDecoration: (id: string, x: number, y: number) => void;
  onRemoveDecoration: (id: string) => void;
  onResizeDecoration: (id: string, size: number, rotation: number) => void;
  onDropFreeImage: (imageId: string, x: number, y: number) => void;
  onMoveFreeImage: (id: string, x: number, y: number) => void;
  onResizeFreeImage: (id: string, width: number, height: number, rotation: number) => void;
  onRemoveFreeImage: (id: string) => void;
  onUpdateFreeImageCrop: (id: string, cropX: number, cropY: number) => void;
  selectedImageId: string | null;
  onPlaceImage: () => void;
  texts: CanvasText[];
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onMoveText: (id: string, x: number, y: number) => void;
  onResizeText: (id: string, width: number) => void;
  onRemoveText: (id: string) => void;
  /** Viewport position of a photo currently being dragged in from the side panel, if any. */
  dragPosition?: { x: number; y: number } | null;
}

// On iPad portrait / narrow screens the side panel overlays the canvas area
// (left-4 offset + icon rail + content, see .side-panel-content in index.css).
// Reserve that width so the canvas shrinks and shifts right instead of being
// covered, keeping every slot reachable.
const NARROW_BREAKPOINT = 1024;
const SIDEBAR_RESERVE = 324;

function computeCanvasLayout() {
  // py-16 = 64px top + 64px bottom padding in the flex container
  const availH = window.innerHeight - 128;
  const reserve = window.innerWidth <= NARROW_BREAKPOINT ? SIDEBAR_RESERVE : 0;
  const availW = window.innerWidth - reserve - 32;
  const scale = Math.min(1, Math.max(0.45, Math.min(availH / A4.height, availW / A4.width)));
  return { scale, paddingLeft: reserve };
}

const EditorCanvas = forwardRef<EditorCanvasHandle, EditorCanvasProps>(function EditorCanvas({
  stageRef,
  slots, images, bgColor, bgImageUrl, decorations, showSlots,
  freeMode, freeImages,
  onDropImage, onClearSlot, onUpdateSlotCrop,
  onMoveDecoration, onRemoveDecoration, onResizeDecoration,
  onDropFreeImage, onMoveFreeImage, onResizeFreeImage, onRemoveFreeImage, onUpdateFreeImageCrop,
  selectedImageId, onPlaceImage,
  texts, selectedTextId, onSelectText, onMoveText, onResizeText, onRemoveText,
  dragPosition,
}, ref) {
  const bgImage = useKonvaImage(bgImageUrl ?? '');
  const divRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cropModeId, setCropModeId] = useState<string | null>(null);
  const [{ scale, paddingLeft }, setLayout] = useState(computeCanvasLayout);

  useEffect(() => {
    function update() { setLayout(computeCanvasLayout()); }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Keep a ref with the latest props/state so the keydown listener never captures stale values
  const keyCtx = useRef({ decorations, freeImages, onRemoveDecoration, onRemoveFreeImage, onRemoveText, onSelectText, selectedId, selectedTextId });
  keyCtx.current = { decorations, freeImages, onRemoveDecoration, onRemoveFreeImage, onRemoveText, onSelectText, selectedId, selectedTextId };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const { decorations, freeImages, onRemoveDecoration, onRemoveFreeImage, onRemoveText, onSelectText, selectedId, selectedTextId } = keyCtx.current;
      if (e.key === 'Escape') {
        setSelectedId(null);
        setCropModeId(null);
        onSelectText(null);
      }
      const active = document.activeElement;
      const isTyping = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
        if (selectedTextId) {
          onRemoveText(selectedTextId);
          onSelectText(null);
        } else if (selectedId) {
          if (decorations.some(d => d.id === selectedId)) {
            onRemoveDecoration(selectedId);
          } else if (freeImages.some(fi => fi.id === selectedId)) {
            onRemoveFreeImage(selectedId);
          }
          setSelectedId(null);
        }
      }
      if ((e.key === 'c' || e.key === 'C') && selectedId) {
        setCropModeId(prev => prev === selectedId ? null : selectedId);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []); // stable — reads live values via ref, never needs re-registration

  // exit crop mode when selection changes
  useEffect(() => {
    setCropModeId(null);
  }, [selectedId]);

  useImperativeHandle(ref, () => ({
    screenToCanvas(clientX: number, clientY: number) {
      if (!divRef.current) return null;
      const rect = divRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale,
      };
    },
  }), [scale]);

  // Slot under the pointer while a photo is being dragged in from the side panel,
  // so the drop target can be highlighted.
  const hoveredSlotId = (() => {
    if (!dragPosition || freeMode || !divRef.current) return undefined;
    const rect = divRef.current.getBoundingClientRect();
    const px = (dragPosition.x - rect.left) / scale;
    const py = (dragPosition.y - rect.top) / scale;
    return slots.find(s => px >= s.x && px <= s.x + s.width && py >= s.y && py <= s.y + s.height)?.id;
  })();

  // Mirrors handleDrop's coordinate math — getBoundingClientRect returns
  // visual (CSS-scaled) coords, so divide by `scale` to get Konva space.
  // Konva's stage.getPointerPosition() doesn't translate reliably through
  // the CSS transform for touch/tap events, so read clientX/Y directly.
  function getCanvasPoint(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>): { x: number; y: number } | null {
    if (!divRef.current) return null;
    const rect = divRef.current.getBoundingClientRect();
    const evt = e.evt;
    const point = 'changedTouches' in evt ? evt.changedTouches[0] : evt;
    if (!point) return null;
    return {
      x: (point.clientX - rect.left) / scale,
      y: (point.clientY - rect.top) / scale,
    };
  }

  function handleStageClick(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (selectedImageId) {
      const point = getCanvasPoint(e);
      if (point) {
        const { x: px, y: py } = point;

        if (freeMode) {
          onDropFreeImage(selectedImageId, px, py);
        } else {
          const hit = slots.find(
            s => px >= s.x && px <= s.x + s.width && py >= s.y && py <= s.y + s.height
          );
          const target = hit ?? slots.find(s => !s.imageId);
          if (target) onDropImage(target.id, selectedImageId);
        }
        onPlaceImage();
        return;
      }
    }
    setSelectedId(null);
    setCropModeId(null);
    onSelectText(null);
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-16" style={{ paddingLeft }}>
      {/* Outer div sized to the visual (scaled) canvas so flex centering accounts for it */}
      <div style={{ width: A4.width * scale, height: A4.height * scale }}>
        <div
          ref={divRef}
          className="shadow-2xl"
          style={{ width: A4.width, height: A4.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
        <Stage
          ref={stageRef}
          width={A4.width}
          height={A4.height}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            <Rect x={0} y={0} width={A4.width} height={A4.height} fill={bgColor} />
            {bgImage && (
              <KonvaImage image={bgImage} x={0} y={0} width={A4.width} height={A4.height} />
            )}
            {!freeMode && slots.map(slot => {
              const matched = slot.imageId
                ? images.find(img => img.id === slot.imageId)
                : undefined;

              if (matched)
                return (
                  <ImageSlot
                    key={slot.id}
                    slot={slot}
                    url={matched.url}
                    onClear={() => onClearSlot(slot.id)}
                    onCropOffset={onUpdateSlotCrop}
                  />
                );
              const isHovered = slot.id === hoveredSlotId;
              if (!showSlots && !isHovered) return null;
              return (
                <Rect
                  key={slot.id}
                  name="slot-placeholder"
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  fill={isHovered ? 'oklch(0.93 0.06 160)' : 'oklch(0.93 0.016 160)'}
                  stroke={isHovered ? 'oklch(0.65 0.12 160)' : 'oklch(0.72 0.06 160)'}
                  strokeWidth={isHovered ? 2 : 1}
                  dash={[6, 4]}
                  cornerRadius={slot.cornerRadius ?? 0}
                />
              );
            })}
            {freeMode && freeImages.map(fi => {
              const matched = images.find(img => img.id === fi.imageId);
              if (!matched) return null;
              return (
                <FreeImageNode
                  key={fi.id}
                  freeImage={fi}
                  image={matched}
                  selected={selectedId === fi.id}
                  cropMode={cropModeId === fi.id}
                  onSelect={() => setSelectedId(fi.id)}
                  onMove={onMoveFreeImage}
                  onResize={onResizeFreeImage}
                  onRemove={onRemoveFreeImage}
                  onCropOffset={onUpdateFreeImageCrop}
                />
              );
            })}
            {decorations.map(d => (
              <DecorationNode
                key={d.id}
                decoration={d}
                selected={selectedId === d.id}
                onSelect={() => setSelectedId(d.id)}
                onMove={onMoveDecoration}
                onRemove={onRemoveDecoration}
                onResize={onResizeDecoration}
              />
            ))}
            {texts.map(t => (
              <TextNode
                key={t.id}
                canvasText={t}
                selected={selectedTextId === t.id}
                onSelect={() => onSelectText(t.id)}
                onMove={onMoveText}
                onResize={onResizeText}
              />
            ))}
          </Layer>
        </Stage>
        </div>
      </div>
    </div>
  );
});

export default EditorCanvas;
