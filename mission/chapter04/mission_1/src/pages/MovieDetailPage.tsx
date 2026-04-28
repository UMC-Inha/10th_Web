import { useParams } from 'react-router-dom';
import { useState } from 'react';
import type { Credits, MovieDetails } from '../types/movie';
import { useEffect } from 'react';
import { getMovieDetails, getMovieCredits } from '../api/apis';
import { LoadingSpinner } from '../components/LoadingSpinner';
import usePending from '../hooks/usePending';
import useError from '../hooks/useError';

const MovieDetailPage = () => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = usePending();
  const [isError, setIsError] = useError();

  const { movieId } = useParams<{
    movieId: string;
  }>();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!movieId) return;
      setIsPending(true);

      try {
        const [detailData, creditsData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
        ]);

        setDetails(detailData);
        setCredits(creditsData);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  //로딩 처리
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh bg-[#0d0d0d]">
        <LoadingSpinner />
      </div>
    );
  }

  //에러처리
  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  //데이터 없을 때
  if (!details || !credits) return null;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* 배경 */}
      <div className="relative w-full h-[500px]">
        <img
          src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
          alt={details.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent" />

        {/* 영화 정보 */}
        <div className="absolute bottom-0 left-0 p-10 flex gap-8 items-end">
          <img
            src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
            alt={details.title}
            className="w-40 rounded-xl shadow-2xl hidden md:block"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{details.title}</h1>
            <div className="flex gap-4 text-gray-300 text-sm mb-3">
              <span>⭐ {details.vote_average.toFixed(1)}</span>
              <span>{details.release_date.slice(0, 4)}</span>
              <span>{details.runtime}분</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {details.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-white/20 px-3 py-1 rounded-full text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 줄거리 */}
      <div className="px-10 py-8 max-w-4xl">
        <h2 className="text-2xl font-bold mb-3 text-yellow-400">줄거리</h2>
        <p className="text-gray-300 leading-relaxed">{details.overview}</p>
      </div>

      {/* 출연진 */}
      <div className="px-10 py-6">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">감독/출연</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {credits.cast.slice(0, 20).map((actor) => (
            <div
              key={actor.id}
              className="flex flex-col items-center min-w-[80px]"
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : 'https://via.placeholder.com/80x80?text=No+Image'
                }
                alt={actor.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
              />
              <span className="text-xs text-center mt-2 text-white font-medium line-clamp-1">
                {actor.name}
              </span>
              <span className="text-xs text-center text-gray-400 line-clamp-1">
                {actor.character}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
