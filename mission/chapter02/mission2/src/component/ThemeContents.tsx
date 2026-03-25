import clsx from "clsx";
import { useTheme } from "../context/ThemeProvider";
export default function ThemeContents(){
    const {theme, toggleTheme} = useTheme()
    
    const isLight = theme === "LIGHT";
    return (
        <div className={clsx(
            "p-4 h-dvh", 
            isLight ? "bg-white":"bg-gray-800"
        )}>
            <h1 className={clsx(
                "text-wxl font-bold",
                isLight ? "text-black" : "text-white"
            )}>
                Theme Content
            </h1>
            <p className={clsx("mt-2", isLight ? "text-black" : "text-white")}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos ex minus excepturi labore laboriosam, illum voluptatum magni iste dolores asperiores. Ducimus rerum placeat nulla, eius ipsum iusto natus officiis labore!
            </p>
        </div>
    )
}