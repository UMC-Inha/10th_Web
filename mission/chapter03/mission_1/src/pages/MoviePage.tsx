import { useEffect, useState } from 'react';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { getPopularMovies } from '../apis/api';

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  //useEffect 이용하여 데이터 불러옴
  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getPopularMovies();
      setMovies(data.results);
    };

    fetchMovies();
  }, []);

  return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies?.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
