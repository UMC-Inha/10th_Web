import type { LpDetailDto } from '../../types/lp';
import { formatDate } from '../../utils/formatDate';

type LpDetailHeaderProps = {
  lp: LpDetailDto;
};

function LpDetailHeader({ lp }: LpDetailHeaderProps) {
  return (
    <>
      {lp.thumbnail && (
        <div className="mb-6 overflow-hidden rounded-xl">
          <img src={lp.thumbnail} alt={lp.title} className="w-full object-cover max-h-80" />
        </div>
      )}

      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-white">{lp.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span>{formatDate(lp.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {lp.likes.length}
          </span>
          {lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lp.tags.map((tag) => (
                <span key={tag.id} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 rounded-xl bg-white/5 p-5 text-slate-300 leading-relaxed whitespace-pre-wrap">
        {lp.content || '본문이 없습니다.'}
      </div>
    </>
  );
}

export default LpDetailHeader;
