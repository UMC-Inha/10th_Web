import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from './types/movies';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  console.log(movies);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization:`Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjI5Njg1OGVhODY2YWQxMTQzMjM5MzZkYTM1YmFhNSIsIm5iZiI6MTc3NTA0ODM4MC40NjEsInN1YiI6IjY5Y2QxNmJjZGMyMWIxZWE3ZTg3YTgxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xX48Y0_iwNgA9NY4BFLK-eazz5_y1B4qaAx3ESrjh3E`,
          },
        }
      );
      setMovies(data.results);
    };

    fetchMovies();
  }, []);

  return (
    <ul>
      {movies?.map((movie) => (
        <li key={movie.id}>
          <h2>{movie.title}</h2>
          <p>{movie.release_date}</p>
        </li>
      ))}
    </ul>
  );
};

export default MoviesPage;