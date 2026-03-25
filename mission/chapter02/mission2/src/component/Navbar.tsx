import clsx from "clsx";
import { useTheme } from "../context/ThemeProvider"
import ThemeToggleBtn from "./ThemeToggleBtn"
export default function Navbar(){
    const {theme, toggleTheme} = useTheme()
    const isLight = theme === "LIGHT";
    return (
        <nav 
        className={clsx(
            "p-4 w-full flex justify-end",
            isLight ? "bg-white" : "bg-gray-800"
        )}>
            <ThemeToggleBtn/>
        </nav>
    )
}