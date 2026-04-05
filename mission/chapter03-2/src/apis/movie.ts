import axios from "axios"
import type { MoviesResponse } from "../types/Movies";


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


