import type { IMovie } from '../models/movie.model';

interface MovieItemProps {
  movie: IMovie;
}

export const MovieItem = ({ movie }: MovieItemProps) => {
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  return (
    <div className="group flex flex-col bg-[#1c1c1c] rounded-md shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[2/3]">
        <img 
          src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/no-image.png'} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 p-5 flex flex-col justify-center">
          <p className="text-white text-xs font-medium leading-5 overflow-y-auto scrollbar-hide">
            {movie.overview || "등록된 줄거리가 없습니다."}
          </p>
        </div>
      </div>

      <div className="p-3 bg-zinc-900">
        <h3 className="text-white text-sm font-semibold truncate">{movie.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-yellow-500 text-[10px]">★ {movie.vote_average.toFixed(1)}</span>
          <span className="text-zinc-500 text-[10px]">{movie.release_date}</span>
        </div>
      </div>
    </div>
  );
};