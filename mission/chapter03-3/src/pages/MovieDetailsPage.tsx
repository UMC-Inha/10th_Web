import { useEffect, useState } from "react"
import Error from "./Error"
import { LoadingSpinner } from "../component/LoadingSpinner"
import type { Details, Credits } from "../types/Movies"
import { useParams } from "react-router-dom"
import DetailHeader from "../component/DetailHeader"
import CastSection from "../component/CastSection"
import { loadMovieDetailData } from "../apis/movie"
const MovieDetailsPage = () => {
    const [movieDetail, setMovieDetail] = useState<Details>()
    const [credits, setCredits] = useState<Credits>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isError, setIsError] = useState<boolean>(false)
    const {movieId} = useParams<{movieId:string}>()
    
    useEffect(() => {
        const fetchMovie = async() => {
            try{
            const {detailData, creditsData} = await loadMovieDetailData(movieId)
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

    }, [movieId])
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