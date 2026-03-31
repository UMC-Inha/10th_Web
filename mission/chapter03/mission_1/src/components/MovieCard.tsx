import { useState } from 'react';
import type { Movie } from '../types/movie';

//카드로 영화 보여주고 싶어서 만드는 컴포넌트

//movie card의 type 정의
interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  //hover 됐는지 아닌지에 대한 useState
  const [isHovered, setIsHoverd] = useState(false);

  //<img /> 카드의 이미지 불러오기 + alt로 이미지 안 나올 때 에러처리
  //isHoverd로 마우스 갖다댈 때 처리
  return (
    <div
      className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44
      transition-transform duration-500 hover:scale-105"
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`}
        className=""
      />

      {isHovered && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50
        to-transparent backdrop-blur-md flex flex-col justify-center
        items-center text-white p-4"
        >
          <h2 className="text-lg font-bold text-center leading-snug">
            {movie.title}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}
