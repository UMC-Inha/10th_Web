import axios from 'axios';
import type { IMovieListResponse, ICreditResponse, IMovie } from '../models/movie.model';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = `Bearer ${import.meta.env.VITE_API_TOKEN}`;

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: ACCESS_TOKEN,
    accept: 'application/json',
  },
});

export const getMovies = async (category: string, page: number = 1): Promise<IMovieListResponse> => {
  const { data } = await api.get<IMovieListResponse>(`/movie/${category}`, {
    params: { language: 'ko-KR', page },
  });
  return data;
};

export const getMovieDetails = async (movieId: string): Promise<IMovie> => {
  const { data } = await api.get<IMovie>(`/movie/${movieId}`, {
    params: { language: 'ko-KR' },
  });
  return data;
};

export const getMovieCredits = async (movieId: string): Promise<ICreditResponse> => {
  const { data } = await api.get<ICreditResponse>(`/movie/${movieId}/credits`, {
    params: { language: 'ko-KR' },
  });
  return data;
};