import type { MovieDetail, Credits } from '../types/movie';
import { fetchMovieDetail, fetchMovieCredits } from '../apis/movieApi';
import useCustomFetch from './useCustomFetch';

type MovieDetailData = { movie: MovieDetail; credits: Credits } | null;

const useMovieDetail = (movieId: string | undefined) => {
  const { data, isLoading, error } = useCustomFetch<MovieDetailData>(
    async () => {
      if (!movieId) return null;
      const [movie, credits] = await Promise.all([
        fetchMovieDetail(movieId),
        fetchMovieCredits(movieId),
      ]);
      return { movie, credits };
    },
    [movieId]
  );

  return {
    movie: data?.movie ?? null,
    credits: data?.credits ?? null,
    isLoading,
    error,
  };
};

export default useMovieDetail;
