import { useState } from 'react';
import { Link } from 'react-router';
import { useAxios } from '../hooks/useAxios';
import { api } from '../apis/axios';
import type { MovieResponse } from '../types/movie';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

type MovieListProps = {
  endpoint: string;
  title: string;
};

const MovieList = ({ endpoint, title }: MovieListProps) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, fetchData } = useAxios<MovieResponse>(
    (signal) =>
      api
        .get<MovieResponse>(endpoint, {
          params: {
            language: 'ko-KR',
            page,
          },
          signal,
        })
        .then((res) => res.data),
    [page, endpoint]
  );

  const totalPages = data?.total_pages ?? 1;
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  if (isLoading && !data) return <LoadingSpinner />;
  if (error && !data) return <ErrorAlert message={error} onRetry={fetchData} />;

  return (
    <>
      <h1 className="text-center p-12 bg-red-50">{title}</h1>

      {error && data ? (
        <div className="mx-auto max-w-lg px-4 pt-6">
          <ErrorAlert message={error} onRetry={fetchData} />
        </div>
      ) : null}

      {isLoading && data ? (
        <div className="py-6">
          <LoadingSpinner label="페이지 불러오는 중…" />
        </div>
      ) : null}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.results.map((movie) => (
          <li
            key={movie.id}
            className="bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-sm group relative border border-gray-200"
          >
            <Link to={`/movies/${movie.id}`} className="relative block w-full">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="group-hover:blur-sm w-full"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <h3 className="text-white text-lg font-bold">{movie.title}</h3>
                <p className="mt-2 text-sm text-white/90 line-clamp-3">{movie.overview}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <nav
        className="flex flex-wrap items-center justify-center gap-4 py-10"
        aria-label="페이지 이동"
      >
        <button
          type="button"
          disabled={isFirstPage}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          이전 페이지
        </button>
        <span className="text-sm text-gray-600 tabular-nums">
          {page} / {totalPages} 페이지
        </span>
        <button
          type="button"
          disabled={isLastPage}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          다음 페이지
        </button>
      </nav>
    </>
  );
};

export default MovieList;
