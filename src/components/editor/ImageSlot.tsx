import { useRef } from 'react';
import { Image as KonvaImage } from 'react-konva';
import type { LayoutSlot } from '../../types';
import { useKonvaImage } from '../../hooks/useKonvaImage';
import { useCropDrag } from '../../hooks/useCropDrag';
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

  const { startCropDrag, moveCropDrag } = useCropDrag({
    img,
    slotW: slot.width,
    slotH: slot.height,
    cropX: slot.cropX,
    cropY: slot.cropY,
    pinX: slot.x,
    pinY: slot.y,
    onCropOffset: (cx, cy) => onCropOffset(slot.id, cx, cy),
  });

  function handleDragStart(e: Konva.KonvaEventObject<DragEvent>) {
    movedRef.current = false;
    startCropDrag(e);
    document.body.style.cursor = 'grabbing';
  }

  function handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    if (moveCropDrag(e)) movedRef.current = true;
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
