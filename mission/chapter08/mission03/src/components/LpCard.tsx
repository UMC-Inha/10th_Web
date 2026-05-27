// src/components/LpCard.tsx

import { useNavigate } from 'react-router-dom';
import type { Lp } from '../apis/lp';

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return `${mins} mins ago`;
  };

  return (
    <div
      onClick={() => navigate(`/lps/${lp.id}`)}
      className="relative aspect-square cursor-pointer overflow-hidden rounded-sm group"
    >
      {/* 썸네일 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white font-bold text-sm line-clamp-2 mb-1">{lp.title}</p>
        <p className="text-zinc-400 text-xs mb-1">{timeAgo(lp.createdAt)}</p>
        <div className="flex items-center gap-1 text-zinc-400 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <span>{lp.likes.length}</span>
        </div>
      </div>
    </div>
  );
};

export default LpCard;