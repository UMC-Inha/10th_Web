export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  status: string;
  tagline: string;
  vote_average: number;
};

export type CreditMember = {
  id: number;
  name: string;
  profile_path: string | null;
};

export type CastMember = CreditMember & {
  cast_id: number;
  character: string;
  credit_id: string;
};

export type CrewMember = CreditMember & {
  credit_id: string;
  department: string;
  job: string;
};

export type MovieCredit = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};
