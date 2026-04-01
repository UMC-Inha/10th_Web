import { useEffect, useState } from 'react'
import type { Movie, MovieListResponse } from '../types/movie'

type MovieListPageProps = {
  title: string
  endpoint: 'popular' | 'upcoming' | 'top_rated' | 'now_playing'
}

const TMDB_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmQ2NDAxMTg5NTdjZTc1OWYyNGY2MjM4MWEwYjMwOSIsIm5iZiI6MTc3NTAyMTYwNC40ODUsInN1YiI6IjY5Y2NhZTI0YWU0M2I4MGIzMTU1MGRjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TWWBx2Ne_2oV9t72nXONrf08hd7VFD2FOuUNKBG6cgc'

const MovieListPage = ({ title, endpoint }: MovieListPageProps) => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${endpoint}?language=ko-KR&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_TOKEN}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`)
        }

        const data: MovieListResponse = await response.json()
        console.log(`[${endpoint}] page ${currentPage}:`, data.results)

        setMovies(data.results)
        setTotalPages(data.total_pages)
        setErrorMessage('')
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('알 수 없는 오류가 발생했습니다.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [endpoint, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [endpoint])

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">현재 페이지: {currentPage}</p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
          <p className="text-slate-700">영화 목록을 불러오는 중...</p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{errorMessage}</div>
      )}

      {!isLoading && !errorMessage && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie) => {
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'

              return (
                <article key={movie.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="aspect-[2/3] h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:blur-[1.5px]"
                  />

                  <div className="absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="text-sm font-semibold">{movie.title}</h3>
                    <p className="mt-1 text-xs text-neutral-200">{movie.overview || '줄거리 정보가 없습니다.'}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={!canGoPrev}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전 페이지
            </button>
            <span className="text-sm text-slate-700">{currentPage} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!canGoNext}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 페이지
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default MovieListPage
