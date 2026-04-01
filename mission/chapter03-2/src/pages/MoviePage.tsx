import { useEffect, useState } from "react"
import axios from "axios"
import type { MoviesResponse, Movies } from "../types/Movies"
import MovieCard from "../component/MovieCard"
import { LoadingSpinner } from "../component/LoadingSpinner"
import PageController from "../component/PageController"
import { useParams } from "react-router-dom"
import Error from "./Error"

export default function MoviePage(){
    const [movies, setMovies] = useState<Movies[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const {category} = useParams<{category:string}>()
    const nextPage = () =>{
        setPage(prev => prev + 1)
    }
    const prevPage = () => {
        setPage(prev => prev - 1)
    }
    useEffect(() => {
        console.log(category)
        const fetchMovie = async() => {
            setIsLoading(true)
            try{
            const {data} = await axios.get<MoviesResponse>(`https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,{
                headers:{
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                }
            })
            setMovies(data.results)
            }
            catch{
                setIsError(true)
            }
            finally{
                setIsLoading(false)
            }
        }
        fetchMovie()
    }, [page,category])

    return (
        <>
            <PageController page={page} nextPage={nextPage} prevPage={prevPage}/>
            {isError && 
                <Error/>}
            {isLoading &&
            <div className="flex items-center justify-center h-dvh ">
                <LoadingSpinner/>
            </div>}
            {!isError && !isLoading &&
                <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                    {movies && 
                        movies?.map((movie) => (
                            <MovieCard key = {movie.id} movie={movie}/>
                        ))}
                </div>}
        </>
    )
}