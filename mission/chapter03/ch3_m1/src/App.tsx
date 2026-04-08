import { useEffect, useState } from 'react'
import './index.css'
import MovieCard from './components/MovieCard'
import { type Movie } from './types/movie'
import { fetchPopularMovies } from './api/movies'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPopularMovies()
      .then((data) => {
        console.log('영화 데이터:', data.results)
        setMovies(data.results)
        setLoading(false)
      })
      .catch((err) => {
        console.error('API 오류:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-400 text-xl">오류: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        인기 영화
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default App
