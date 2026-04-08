import axios from 'axios';
import type { IMovieListResponse, ICreditResponse } from '../models/movie.model';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = `Bearer ${import.meta.env.VITE_API_TOKEN}`;

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: ACCESS_TOKEN,
    accept: 'application/json'
  }
});

export const getMovies = async (category: string, page: number = 1) => {
  const { data } = await api.get<IMovieListResponse>(`/movie/${category}`, {
    params: { language: 'ko-KR', page }
  });
  return data;
};

export const getMovieDetails = async (movieId: string) => {
  const { data } = await api.get(`/movie/${movieId}?language=ko-KR`);
  return data;
};

export const getMovieCredits = async (movieId: string) => {
  const { data } = await api.get<ICreditResponse>(`/movie/${movieId}/credits?language=ko-KR`);
  return data;
};