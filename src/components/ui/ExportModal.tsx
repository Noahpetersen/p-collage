import { useState } from 'react';

export type ExportFormat = 'pdf' | 'jpeg';

interface ExportModalProps {
  onConfirm: (format: ExportFormat) => void;
  onCancel: () => void;
}

const FORMATS: { id: ExportFormat; label: string; description: string }[] = [
  { id: 'pdf', label: 'PDF', description: 'Print-ready DIN A4 document.' },
  { id: 'jpeg', label: 'JPEG', description: 'Image file, ideal for sharing on social media.' },
];

export default function ExportModal({ onConfirm, onCancel }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]" onClick={onCancel} />
      <div
        className="relative rounded-[22px] p-6 w-80 flex flex-col gap-4 border"
        style={{ background: 'var(--color-paper)', borderColor: 'var(--glass-border)', boxShadow: '0 40px 80px -20px rgba(27,36,34,0.4)' }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-display font-semibold text-[17px] tracking-[-0.025em] text-ink">Export photo book</h2>
          <p className="text-ink-soft text-[13px] font-sans">Choose a format to download your photo book.</p>
        </div>
        <div className="flex flex-col gap-2">
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className="text-left px-3 py-2.5 rounded-xl border transition-colors"
              style={{
                borderColor: format === f.id ? 'var(--color-accent)' : 'var(--glass-border)',
                background: format === f.id ? 'var(--glass)' : 'transparent',
              }}
            >
              <div className="text-[13px] font-medium font-sans text-ink">{f.label}</div>
              <div className="text-[12px] font-sans text-ink-soft">{f.description}</div>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-[13px] font-medium font-sans text-ink-soft hover:text-ink border border-line hover:border-line-strong transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(format)}
            className="flex-2 px-5 py-2 rounded-xl text-[13px] font-medium font-sans text-white bg-accent hover:brightness-105 active:brightness-95 transition-all"
          >
            Export {format === 'pdf' ? 'PDF' : 'JPEG'}
          </button>
        </div>
      </div>
    </div>
  );
}
