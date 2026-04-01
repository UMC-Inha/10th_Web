import { useEffect, useState } from "react";
import axios from "axios";
import { TMDB_BASE_URL } from "../constants/tmdb";
import type { MovieCredit, MovieDetail } from "../types/movie";

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
};

// 영화 상세 정보를 가져오는 커스텀 훅
const useMovieDetail = (movieId: string | undefined) => {
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [movieCredit, setMovieCredit] = useState<MovieCredit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    // 영화 상세 정보와 크레딧 정보를 동시에 가져오는 함수
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [{ data: detail }, { data: credit }] = await Promise.all([
          axios.get<MovieDetail>(
            `${TMDB_BASE_URL}/movie/${movieId}?language=ko-KR`,
            { headers },
          ),
          axios.get<MovieCredit>(
            `${TMDB_BASE_URL}/movie/${movieId}/credits?language=ko-KR`,
            { headers },
          ),
        ]);
        setMovieDetail(detail);
        setMovieCredit(credit);
        setError(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message || "Unknown error");
        } else {
          setError("Failed to fetch movie details");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [movieId]);

  return { movieDetail, movieCredit, loading, error };
};

export default useMovieDetail;
