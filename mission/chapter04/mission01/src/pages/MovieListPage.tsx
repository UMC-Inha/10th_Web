import { useState, useCallback } from 'react';
import { getMovies } from '../api/movieApi';
import type { IMovieListResponse } from '../models/movie.model';
import { MovieItem } from '../components/MovieItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useCustomFetch } from '../hooks/useCustomFetch';

interface MovieListPageProps {
  category: string;
  title: string;
}

const MovieListPage = ({ category, title }: MovieListPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFn = useCallback(
    () => getMovies(category, currentPage),
    [category, currentPage]
  );

  const { data, isLoading, error } = useCustomFetch<IMovieListResponse>(fetchFn);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const totalPages = data.total_pages;

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-black mb-8 text-white">{title}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.results.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-4 mt-16">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-full bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-600 transition-colors text-lg font-bold"
        >
          ‹
        </button>

        <span className="text-sm font-semibold text-zinc-300 min-w-[80px] text-center">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-full bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-600 transition-colors text-lg font-bold"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default MovieListPage;