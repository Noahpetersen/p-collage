interface ExportModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExportModal({ onConfirm, onCancel }: ExportModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6 w-72 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-white font-medium">Export as PDF?</h2>
          <p className="text-white/50 text-sm">Your photo book will be downloaded as a print-ready DIN A4 PDF.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-sm text-white bg-white/15 hover:bg-white/25 transition-colors"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
