import { useState, useEffect } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const TOKEN = import.meta.env.VITE_MOVIE_API_TOKEN;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    axios
      .get<MovieResponse>(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      .then((response) => {
        setMovies(response.data.results);
      });
  }, []);

  console.log(movies);

  return (
    <>
      <h1>Movies</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-sm group relative border border-gray-200"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="group-hover:blur-sm"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <h3 className="text-white text-lg font-bold">{movie.title}</h3>
              <p className="mt-2 text-sm text-white/90 line-clamp-3">{movie.overview}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
