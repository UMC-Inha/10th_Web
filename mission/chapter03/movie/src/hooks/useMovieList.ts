import { useEffect, useState } from "react";
import axios from "axios";
import { TMDB_BASE_URL } from "../constants/tmdb";
import type { Movie, MovieResponse } from "../types/movie";

// 영화 목록을 가져오는 커스텀 훅
const useMovieList = (categoryId: string, page: number = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    // 영화 목록을 가져오는 함수
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<MovieResponse>(
          `${TMDB_BASE_URL}/movie/${categoryId}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
            },
          },
        );
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setError(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message || "Unknown error");
        } else {
          setError("Failed to fetch movies");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [categoryId, page]);

  return { movies, loading, error, totalPages };
};

export default useMovieList;
