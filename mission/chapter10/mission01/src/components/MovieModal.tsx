import type { IMovie } from '../models/movie.model';

interface MovieModalProps {
  movie: IMovie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  if (!movie) return null;

  const handleIMDbSearch = () => {
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* 모달 카드 바디 */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-white max-h-[90vh]">
        
        {/* 상단 포스터 배너 구역 */}
        <div className="relative w-full h-48 md:h-56 bg-zinc-950">
          <img 
            src={movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            className="w-full h-full object-cover opacity-40" 
            alt="backdrop" 
          />
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-zinc-900 to-transparent flex items-end gap-4">
            <h2 className="text-xl font-black text-white drop-shadow-md">{movie.title}</h2>
          </div>
        </div>

        {/* 메인 상세 정보 구역 (스크롤 적용) */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 font-semibold">
            <p>📅 개봉일: <span className="text-zinc-200">{movie.release_date || "미정"}</span></p>
            <p>⭐ 평점: <span className="text-amber-400">{movie.vote_average.toFixed(1)}</span></p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">줄거리 요약</h4>
            <p className="text-zinc-300 text-sm leading-relaxed max-h-32 overflow-y-auto pr-1">
              {movie.overview || "본 영화는 등록된 한국어 줄거리 시놉시스가 존재하지 않습니다."}
            </p>
          </div>

          {/* 하단 제어 버튼 컴포넌트 구역 */}
          <div className="flex items-center gap-3 mt-4 border-t border-zinc-800 pt-4">
            <button
              onClick={handleIMDbSearch}
              className="flex-1 py-3 bg-yellow-500 text-black font-black rounded-lg text-xs hover:bg-yellow-400 transition-colors"
            >
              IMDb에서 검색하기 🔍
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-lg text-xs hover:bg-zinc-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}