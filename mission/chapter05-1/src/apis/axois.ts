import axios from "axios";

export const axiosInstance = axios.create({
    
    baseURL: import.meta.env.VITE_SEVER_API_URL,
    headers:{
        Authorization: `Bearer ${localStorage.getItem("accessToken")?.replace(/^"|"$/g, '')}`
    }
    
})
console.log("현재 axiosInstance에 박힌 헤더:", axiosInstance.defaults.headers.Authorization);