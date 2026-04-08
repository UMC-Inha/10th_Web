import type { Cast, Crew } from "../types/Movies"

interface CrewsProp{
    person: Cast | Crew
}
const Crews = ({person}:CrewsProp) => {
    return(
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 mb-3 overflow-hidden rounded-full border-2 border-gray-800 bg-gray-900">
                {person.profile_path ? (
                    <img 
                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        No Image
                    </div>
                )}
            </div>
            <p className="text-sm font-semibold text-white text-center line-clamp-1">
                {person.name}
            </p>
            <p className="text-xs text-gray-400 text-center line-clamp-1">
                {person.known_for_department}
            </p>
        </div>
    )
}

export default Crews