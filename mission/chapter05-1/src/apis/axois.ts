import axios from "axios";

export const axiosInstance = axios.create({
    
    baseURL: import.meta.env.VITE_SEVER_API_URL,
    headers:{
        Authorization: `Bearer ${localStorage.getItem("accessToken")?.replace(/^"|"$/g, '')}`
    }
    
})