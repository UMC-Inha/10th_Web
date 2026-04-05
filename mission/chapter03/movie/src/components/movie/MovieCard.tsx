import { useState } from "react";
import { Link } from "react-router-dom";
import { TMDB_IMAGE_BASE_URL } from "../../constants/tmdb";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  categoryId: string;
}

// 영화 카드 컴포넌트
const MovieCard = ({ movie, categoryId }: MovieCardProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    // 영화 상세 페이지로 이동하는 링크
    <Link to={`/movies/${categoryId}/${movie.id}`}>
      <div className="relative cursor-pointer aspect-[2/3] group overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300">
        {/* 영화 포스터 */}
        {movie.poster_path ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg" />
            )}
            <img
              src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className={`object-cover w-full h-full group-hover:blur-md transition-all duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-4xl">
            🎬
          </div>
        )}
        {/* 영화 제목 및 설명 */}
        <div className="absolute p-8 inset-0 flex flex-col gap-4 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-center text-xl font-bold">
            {movie.title}
          </span>
          <span className="text-white line-clamp-3 text-center text-sm font-light">
            {movie.overview}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
