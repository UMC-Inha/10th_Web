import { useState, useEffect } from "react";
import { loadMovieDetailData } from "../apis/movie";
import type { Details, Credits } from "../types/Movies";

export const useMovieDetail = (movieId: string | undefined) => {
  const [movieDetail, setMovieDetail] = useState<Details>();
  const [credits, setCredits] = useState<Credits>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!movieId) return;
    const fetchMovie = async () => {
      setIsLoading(true)
      try {
        const { detailData, creditsData } = await loadMovieDetailData(movieId);
        setMovieDetail(detailData);
        setCredits(creditsData);
        setIsError(false);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  return { movieDetail, credits, isLoading, isError };
};