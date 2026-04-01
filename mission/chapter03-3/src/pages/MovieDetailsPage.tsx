import { useEffect, useState } from "react"
import axios from "axios"
import Error from "./Error"
import { LoadingSpinner } from "../component/LoadingSpinner"
import type { Details, Credits } from "../types/Movies"
import { useParams } from "react-router-dom"
import DetailHeader from "../component/DetailHeader"
import CastSection from "../component/CastSection"
const MovieDetailsPage = () => {
    const [movieDetail, setMovieDetail] = useState<Details>()
    const [credits, setCredits] = useState<Credits>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const {movieId} = useParams<{movieId:string}>()
    
    useEffect(() => {
        const fetchMovie = async() => {
            try{
            const headerCon = {
                headers:{Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`}
            }  
            const [{ data: detailData }, { data: creditsData }] = await Promise.all([
                axios.get<Details>(`https://api.themoviedb.org/3/movie/${movieId}`, headerCon),
                axios.get<Credits>(`https://api.themoviedb.org/3/movie/${movieId}/credits`, headerCon)
            ])
            console.log(creditsData)
            setMovieDetail(detailData)
            setCredits(creditsData)
            }
            catch{
                setIsError(true)
            }
            finally{
                setIsLoading(false)
            }
        }
        fetchMovie()

    }, [])
    return(
       <>
       {isError && 
                       <Error/>}
                   {isLoading &&
                   <div className="flex items-center justify-center h-dvh ">
                       <LoadingSpinner/>
                   </div>}
       {(movieDetail && credits) &&
            <div className="min-h-screen bg-black text-white p-8">
                <DetailHeader movieDetail={movieDetail}/>
                <CastSection creditsData={credits}/>
            </div>
        }
        </>
    )
}

export default MovieDetailsPage