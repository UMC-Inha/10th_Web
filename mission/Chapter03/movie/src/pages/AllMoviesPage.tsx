import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { MovieListResponse } from '../types/movie'
import useCustomFetch from '../hooks/useCustomFetch'

const AllMoviesPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const url = `https://api.themoviedb.org/3/discover/movie?language=ko-KR&sort_by=popularity.desc&page=${currentPage}`
  const { data, isLoading, errorMessage } = useCustomFetch<MovieListResponse>(url)

  const movies = data?.results ?? []
  const totalPages = data?.total_pages ?? 1

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">전체 영화</h2>
        <p className="text-sm text-slate-200">현재 페이지: {currentPage}</p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-slate-900 p-4 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-sky-400" />
          <p className="text-slate-200">영화 목록을 불러오는 중...</p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="rounded-xl border border-red-400/40 bg-red-950/60 p-4 text-red-200">{errorMessage}</div>
      )}

      {!isLoading && !errorMessage && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie) => {
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'

              return (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="group relative block overflow-hidden rounded-xl border border-white/20 bg-slate-900 shadow-sm"
                >
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="aspect-2/3 h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:blur-[1.5px]"
                  />

                  <div className="absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="text-sm font-semibold">{movie.title}</h3>
                    <p className="mt-1 text-xs text-neutral-200">{movie.overview || '줄거리 정보가 없습니다.'}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={!canGoPrev}
              className="rounded-md border border-white/20 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전 페이지
            </button>
            <span className="text-sm text-slate-200">{currentPage} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!canGoNext}
              className="rounded-md border border-white/20 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 페이지
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default AllMoviesPage
