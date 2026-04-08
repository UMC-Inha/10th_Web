import { useState } from 'react';
import type { Movie } from '../types/movie';
import { useNavigate } from 'react-router-dom';

//카드로 영화 보여주고 싶어서 만드는 컴포넌트

//movie card의 type 정의
interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="group relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44
      transition-transform duration-500 hover:scale-105"
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`}
        className=""
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50
        to-transparent backdrop-blur-md flex flex-col justify-center
        items-center text-white p-4
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <h2 className="text-lg font-bold text-center leading-snug">
          {movie.title}
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
