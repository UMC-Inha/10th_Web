type LpSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function LpSearchBar({ value, onChange }: LpSearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="LP 검색..."
        aria-label="LP 검색"
        className="w-full rounded-lg border border-white/20 bg-neutral-800 py-1.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-pink-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          aria-label="검색어 지우기"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default LpSearchBar;
