import type { Template } from '../../../types';
import TemplateThumbnail from './TemplateThumbnail';
import { THUMB_W, THUMB_H } from './constants';

interface LayoutsTabProps {
  templates: Template[];
  freeMode: boolean;
  activeTemplateId: string;
  onSelectTemplate: (t: Template) => void;
  onFreeMode: () => void;
}

export default function LayoutsTab({ templates, freeMode, activeTemplateId, onSelectTemplate, onFreeMode }: LayoutsTabProps) {
  return (
    <div className="overflow-y-auto p-4 flex-1">
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onFreeMode}
          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-colors group ${
            freeMode
              ? 'bg-accent-soft border-accent'
              : 'border-transparent hover:bg-[rgba(27,36,34,0.04)]'
          }`}
        >
          <svg width={THUMB_W} height={THUMB_H} viewBox={`0 0 ${THUMB_W} ${THUMB_H}`}
            className="rounded-md overflow-hidden flex-shrink-0" style={{ background: 'white' }}>
            <rect x="4"  y="6"  width="22" height="16" rx="1" fill="oklch(0.93 0.016 160)" />
            <rect x="30" y="4"  width="24" height="14" rx="1" fill="oklch(0.93 0.016 160)" />
            <rect x="8"  y="27" width="18" height="20" rx="1" fill="oklch(0.93 0.016 160)" />
            <rect x="29" y="22" width="26" height="18" rx="1" fill="oklch(0.93 0.016 160)" />
            <rect x="6"  y="52" width="30" height="14" rx="1" fill="oklch(0.93 0.016 160)" />
            <rect x="38" y="44" width="16" height="24" rx="1" fill="oklch(0.93 0.016 160)" />
          </svg>
          <span className={`text-[12px] leading-none transition-colors font-sans ${
            freeMode ? 'text-accent-deep font-semibold' : 'text-ink-soft group-hover:text-ink'
          }`}>Free</span>
        </button>
        {templates.map(t => {
          const active = !freeMode && t.id === activeTemplateId;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-colors group ${
                active
                  ? 'bg-accent-soft border-accent'
                  : 'border-transparent hover:bg-[rgba(27,36,34,0.04)]'
              }`}
            >
              <TemplateThumbnail template={t} />
              <span className={`text-[12px] leading-none transition-colors font-sans ${
                active ? 'text-accent-deep font-semibold' : 'text-ink-soft group-hover:text-ink'
              }`}>
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
