import { useNavigate } from 'react-router-dom';
import type { Lp } from '../types/lp';

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lps/${lp.id}`)}
      className="relative group cursor-pointer rounded-lg overflow-hidden aspect-square bg-gray-200"
    >
      {/* 썸네일 */}
      <img
        src={lp.thumbnail || 'https://via.placeholder.com/300'}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* 호버 시 오버레이 */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold text-lg truncate">{lp.title}</h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-gray-300 text-sm">
            {new Date(lp.createdAt).toLocaleDateString('ko-KR')}
          </span>
          <span className="text-gray-300 text-sm">
            ❤️ {lp.likes?.length ?? 0}
          </span>
        </div>
        {/* 태그 */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {lp.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LpCard;
