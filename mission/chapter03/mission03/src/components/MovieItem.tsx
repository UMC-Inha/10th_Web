import { Link } from 'react-router-dom';
import type { IMovie } from '../models/movie.model';

export const MovieItem = ({ movie }: { movie: IMovie }) => {
  return (
    <Link to={`/movies/${movie.id}`} className="group relative block bg-zinc-900 rounded-lg overflow-hidden">
      <img 
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
        className="w-full aspect-[2/3] object-cover group-hover:blur-sm transition-all"
        alt={movie.title}
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-center">
        <h3 className="text-white text-xs font-bold mb-2">{movie.title}</h3>
        <p className="text-gray-300 text-[10px] line-clamp-5">{movie.overview}</p>
      </div>
    </Link>
  );
};