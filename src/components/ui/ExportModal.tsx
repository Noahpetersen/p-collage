interface ExportModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExportModal({ onConfirm, onCancel }: ExportModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]" onClick={onCancel} />
      <div
        className="relative rounded-[22px] p-6 w-80 flex flex-col gap-4 border"
        style={{ background: 'var(--color-paper)', borderColor: 'var(--glass-border)', boxShadow: '0 40px 80px -20px rgba(27,36,34,0.4)' }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-display font-semibold text-[17px] tracking-[-0.025em] text-ink">Export as PDF</h2>
          <p className="text-ink-soft text-[13px] font-sans">Your photo book will be downloaded as a print-ready DIN A4 PDF.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-[13px] font-medium font-sans text-ink-soft hover:text-ink border border-line hover:border-line-strong transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-2 px-5 py-2 rounded-xl text-[13px] font-medium font-sans text-white bg-accent hover:brightness-105 active:brightness-95 transition-all"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
