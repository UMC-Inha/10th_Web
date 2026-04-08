import axios from 'axios';
import type { MovieResponse } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
};

export const fetchPopularMovies = async (): Promise<MovieResponse> => {
  const { data } = await axios.get<MovieResponse>(
    `${BASE_URL}/movie/popular?language=ko-KR&page=1`,
    { headers }
  );
  return data;
};
