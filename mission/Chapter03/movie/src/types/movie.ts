export type Movie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
}

export type MovieListResponse = {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export type MovieDetails = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date: string
  runtime: number | null
  genres: Array<{
    id: number
    name: string
  }>
}

export type CastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export type CrewMember = {
  id: number
  name: string
  job: string
}

export type MovieCreditsResponse = {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}
