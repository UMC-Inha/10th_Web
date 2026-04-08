import { useEffect, useState } from "react"
import type { Movies } from "../types/Movies"
import MovieCard from "../component/MovieCard"
import { LoadingSpinner } from "../component/LoadingSpinner"
import PageController from "../component/PageController"
import { useParams } from "react-router-dom"
import Error from "./Error"
import { loadMovieData } from "../apis/movie"

export default function MoviePage(){
    const [movies, setMovies] = useState<Movies[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const {category} = useParams<{category:string}>()
    const [maxPage, setMaxPage] = useState<number>(0)
    const nextPage = () =>{
        if (page === maxPage){
            return
        }
        setPage(prev => prev + 1)
    }
    const prevPage = () => {
        if (page === 1){
            return
        }
        setPage(prev => prev - 1)
    }
    useEffect(() => {
        console.log(category)
        const fetchMovie = async() => {
            setIsLoading(true)
            try{
            const data = await loadMovieData(category, page)
            setMaxPage(data.total_pages)
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
            <PageController page={page} maxPage={maxPage} nextPage={nextPage} prevPage={prevPage}/>
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