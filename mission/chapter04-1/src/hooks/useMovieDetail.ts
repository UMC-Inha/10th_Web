
import { loadMovieDetailData } from "../apis/movie";
import { useCustomFetch } from "./useCustomFetch";

export const useMovieDetail = (movieId: string | undefined) => {

  const { data, isLoading, isError } = useCustomFetch(
    loadMovieDetailData, 
    [movieId]
  );

  // 엔진이 가져온 데이터(data)를 이 훅의 규격에 맞게 분배
  return { 
    movieDetail: data?.detailData, 
    credits: data?.creditsData, 
    isLoading, 
    isError 
  };
}; 
