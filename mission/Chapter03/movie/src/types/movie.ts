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

// 영화 상세 페이지
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

// 출연진 정보
export type CastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
}

// 제작진 정보
export type CrewMember = {
  id: number
  name: string
  job: string
  profile_path: string | null
}

// /credits API 응답
export type MovieCreditsResponse = {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}
