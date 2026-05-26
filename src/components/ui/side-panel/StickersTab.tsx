import { stickers } from '../../../decorations';

interface StickersTabProps {
  onAddDecoration: (url: string) => void;
}

export default function StickersTab({ onAddDecoration }: StickersTabProps) {
  return (
    <div className="overflow-y-auto flex-1 min-h-0">
      <div className="p-4">
      <p className="text-ink-soft text-xs px-1 pb-2 font-sans">Click to place · Drag to move · Click to remove</p>
      <div className="grid grid-cols-4 gap-2">
        {stickers.map(sticker => (
          <button
            key={sticker.id}
            onClick={() => onAddDecoration(sticker.url)}
            title={sticker.name}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-[rgba(27,36,34,0.04)] transition-colors group"
          >
            <img src={sticker.url} alt={sticker.name} className="w-10 h-10" />
            <span className="text-ink-soft text-[10px] group-hover:text-ink transition-colors font-sans">{sticker.name}</span>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
