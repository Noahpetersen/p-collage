import { A4 } from '../../constants';
import type { Template } from '../../types';

interface TemplateGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

const THUMB_W = 64;
const THUMB_H = Math.round(THUMB_W * (A4.height / A4.width));
const SCALE = THUMB_W / A4.width;

function TemplateThumbnail({ template }: { template: Template }) {
  return (
    <svg
      width={THUMB_W}
      height={THUMB_H}
      viewBox={`0 0 ${THUMB_W} ${THUMB_H}`}
      className="rounded-lg overflow-hidden"
      style={{ background: 'white' }}
    >
      {template.slots.map(s => (
        <rect
          key={s.id}
          x={s.x * SCALE}
          y={s.y * SCALE}
          width={s.width * SCALE}
          height={s.height * SCALE}
          rx={(s.cornerRadius ?? 0) * SCALE}
          fill="#d1d5db"
        />
      ))}
    </svg>
  );
}

export default function TemplateGallery({ templates, onSelect }: TemplateGalleryProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-80">
      <div className="rounded-2xl bg-gray-900/90 backdrop-blur-md border border-white/10 shadow-2xl p-3">
        <p className="text-white/40 text-xs px-1 pb-2">Templates</p>
        <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <TemplateThumbnail template={t} />
              <span className="text-white/50 text-[10px] group-hover:text-white/80 transition-colors leading-none">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
