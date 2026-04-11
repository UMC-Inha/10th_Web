import axios from "axios"
import type { Credits, Details, MoviesResponse } from "../types/Movies"

export const loadMovieDetailData = async(movieId:string|undefined) => {
    if (!movieId) {
        throw new Error("movieId가 없습니다."); 
    }
    const headerCon = {
        headers:{Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`}
    }
    const [{ data: detailData }, { data: creditsData }] = await Promise.all([
        axios.get<Details>(`https://api.themoviedb.org/3/movie/${movieId}`, headerCon),
        axios.get<Credits>(`https://api.themoviedb.org/3/movie/${movieId}/credits`, headerCon)
    ])

    return {detailData:detailData, creditsData:creditsData}
    
}
export const loadMovieData = async(category:string|undefined, page:number) => {
    if (!category) {
        throw new Error("category가 없습니다."); 
    }
    const {data} = await axios.get<MoviesResponse>(`https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,{
                headers:{
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                }
            }
        )
    return data
}


