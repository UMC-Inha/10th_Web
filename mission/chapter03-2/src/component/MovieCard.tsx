import type { Movies } from "../types/Movies"
interface MovieCardProps{
    movie:Movies
}
export default function MovieCard({movie}:MovieCardProps){
    
    return(
        <div
        className="group relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44 transition-transform duration-500 hover:scale-105">
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
            alt={movie.title}/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white p-4 opacity-0 group-hover:opacity-100">
                <h2 className="text-lg font-bold leading-snug">{movie.title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">{movie.overview}</p>
            </div>
        </div>
    )
}