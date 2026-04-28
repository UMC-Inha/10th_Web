import axios from 'axios';
import type { MovieResponse, MovieDetails, Credits } from '../types/movie';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
  },
});

export const getPopularMovies = async (
  category: string = 'popular',
  page: number = 1,
): Promise<MovieResponse> => {
  const { data } = await axiosInstance.get<MovieResponse>(
    `/movie/${category}?language=en-US&page=${page}`,
  );
  return data;
};

export const getMovieDetails = async (movieId: string) => {
  const { data } = await axiosInstance.get<MovieDetails>(`/movie/${movieId}`);
  return data;
};

export const getMovieCredits = async (movieId: string) => {
  const { data } = await axiosInstance.get<Credits>(
    `/movie/${movieId}/credits`,
  );
  return data;
};
