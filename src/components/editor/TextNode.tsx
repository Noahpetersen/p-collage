import { useRef, useEffect, useState } from 'react';
import { Text as KonvaText, Rect, Group } from 'react-konva';
import type Konva from 'konva';
import type { CanvasText } from '../../types';

interface TextNodeProps {
  canvasText: CanvasText;
  selected: boolean;
  onSelect: () => void;
  onMove: (id: string, x: number, y: number) => void;
}

export default function TextNode({ canvasText, selected, onSelect, onMove }: TextNodeProps) {
  const textRef = useRef<Konva.Text>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (textRef.current) {
      setSize({ width: textRef.current.width(), height: textRef.current.height() });
    }
  });

  const fontStyle = [
    canvasText.bold ? 'bold' : '',
    canvasText.italic ? 'italic' : '',
  ].filter(Boolean).join(' ') || 'normal';

  return (
    <Group
      x={canvasText.x}
      y={canvasText.y}
      draggable
      onClick={(e) => { e.cancelBubble = true; onSelect(); }}
      onDragEnd={e => { onMove(canvasText.id, e.target.x(), e.target.y()); }}
      onMouseEnter={() => { document.body.style.cursor = 'move'; }}
      onMouseLeave={() => { document.body.style.cursor = 'default'; }}
    >
      {selected && size.width > 0 && (
        <Rect
          x={-4} y={-4}
          width={size.width + 8} height={size.height + 8}
          stroke="oklch(0.66 0.09 160)"
          strokeWidth={1}
          dash={[4, 3]}
          fill="rgba(0,0,0,0)"
          cornerRadius={3}
          listening={false}
        />
      )}
      <KonvaText
        ref={textRef}
        x={0} y={0}
        text={canvasText.text}
        fontFamily={canvasText.fontFamily}
        fontSize={canvasText.fontSize}
        fontStyle={fontStyle}
        textDecoration={canvasText.underline ? 'underline' : ''}
        align={canvasText.align}
        fill={canvasText.color}
        width={canvasText.width}
      />
    </Group>
  );
}
