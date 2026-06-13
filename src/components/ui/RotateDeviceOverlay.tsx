export default function RotateDeviceOverlay() {
  return (
    <div className="rotate-overlay fixed inset-0 z-[100] items-center justify-center px-6">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]" />
      <div
        className="relative rounded-[22px] p-6 max-w-xs flex flex-col items-center gap-3 text-center border"
        style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-accent-deep">
          <rect x="6" y="2" width="12" height="18" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8a9 9 0 0 0-3-5.5M3 16a9 9 0 0 0 3 5.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8v-3h-3M3 16v3h3" />
        </svg>
        <p className="font-display font-semibold text-lg text-ink">Please rotate your device</p>
        <p className="text-ink-soft text-sm font-sans">This app works best in landscape mode</p>
      </div>
    </div>
  );
}
