import { memo, type KeyboardEvent } from 'react';
import type { LpDto } from '../../types/lp';
import { formatDate } from '../../utils/formatDate';

type LpCardProps = {
  lp: LpDto;
  onNavigate: (id: number) => void;
};

const LpCard = memo(function LpCard({ lp, onNavigate }: LpCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(lp.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${lp.title} LP 상세 보기`}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-neutral-800 outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
      onClick={() => onNavigate(lp.id)}
      onKeyDown={handleKeyDown}
    >
      {lp.thumbnail ? (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full bg-neutral-700" />
      )}

      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <p className="line-clamp-2 text-sm font-semibold text-white">{lp.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
          <span>{formatDate(lp.createdAt)}</span>
          <span className="flex items-center gap-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {lp.likes.length}
          </span>
        </div>
      </div>
    </div>
  );
});

export default LpCard;
