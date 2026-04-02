import axios from 'axios';
import type { IMovieListResponse } from '../models/movie.model';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = `Bearer ${import.meta.env.VITE_API_TOKEN}`;

export const getPopularMovies = async (page: number = 1) => {
  const { data } = await axios.get<IMovieListResponse>(
    `${TMDB_BASE_URL}/movie/popular`,
    {
      params: { language: 'ko-KR', page },
      headers: { Authorization: ACCESS_TOKEN,
            accept: 'application/json'
    }
    }
  );
  return data;
};