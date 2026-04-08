import axios from "axios";
import { TMDB_BASE_URL } from "../constants/tmdb";

const axiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
});

export default axiosInstance;
