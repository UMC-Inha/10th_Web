import { useEffect, useState } from 'react';
import type { Movie } from '../types/movie';
import { fetchPopularMovies } from '../apis/movieApi';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies();
        setMovies(data.results);
      } catch (error) {
        console.error('영화 데이터를 불러오는데 실패했습니다.', error);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {movies?.map((movie) => (
        <div
          key={movie.id}
          className="group relative overflow-hidden rounded-xl"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title || '영화'} 영화 포스터`}
            loading="lazy"
            className="w-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h2 className="text-center text-sm font-bold text-white">
              {movie.title}
            </h2>
            <p className="mt-2 line-clamp-4 text-center text-xs text-gray-200">
              {movie.overview}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviesPage;
