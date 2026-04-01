import axios from 'axios';

const TOKEN = import.meta.env.VITE_MOVIE_API_TOKEN;

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});
