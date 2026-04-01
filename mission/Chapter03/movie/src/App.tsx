import { useEffect, useState } from 'react'

type Movie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
}

type PopularMoviesResponse = {
  results: Movie[]
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmQ2NDAxMTg5NTdjZTc1OWYyNGY2MjM4MWEwYjMwOSIsIm5iZiI6MTc3NTAyMTYwNC40ODUsInN1YiI6IjY5Y2NhZTI0YWU0M2I4MGIzMTU1MGRjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TWWBx2Ne_2oV9t72nXONrf08hd7VFD2FOuUNKBG6cgc`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`)
        }

        const data: PopularMoviesResponse = await response.json()
        console.log('불러온 영화 데이터:', data.results)
        setMovies(data.results)
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
  }, [])

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-neutral-800 sm:text-3xl">인기 영화</h1>

        {isLoading && <p className="text-neutral-700">영화 목록을 불러오는 중...</p>}

        {!isLoading && errorMessage && (
          <p className="rounded-md bg-red-100 p-3 text-red-700">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie) => {
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'

              return (
                <article key={movie.id} className="group relative overflow-hidden rounded-xl">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:blur-[1.5px]"
                  />

                  <div className="absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h2 className="line-clamp-1 text-sm font-semibold">{movie.title}</h2>
                    <p className="mt-1 line-clamp-3 text-xs text-neutral-200">{movie.overview || '줄거리 정보가 없습니다.'}</p>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}

export default App
