import type { Template } from '../../../types';
import { THUMB_W, THUMB_H, SCALE } from './constants';

export default function TemplateThumbnail({ template }: { template: Template }) {
  return (
    <svg width={THUMB_W} height={THUMB_H} viewBox={`0 0 ${THUMB_W} ${THUMB_H}`}
      className="rounded-md overflow-hidden flex-shrink-0" style={{ background: 'white' }}>
      {template.slots.map(s => (
        <rect key={s.id}
          x={s.x * SCALE} y={s.y * SCALE}
          width={s.width * SCALE} height={s.height * SCALE}
          rx={(s.cornerRadius ?? 0) * SCALE}
          fill="oklch(0.93 0.016 160)"
        />
      ))}
    </svg>
  );
}
