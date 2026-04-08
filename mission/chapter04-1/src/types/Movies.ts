import type { JSX } from "react/jsx-runtime"

export type Movies = {
    adult: boolean,
    backdrop_path: string,
    genre_ids: number[]
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}

export type MoviesResponse = {
    page:number;
    results:Movies[];
    total_pages:number;
    total_result:number;
}

interface belongs_to_collection{
    "id": number,
    "name": string,
    "poster_path": string,
    "backdrop_path": string
}

interface genre {
    "id":number,
    "name":string
}

interface production_company{
    "id": number,
    "logo_path": string,
    "name": string,
    "origin_country": string
}

interface production_country{
    "iso_3166_1": string,
    "name": string
}
interface spoken_language{
    "english_name": string,
    "iso_639_1": string,
    "name": string
}
export interface Details { 
    "adult": boolean,
    "backdrop_path": string,
    "belongs_to_collection": belongs_to_collection
    "budget": number,
    "genres": genre[],
    "homepage": string,
    "id": number,
    "imdb_id": string,
    "origin_country": string[],
    "original_language": string,
    "original_title": string,
    "overview": string,
    "popularity": number,
    "poster_path": string,
    "production_companies": production_company[]
    "production_countries": production_country[],
    "release_date": string
    "revenue": number,
    "runtime": number,
    "spoken_languages": spoken_language[],
    "status": string,
    "tagline": string,
    "title": string,
    "video": boolean,
    "vote_average": number,
    "vote_count": number
}

export interface Cast{
    map(arg0: (person: Cast) => JSX.Element): import("react").ReactNode
    "adult": boolean,
    "gender": number,
    "id": number,
    "known_for_department": string,
    "name": string,
    "original_name": string,
    "popularity": number,
    "profile_path": string | null,
    "credit_id": string,
    "department": string,
    "job": string
}

export interface Crew{
    map(arg0: (person: Crew) => JSX.Element): import("react").ReactNode
    adult: boolean
    credit_id: string
    department: string
    gender: number
    id: number
    job: string
    known_for_department: string
    name: string
    original_name: string
    popularity: number
    profile_path: string
}

export interface Credits{
    id:number
    cast:Cast
    crew:Crew
}