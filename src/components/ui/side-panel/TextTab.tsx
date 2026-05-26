import type { CanvasText } from '../../../types';
import { TEXT_PRESETS, TEXT_COLORS, FONT_FAMILIES } from './constants';

interface TextTabProps {
  selectedText: CanvasText | null;
  onAddText: (partial: Omit<CanvasText, 'id' | 'x' | 'y'>) => void;
  onUpdateText: (id: string, changes: Partial<CanvasText>) => void;
  onRemoveText: (id: string) => void;
}

export default function TextTab({ selectedText, onAddText, onUpdateText, onRemoveText }: TextTabProps) {
  return (
    <div className="overflow-y-auto flex-1 min-h-0">
      <div className="p-4 flex flex-col gap-2">
      {TEXT_PRESETS.map((preset, i) => (
        <button
          key={i}
          onClick={() => onAddText(preset.partial)}
          className="w-full text-left px-4 py-3 rounded-xl border border-line hover:border-line-strong bg-paper hover:bg-[rgba(27,36,34,0.01)] transition-colors"
        >
          <div style={preset.previewStyle}>{preset.label}</div>
          <div className="text-[11px] text-ink-soft font-sans mt-0.5">{preset.meta}</div>
        </button>
      ))}

      {selectedText && (
        <div className="mt-2 rounded-xl border border-line-strong bg-bg-soft overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-line flex-shrink-0 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold font-sans text-ink-soft tracking-widest uppercase truncate">
              Selected · "{selectedText.text.length > 22 ? selectedText.text.slice(0, 22) + '…' : selectedText.text}"
            </span>
            <button
              onClick={() => onRemoveText(selectedText.id)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>

          <div className="p-3 flex flex-col gap-2.5">
            <textarea
              value={selectedText.text}
              onChange={e => onUpdateText(selectedText.id, { text: e.target.value })}
              onBlur={() => { if (!selectedText.text.trim()) onRemoveText(selectedText.id); }}
              rows={2}
              className="w-full text-[13px] font-sans text-ink bg-paper border border-line rounded-lg px-3 py-2 outline-none focus:border-accent resize-none"
            />

            <div className="flex gap-2">
              <select
                value={selectedText.fontFamily}
                onChange={e => onUpdateText(selectedText.id, { fontFamily: e.target.value })}
                className="flex-1 text-[13px] font-sans text-ink bg-paper border border-line rounded-lg px-2 py-1.5 outline-none focus:border-accent cursor-pointer"
              >
                {FONT_FAMILIES.map(f => <option key={f}>{f}</option>)}
              </select>
              <input
                type="number"
                value={selectedText.fontSize}
                onChange={e => onUpdateText(selectedText.id, { fontSize: Math.max(6, Number(e.target.value)) })}
                min={6} max={200}
                className="w-14 text-[13px] font-sans text-ink text-center bg-paper border border-line rounded-lg px-2 py-1.5 outline-none focus:border-accent"
              />
            </div>

            <div className="flex gap-1 flex-wrap">
              {([
                { key: 'bold', label: 'B', style: 'font-bold' },
                { key: 'italic', label: 'I', style: 'italic' },
                { key: 'underline', label: 'U', style: 'underline' },
              ] as const).map(btn => (
                <button
                  key={btn.key}
                  onClick={() => onUpdateText(selectedText.id, { [btn.key]: !selectedText[btn.key] })}
                  className={`w-8 h-8 rounded-lg text-[13px] font-sans transition-colors ${btn.style} ${
                    selectedText[btn.key] ? 'bg-accent text-white' : 'bg-paper border border-line text-ink-soft hover:text-ink'
                  }`}
                >{btn.label}</button>
              ))}
              <div className="w-px bg-line mx-0.5 self-stretch" />
              {(['left', 'center', 'right'] as const).map(a => (
                <button
                  key={a}
                  onClick={() => onUpdateText(selectedText.id, { align: a })}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    selectedText.align === a ? 'bg-accent text-white' : 'bg-paper border border-line text-ink-soft hover:text-ink'
                  }`}
                >
                  <svg viewBox="0 0 14 12" className="w-3.5 h-3" fill="none">
                    <line x1={0} y1="1" x2="14" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line
                      x1={a === 'center' ? 2 : a === 'right' ? 4 : 0}
                      y1="5.5"
                      x2={a === 'center' ? 12 : a === 'right' ? 14 : 9}
                      y2="5.5"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    />
                    <line
                      x1={a === 'center' ? 1 : a === 'right' ? 3 : 0}
                      y1="10"
                      x2={a === 'center' ? 13 : a === 'right' ? 14 : 11}
                      y2="10"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    />
                  </svg>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[12px] text-ink-soft font-sans">Color</span>
              <div className="flex gap-1.5">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => onUpdateText(selectedText.id, { color: c })}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      selectedText.color === c ? 'border-ink scale-90' : 'border-transparent hover:scale-95'
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
