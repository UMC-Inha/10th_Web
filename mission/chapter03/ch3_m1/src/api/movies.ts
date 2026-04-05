import { type MovieResponse } from '../types/movie'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string

const BASE_URL = 'https://api.themoviedb.org/3'
const HEADERS = { Authorization: `Bearer ${ACCESS_TOKEN}` }

export async function fetchPopularMovies(): Promise<MovieResponse> {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`,
    { headers: HEADERS }
  )
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
  return res.json()
}
