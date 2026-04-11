import MovieCard from "../component/MovieCard"
import { LoadingSpinner } from "../component/LoadingSpinner"
import PageController from "../component/PageController"
import { useParams } from "react-router-dom"
import Error from "./Error"
import { useMovieData } from "../hooks/useMovieData"

export default function MoviePage(){
    const {category} = useParams<{category:string}>()
    const {page, nextPage, prevPage, maxPage, isError, isLoading, movies} = useMovieData(category)
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