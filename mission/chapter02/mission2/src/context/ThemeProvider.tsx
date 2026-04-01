import { useState, createContext, type PropsWithChildren, useContext } from "react";

type Theme = "LIGHT" | "DARK"

interface IThemeContext{
    theme: Theme
    toggleTheme: () => void;
}


export const ThemeContext = createContext<IThemeContext|undefined>(undefined)

export const ThemeProvider = ({children}:PropsWithChildren) => {
    const [theme, setTheme] = useState<Theme>("LIGHT")
    const toggleTheme = ():void => {
        setTheme((prevTheme):Theme => prevTheme === "LIGHT" ? "DARK" : "LIGHT" );
    }
    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if(!context){
        throw new Error("useTheme must be used with a ThemeProvider")
    }
    return context
}