import { useTheme } from "../context/ThemeProvider"
import clsx from "clsx"
export default function ThemeToggleBtn(){
    const {theme, toggleTheme} = useTheme()

    const isLight = theme === "LIGHT";
    return(
        <button onClick={toggleTheme} 
        className={clsx("px-4 py-2 mt-4 rounded-md transition-all", {
            "bg-black text-white": !isLight,
            "bg-white text-black": isLight,
        })}>
            {isLight ? "다크 모드" : "라이트 모드"}
        </button>
    );
}

