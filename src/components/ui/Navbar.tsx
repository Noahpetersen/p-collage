interface NavbarProps {
  exporting: boolean;
  showSlots: boolean;
  onExport: () => void;
  onToggleSlots: () => void;
}

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export default function Navbar({ exporting, showSlots, onExport, onToggleSlots }: NavbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="flex items-center gap-3 px-5 py-3 rounded-full border"
        style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow)' }}
      >
        <button
          onClick={onToggleSlots}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer ${
            showSlots ? 'bg-accent-soft text-accent-deep' : 'text-ink-soft hover:bg-[rgba(27,36,34,0.05)] hover:text-ink'
          }`}
        >
          <EyeIcon open={showSlots} />
        </button>

        <div className="w-px h-4 bg-line" />

        <button
          onClick={onExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[15px] font-medium font-sans text-white bg-accent hover:brightness-105 active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {exporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </nav>
    </div>
  );
}
