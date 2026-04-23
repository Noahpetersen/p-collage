import { useRef, useEffect } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import type { CanvasDecoration } from '../../types';
import { useKonvaImage } from '../../hooks/useKonvaImage';
import type Konva from 'konva';

interface DecorationNodeProps {
  decoration: CanvasDecoration;
  selected: boolean;
  onSelect: () => void;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
  onResize: (id: string, size: number, rotation: number) => void;
}

export default function DecorationNode({ decoration, selected, onSelect, onMove, onRemove, onResize }: DecorationNodeProps) {
  const img = useKonvaImage(decoration.url);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!trRef.current) return;
    if (selected && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
    } else {
      trRef.current.nodes([]);
    }
    trRef.current.getLayer()?.batchDraw();
  }, [selected]);

  function handleTransformEnd() {
    const node = imageRef.current!;
    const newSize = Math.max(24, node.width() * node.scaleX());
    node.scaleX(1);
    node.scaleY(1);
    onMove(decoration.id, node.x(), node.y());
    onResize(decoration.id, newSize, node.rotation());
  }

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={img}
        x={decoration.x}
        y={decoration.y}
        width={decoration.size}
        height={decoration.size}
        rotation={decoration.rotation}
        draggable
        onClick={e => { e.cancelBubble = true; onSelect(); }}
        onDblClick={() => onRemove(decoration.id)}
        onDragEnd={e => onMove(decoration.id, e.target.x(), e.target.y())}
        onTransformEnd={handleTransformEnd}
      />
      <Transformer
        ref={trRef}
        keepRatio={true}
        borderStroke="white"
        borderStrokeWidth={1.5}
        anchorStroke="#6b7280"
        anchorFill="white"
        anchorSize={8}
        anchorCornerRadius={2}
        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        boundBoxFunc={(oldBox, newBox) => newBox.width < 24 ? oldBox : newBox}
      />
    </>
  );
}
