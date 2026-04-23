interface TitleInputProps {
  value: string;
  onChange: (v: string) => void;
}

const sharedText = 'text-[15px] font-medium font-sans';

export default function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-40">
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-full border"
        style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow-soft)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-ink-soft flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>

        {/* Grid overlap: hidden span drives width, input sits on top */}
        <div className="inline-grid">
          <span className={`${sharedText} invisible whitespace-pre col-start-1 row-start-1 pointer-events-none`}>
            {value || 'Untitled'}
          </span>
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Untitled"
            className={`${sharedText} col-start-1 row-start-1 w-full bg-transparent text-ink placeholder:text-ink-soft outline-none`}
          />
        </div>

        <span className={`${sharedText} text-ink-soft select-none flex-shrink-0`}>.pdf</span>
      </div>
    </div>
  );
}
