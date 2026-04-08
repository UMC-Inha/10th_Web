import { useEffect, useState } from "react"
import axios from "axios"
import type { MoviesResponse, Movies } from "../types/Movies"
import MovieCard from "../component/MovieCard"
export default function MoviePage(){
    const [movies, setMovies] = useState<Movies[]>([])
    useEffect(() => {
        const fetchMovie = async() => {
            const {data} = await axios.get<MoviesResponse>("https://api.themoviedb.org/3/movie/popular",{
                headers:{
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                }
            })
            setMovies(data.results)
        }
        fetchMovie()
    }, [])

    return (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {movies && 
                movies?.map((movie) => (
                    <MovieCard key = {movie.id} movie={movie}/>
                ))}
        </div>
    )
}