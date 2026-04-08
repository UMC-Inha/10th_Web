import type { Movies } from "../types/Movies"
interface MovieCardProps{
    movie:Movies
}
export default function MovieCard({movie}:MovieCardProps){
    return(
        <div>
            <p>{movie.title}</p>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
            alt={movie.title}/>
        </div>
    )
}