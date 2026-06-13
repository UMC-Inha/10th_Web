import { type MovieResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string;
const BASE_URL = 'https://api.themoviedb.org/3';
const HEADERS = { Authorization: `Bearer ${ACCESS_TOKEN}` };

export async function searchMovies(
  query: string,
  includeAdult: boolean,
  language: string,
  page: number = 1
): Promise<MovieResponse> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    query: query.trim(),
    include_adult: String(includeAdult),
    language,
    page: String(page),
  });
  const res = await fetch(`${BASE_URL}/search/movie?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export function getPosterUrl(
  posterPath: string | null,
  size: 'w300' | 'w500' | 'original' = 'w500'
): string | null {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
