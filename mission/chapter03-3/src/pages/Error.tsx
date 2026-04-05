import { Link } from "react-router-dom"
export default function Error(){
    return(
        <div className="flex flex-col items-start gap-4 p-5">
            <p className="text-red-500 text-2xl">에러가 발생 했습니다</p>
            <Link className="bg-[#dda5e3] px-4 py-6 rounded-lg" to="/">홈으로</Link>
        </div>
    )
}