import Error from "./Error"
import { LoadingSpinner } from "../component/LoadingSpinner"
import { useParams } from "react-router-dom"
import DetailHeader from "../component/DetailHeader"
import CastSection from "../component/CastSection"
import { useMovieDetail } from "../hooks/useMovieDetail"
const MovieDetailsPage = () => {
    const {movieId} = useParams<{movieId:string}>()
    const {movieDetail, credits, isLoading, isError} = useMovieDetail(movieId)
    return(
       <>
            {isError && <Error/>}
                {isLoading &&
                    <div className="flex items-center justify-center h-dvh ">
                        <LoadingSpinner/>
                    </div>}
            {(movieDetail && credits) &&
                <div className="min-h-screen bg-black text-white p-8">
                    <DetailHeader movieDetail={movieDetail}/>
                    <CastSection creditsData={credits}/>
                </div>}
        </>
    )
}

export default MovieDetailsPage