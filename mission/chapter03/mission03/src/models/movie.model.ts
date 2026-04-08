export interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  tagline?: string;
  runtime?: number;
}

export interface IMovieListResponse {
  results: IMovie[];
  total_pages: number;

}

export interface ICast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface ICreditResponse {
  cast: ICast[];
}