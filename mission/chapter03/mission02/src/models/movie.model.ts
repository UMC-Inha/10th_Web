export interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export interface IMovieListResponse {
  results: IMovie[];
  page: number;
  total_pages: number;
}