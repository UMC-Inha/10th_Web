import {useState} from "react"
import Navbar from "./Navbar"
import ThemeContents from "./ThemeContents"
import { ThemeProvider } from "../context/ThemeProvider"

export default function ContextPage(){
    return (
        <ThemeProvider>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Navbar/>
                <main className="flex-1 w-full">
                    <ThemeContents/>  
                </main>
            </div>
        </ThemeProvider>
    )
}