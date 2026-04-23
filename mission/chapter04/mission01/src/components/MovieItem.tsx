import { Link } from 'react-router-dom';
import type { IMovie } from '../models/movie.model';

export const MovieItem = ({ movie }: { movie: IMovie }) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative block bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-red-900/30 hover:scale-105 transition-all duration-300"
    >
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          className="w-full aspect-[2/3] object-cover"
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center">
          <span className="text-zinc-600 text-xs">이미지 없음</span>
        </div>
      )}

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
        <h3 className="text-white text-xs font-bold mb-1 line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-yellow-400 text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
        </div>
        <p className="text-gray-300 text-[10px] line-clamp-3 leading-relaxed">{movie.overview}</p>
      </div>
    </Link>
  );
};