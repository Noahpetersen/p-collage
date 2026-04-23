import { useRef, useEffect } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import type { FreeImage, UploadedImage } from '../../types';
import { useKonvaImage } from '../../hooks/useKonvaImage';
import { getCoverCrop } from '../../utils/cropMath';
import type Konva from 'konva';

interface FreeImageNodeProps {
  freeImage: FreeImage;
  image: UploadedImage;
  selected: boolean;
  cropMode: boolean;
  onSelect: () => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number, rotation: number) => void;
  onRemove: (id: string) => void;
  onCropOffset: (id: string, cropX: number, cropY: number) => void;
}

export default function FreeImageNode({
  freeImage, image, selected, cropMode,
  onSelect, onMove, onResize, onRemove, onCropOffset,
}: FreeImageNodeProps) {
  const img = useKonvaImage(image.url);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const prevPointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!trRef.current) return;
    if (selected && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
    } else {
      trRef.current.nodes([]);
    }
    trRef.current.getLayer()?.batchDraw();
  }, [selected]);

  const { width, height } = freeImage;

  function handleTransformEnd() {
    const node = imageRef.current!;
    const newW = Math.max(40, node.width() * node.scaleX());
    const newH = Math.max(30, node.height() * node.scaleY());
    node.scaleX(1);
    node.scaleY(1);
    onMove(freeImage.id, node.x(), node.y());
    onResize(freeImage.id, newW, newH, node.rotation());
  }

  function handleDragStart(e: Konva.KonvaEventObject<DragEvent>) {
    if (!cropMode) return;
    const stage = e.target.getStage()!;
    prevPointerRef.current = stage.getPointerPosition();
  }

  function handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    if (!cropMode || !img || !prevPointerRef.current) return;

    const stage = e.target.getStage()!;
    const pos = stage.getPointerPosition()!;
    const dx = pos.x - prevPointerRef.current.x;
    const dy = pos.y - prevPointerRef.current.y;
    prevPointerRef.current = pos;

    // Pin the node — only crop moves
    e.target.x(freeImage.x);
    e.target.y(freeImage.y);

    const slotAspect = width / height;
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

    const newCropX = freeImage.cropX * maxX - dx * (cropW / width);
    const newCropY = freeImage.cropY * maxY - dy * (cropH / height);

    onCropOffset(
      freeImage.id,
      maxX > 0 ? Math.max(0, Math.min(1, newCropX / maxX)) : 0.5,
      maxY > 0 ? Math.max(0, Math.min(1, newCropY / maxY)) : 0.5,
    );
  }

  function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
    if (cropMode) return;
    onMove(freeImage.id, e.target.x(), e.target.y());
  }

  const borderColor = cropMode ? '#f97316' : 'white';

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={img}
        x={freeImage.x}
        y={freeImage.y}
        width={width}
        height={height}
        rotation={freeImage.rotation}
        crop={img ? getCoverCrop(img.naturalWidth, img.naturalHeight, width, height, freeImage.cropX, freeImage.cropY) : undefined}
        draggable
        onClick={e => { e.cancelBubble = true; onSelect(); }}
        onDblClick={() => onRemove(freeImage.id)}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      <Transformer
        ref={trRef}
        borderStroke={borderColor}
        borderStrokeWidth={1.5}
        anchorStroke="#6b7280"
        anchorFill="white"
        anchorSize={8}
        anchorCornerRadius={2}
        boundBoxFunc={(oldBox, newBox) =>
          newBox.width < 40 || newBox.height < 30 ? oldBox : newBox
        }
      />
    </>
  );
}
