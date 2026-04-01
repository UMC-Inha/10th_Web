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
