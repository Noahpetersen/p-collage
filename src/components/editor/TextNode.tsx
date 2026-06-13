import { useRef, useEffect } from 'react';
import { Text as KonvaText, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { CanvasText } from '../../types';

interface TextNodeProps {
  canvasText: CanvasText;
  selected: boolean;
  onSelect: () => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number) => void;
}

export default function TextNode({ canvasText, selected, onSelect, onMove, onResize }: TextNodeProps) {
  const textRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!trRef.current) return;
    if (selected && textRef.current) {
      trRef.current.nodes([textRef.current]);
    } else {
      trRef.current.nodes([]);
    }
    trRef.current.getLayer()?.batchDraw();
  }, [selected]);

  function handleTransformEnd() {
    const node = textRef.current!;
    const newWidth = Math.max(50, node.width() * node.scaleX());
    node.scaleX(1);
    node.scaleY(1);
    onResize(canvasText.id, newWidth);
  }

  const fontStyle = [
    canvasText.bold ? 'bold' : '',
    canvasText.italic ? 'italic' : '',
  ].filter(Boolean).join(' ') || 'normal';

  return (
    <>
      <KonvaText
        ref={textRef}
        x={canvasText.x}
        y={canvasText.y}
        text={canvasText.text}
        fontFamily={canvasText.fontFamily}
        fontSize={canvasText.fontSize}
        fontStyle={fontStyle}
        textDecoration={canvasText.underline ? 'underline' : ''}
        align={canvasText.align}
        fill={canvasText.color}
        width={canvasText.width}
        draggable
        onClick={(e) => { e.cancelBubble = true; onSelect(); }}
        onTap={(e) => { e.cancelBubble = true; onSelect(); }}
        onDragEnd={e => onMove(canvasText.id, e.target.x(), e.target.y())}
        onTransformEnd={handleTransformEnd}
        onMouseEnter={() => { document.body.style.cursor = 'move'; }}
        onMouseLeave={() => { document.body.style.cursor = 'default'; }}
      />
      <Transformer
        ref={trRef}
        rotateEnabled={false}
        enabledAnchors={['middle-left', 'middle-right']}
        borderStroke="oklch(0.66 0.09 160)"
        borderStrokeWidth={1}
        borderDash={[4, 3]}
        anchorStroke="oklch(0.66 0.09 160)"
        anchorFill="white"
        anchorSize={8}
        anchorCornerRadius={2}
        anchorStyleFunc={anchor => anchor.hitStrokeWidth(20)}
        boundBoxFunc={(oldBox, newBox) => newBox.width < 50 ? oldBox : newBox}
      />
    </>
  );
}
