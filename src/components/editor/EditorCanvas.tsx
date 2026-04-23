import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import { A4 } from '../../constants';
import type { LayoutSlot, UploadedImage, CanvasDecoration, FreeImage } from '../../types';
import ImageSlot from './ImageSlot';
import DecorationNode from './DecorationNode';
import FreeImageNode from './FreeImageNode';
import { useKonvaImage } from '../../hooks/useKonvaImage';

interface EditorCanvasProps {
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
}

export default function EditorCanvas({
  slots, images, bgColor, bgImageUrl, decorations, showSlots,
  freeMode, freeImages,
  onDropImage, onClearSlot, onUpdateSlotCrop,
  onMoveDecoration, onRemoveDecoration, onResizeDecoration,
  onDropFreeImage, onMoveFreeImage, onResizeFreeImage, onRemoveFreeImage, onUpdateFreeImageCrop,
}: EditorCanvasProps) {
  const bgImage = useKonvaImage(bgImageUrl ?? '');
  const divRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cropModeId, setCropModeId] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSelectedId(null);
        setCropModeId(null);
      }
      if (e.key === 'c' || e.key === 'C') {
        if (selectedId) {
          setCropModeId(prev => prev === selectedId ? null : selectedId);
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId]);

  // exit crop mode when selection changes
  useEffect(() => {
    setCropModeId(null);
  }, [selectedId]);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const imageId = e.dataTransfer.getData('imageId');
    if (!imageId || !divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (freeMode) {
      onDropFreeImage(imageId, px, py);
      return;
    }

    const hit = slots.find(
      s => px >= s.x && px <= s.x + s.width && py >= s.y && py <= s.y + s.height
    );
    if (hit) onDropImage(hit.id, imageId);
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-16">
      <div
        ref={divRef}
        className="shadow-2xl"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Stage
          width={A4.width}
          height={A4.height}
          onClick={() => { setSelectedId(null); setCropModeId(null); }}
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
              if (!showSlots) return null;
              return (
                <Rect
                  key={slot.id}
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  fill="#f3f4f6"
                  stroke="#d1d5db"
                  strokeWidth={1}
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
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
