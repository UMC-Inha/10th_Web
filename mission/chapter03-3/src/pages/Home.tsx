import { Outlet } from "react-router-dom"
import Navbar from "../component/Navbar"

const Home = () => {
    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}

export default Home