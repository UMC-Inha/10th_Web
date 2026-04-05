import type { Credits, Cast, Crew } from "../types/Movies"
import Crews from "./Crews"

interface CastProp{
    creditsData:Credits
}

const CastSection = ({creditsData}:CastProp) => {
    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">감독 / 출연</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {creditsData.cast.map((person:Cast) => (
                    <Crews key={person.credit_id} person={person} />
                ))}
                {creditsData.crew.map((person:Crew) => (
                    <Crews key={person.credit_id} person={person} />
                ))}
            </div>
        </section>
    )
}

export default CastSection