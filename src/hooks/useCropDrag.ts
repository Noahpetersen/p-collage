import { useRef } from 'react';
import type Konva from 'konva';

interface UseCropDragOptions {
  img: HTMLImageElement | undefined;
  slotW: number;
  slotH: number;
  cropX: number;
  cropY: number;
  pinX: number;
  pinY: number;
  onCropOffset: (cropX: number, cropY: number) => void;
}

export function useCropDrag({ img, slotW, slotH, cropX, cropY, pinX, pinY, onCropOffset }: UseCropDragOptions) {
  const prevPointerRef = useRef<{ x: number; y: number } | null>(null);

  function startCropDrag(e: Konva.KonvaEventObject<DragEvent>) {
    const stage = e.target.getStage()!;
    prevPointerRef.current = stage.getPointerPosition();
  }

  // Returns true if visible movement occurred (useful for click-vs-drag detection).
  function moveCropDrag(e: Konva.KonvaEventObject<DragEvent>): boolean {
    if (!img || !prevPointerRef.current) return false;

    const stage = e.target.getStage()!;
    const pos = stage.getPointerPosition()!;
    const dx = pos.x - prevPointerRef.current.x;
    const dy = pos.y - prevPointerRef.current.y;
    prevPointerRef.current = pos;

    e.target.x(pinX);
    e.target.y(pinY);

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return false;

    const slotAspect = slotW / slotH;
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
    const newCropX = cropX * maxX - dx * (cropW / slotW);
    const newCropY = cropY * maxY - dy * (cropH / slotH);

    onCropOffset(
      maxX > 0 ? Math.max(0, Math.min(1, newCropX / maxX)) : 0.5,
      maxY > 0 ? Math.max(0, Math.min(1, newCropY / maxY)) : 0.5,
    );

    return true;
  }

  return { startCropDrag, moveCropDrag };
}
