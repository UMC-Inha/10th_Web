import axiosInstance from "./axiosInstance";
import type { MovieResponse, MovieDetail, MovieCredit } from "../types/movie";

// 영화 목록을 가져오는 API
export const getMovieList = (categoryId: string, page: number) =>
  axiosInstance.get<MovieResponse>(
    `/movie/${categoryId}?language=ko-KR&page=${page}`,
  );

// 영화 상세 정보를 가져오는 API
export const getMovieDetail = (movieId: string) =>
  axiosInstance.get<MovieDetail>(`/movie/${movieId}?language=ko-KR`);

// 영화 크레딧 정보를 가져오는 API
export const getMovieCredits = (movieId: string) =>
  axiosInstance.get<MovieCredit>(`/movie/${movieId}/credits?language=ko-KR`);
