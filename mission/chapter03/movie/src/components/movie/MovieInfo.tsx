import type { MovieDetail } from "../../types/movie";
import { TMDB_IMAGE_BASE_URL } from "../../constants/tmdb";

interface MovieInfoProps {
  movieDetail: MovieDetail;
}

// 영화 정보 컴포넌트
const MovieInfo = ({ movieDetail }: MovieInfoProps) => {
  return (
    <div className="bg-gray-900">
      {/* 배경 이미지 영역 */}
      <div
        className="relative bg-cover bg-center min-h-[500px] flex items-end"
        style={{
          backgroundImage: movieDetail.backdrop_path
            ? `url(${TMDB_IMAGE_BASE_URL}${movieDetail.backdrop_path})`
            : undefined,
        }}
      >
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />

        {/* 콘텐츠 */}
        <div className="relative z-10 flex items-end gap-10 px-16 pb-10 w-full">
          {/* 포스터 */}
          {movieDetail.poster_path && (
            <img
              src={`${TMDB_IMAGE_BASE_URL}${movieDetail.poster_path}`}
              alt={movieDetail.title}
              className="w-48 rounded-xl shadow-2xl shrink-0 border border-white/10"
            />
          )}

          {/* 텍스트 */}
          <div className="flex flex-col gap-2 pb-2">
            <h1 className="text-white text-5xl font-bold drop-shadow-lg">
              {movieDetail.title}
            </h1>
            {movieDetail.tagline && (
              <p className="text-gray-300 text-base italic">
                {movieDetail.tagline}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
              <span className="bg-white/10 px-2 py-1 rounded text-white">
                {movieDetail.release_date?.slice(0, 4)}
              </span>
              {movieDetail.runtime && (
                <span className="bg-white/10 px-2 py-1 rounded text-white">
                  {movieDetail.runtime}분
                </span>
              )}
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded font-semibold">
                ⭐ {movieDetail.vote_average?.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 줄거리 */}
      <div className="px-16 py-8 max-w-4xl">
        <h2 className="text-white text-xl font-semibold mb-3">줄거리</h2>
        <p className="text-gray-400 leading-relaxed text-sm">
          {movieDetail.overview}
        </p>
      </div>
    </div>
  );
};

export default MovieInfo;
