interface GridControlsProps {
  cols: number;
  rows: number;
  onChange: (cols: number, rows: number) => void;
}

export default function GridControls({ cols, rows, onChange }: GridControlsProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-72">
      <div
        className="rounded-2xl p-4 flex flex-col gap-4 border"
        style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow-soft)' }}
      >
        <Slider label="Columns" value={cols} min={1} max={6} onChange={v => onChange(v, rows)} />
        <Slider label="Rows" value={rows} min={1} max={10} onChange={v => onChange(cols, v)} />
      </div>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-ink-soft text-xs font-sans">{label}</span>
        <span className="text-ink text-xs font-medium font-sans w-4 text-right">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-accent cursor-pointer"
      />
    </div>
  );
}
