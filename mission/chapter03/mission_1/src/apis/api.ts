import axios from 'axios';
import type { MovieResponse } from '../types/movie';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
  },
});

export const getPopularMovies = async() => {
  const {data} = await axiosInstance.get<MovieResponse>(
    '/movie/popular?language=en-US&page=1'
  );

  return data;
}