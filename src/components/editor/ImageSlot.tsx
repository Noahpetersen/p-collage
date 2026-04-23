import { useRef } from 'react';
import { Image as KonvaImage } from 'react-konva';
import type { LayoutSlot } from '../../types';
import { useKonvaImage } from '../../hooks/useKonvaImage';
import { getCoverCrop } from '../../utils/cropMath';
import type Konva from 'konva';

interface ImageSlotProps {
  slot: LayoutSlot;
  url: string;
  onClear: () => void;
  onCropOffset: (slotId: string, cropX: number, cropY: number) => void;
}

export default function ImageSlot({ slot, url, onClear, onCropOffset }: ImageSlotProps) {
  const img = useKonvaImage(url);
  const movedRef = useRef(false);
  const prevPointerRef = useRef<{ x: number; y: number } | null>(null);

  function handleDragStart(e: Konva.KonvaEventObject<DragEvent>) {
    movedRef.current = false;
    const stage = e.target.getStage()!;
    prevPointerRef.current = stage.getPointerPosition();
    document.body.style.cursor = 'grabbing';
  }

  function handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    if (!img || !prevPointerRef.current) return;

    const stage = e.target.getStage()!;
    const pos = stage.getPointerPosition()!;
    const dx = pos.x - prevPointerRef.current.x;
    const dy = pos.y - prevPointerRef.current.y;
    prevPointerRef.current = pos;

    // Keep node pinned — only the crop moves
    e.target.x(slot.x);
    e.target.y(slot.y);

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    movedRef.current = true;

    const slotAspect = slot.width / slot.height;
    let cropW: number, cropH: number;
    if (img.naturalWidth / img.naturalHeight > slotAspect) {
      cropH = img.naturalHeight;
      cropW = img.naturalHeight * slotAspect;
    } else {
      cropW = img.naturalWidth;
      cropH = img.naturalWidth / slotAspect;
    }

    const maxX = img.naturalWidth - cropW;
    const maxY = img.naturalHeight - cropH;

    const currentCropX = slot.cropX * maxX;
    const currentCropY = slot.cropY * maxY;

    // drag right → crop shifts left (negative dx reduces cropX)
    const newCropX = currentCropX - dx * (cropW / slot.width);
    const newCropY = currentCropY - dy * (cropH / slot.height);

    const newOffsetX = maxX > 0 ? Math.max(0, Math.min(1, newCropX / maxX)) : 0.5;
    const newOffsetY = maxY > 0 ? Math.max(0, Math.min(1, newCropY / maxY)) : 0.5;

    onCropOffset(slot.id, newOffsetX, newOffsetY);
  }

  function handleDragEnd() {
    document.body.style.cursor = 'grab';
  }

  function handleClick() {
    if (!movedRef.current) onClear();
    movedRef.current = false;
  }

  return (
    <KonvaImage
      image={img}
      x={slot.x}
      y={slot.y}
      width={slot.width}
      height={slot.height}
      crop={img ? getCoverCrop(img.naturalWidth, img.naturalHeight, slot.width, slot.height, slot.cropX, slot.cropY) : undefined}
      cornerRadius={slot.cornerRadius ?? 0}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onMouseEnter={() => { document.body.style.cursor = 'grab'; }}
      onMouseLeave={() => { document.body.style.cursor = 'default'; }}
    />
  );
}
