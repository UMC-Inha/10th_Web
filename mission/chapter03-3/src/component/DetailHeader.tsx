import type { Details } from "../types/Movies"

interface Prop{
    movieDetail:Details
}

const DetailHeader = ({movieDetail}:Prop) => {
    return(
        <header className="flex flex-col md:flex-row gap-8 mb-12 border-b border-gray-800 pb-8">
            <div className="w-full md:w-1/3 flex-shrink-0">
            <img src={`https://image.tmdb.org/t/p/w200${movieDetail.poster_path}`}
            alt={movieDetail.title}/>
            </div>
            <div className="w-full md:w-2/3 flex flex-col gap-3 pt-6">
            <h1 className="text-4xl font-bold">{movieDetail.title}</h1>
            <div className="text-gray-400 text-sm flex gap-3">
                <span>{movieDetail.vote_average}</span>
                <span>{movieDetail.vote_count}</span>
                <span>{movieDetail.runtime}분</span>
            </div>
            <p className="text-lg italic font-medium my-3">{movieDetail.tagline}</p>
            <p className="text-gray-300 text-base leading-relaxed">
                {movieDetail.overview}
            </p>
            </div>
        </header>
    )
}

export default DetailHeader