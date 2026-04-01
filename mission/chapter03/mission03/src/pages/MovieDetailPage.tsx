import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import type { Movie, MovieDetail, Credits } from '../types/movie';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const preview = (location.state as { movie?: Movie } | null)?.movie ?? null;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchData = async () => {
      setError(null);
      try {
        const headers = {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        };
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers }
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers }
          ),
        ]);
        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch {
        setError('영화 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchData();
  }, [movieId]);

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // 상세 데이터가 없으면 preview(목록에서 넘어온 데이터)로 먼저 렌더링
  const displayTitle = movie?.title ?? preview?.title;
  const displayPoster = movie?.poster_path ?? preview?.poster_path;
  const displayOverview = movie?.overview ?? preview?.overview;
  const displayVote = movie?.vote_average ?? preview?.vote_average;
  const displayDate = movie?.release_date ?? preview?.release_date;

  // preview도 없으면 (직접 URL 접근) 스켈레톤
  if (!displayTitle) {
    return (
      <div className="min-h-screen bg-gray-950 text-white animate-pulse">
        <div className="h-80 w-full bg-gray-800" />
        <div className="mx-auto max-w-5xl px-6 pb-12">
          <div className="mb-6 mt-4 h-5 w-20 rounded bg-gray-700" />
          <div className="flex gap-8">
            <div className="-mt-32 h-72 w-48 shrink-0 rounded-xl bg-gray-700 shadow-2xl" />
            <div className="flex flex-col justify-end gap-3 flex-1">
              <div className="h-8 w-2/3 rounded bg-gray-700" />
              <div className="h-4 w-1/2 rounded bg-gray-800" />
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-full bg-gray-700" />
                <div className="h-7 w-16 rounded-full bg-gray-700" />
              </div>
              <div className="flex gap-6">
                <div className="h-4 w-20 rounded bg-gray-700" />
                <div className="h-4 w-24 rounded bg-gray-700" />
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            <div className="h-6 w-20 rounded bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-800" />
            <div className="h-4 w-3/4 rounded bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  const director = credits?.crew.find((c) => c.job === 'Director');
  const topCast = credits?.cast.slice(0, 10) ?? [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 배경 이미지 — 상세 데이터 오면 교체 */}
      {movie?.backdrop_path ? (
        <div
          className="h-80 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="h-full w-full bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>
      ) : (
        <div className="h-80 w-full bg-gray-800 animate-pulse" />
      )}

      <div className="mx-auto max-w-5xl px-6 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 mt-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ← 뒤로가기
        </button>

        <div className="flex gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w342${displayPoster}`}
            alt={displayTitle}
            className="-mt-32 h-72 w-48 shrink-0 rounded-xl object-cover shadow-2xl"
          />

          <div className="flex flex-col justify-end">
            <h1 className="text-3xl font-bold">{displayTitle}</h1>
            {movie?.tagline && (
              <p className="mt-1 text-gray-400 italic">"{movie.tagline}"</p>
            )}

            {/* 장르 — 상세 데이터 오면 표시, 그 전엔 skeleton */}
            <div className="mt-3 flex flex-wrap gap-2">
              {movie ? (
                movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))
              ) : (
                <>
                  <div className="h-7 w-16 rounded-full bg-gray-700 animate-pulse" />
                  <div className="h-7 w-16 rounded-full bg-gray-700 animate-pulse" />
                </>
              )}
            </div>

            <div className="mt-4 flex gap-6 text-sm text-gray-400">
              {displayVote !== undefined && (
                <span>
                  ⭐{' '}
                  <span className="text-yellow-400 font-semibold">
                    {displayVote.toFixed(1)}
                  </span>{' '}
                  / 10
                </span>
              )}
              {displayDate && <span>🗓 {displayDate}</span>}
              {movie?.runtime != null && movie.runtime > 0 && (
                <span>⏱ {movie.runtime}분</span>
              )}
              {director && <span>🎬 {director.name}</span>}
            </div>
          </div>
        </div>

        {/* 줄거리 */}
        <div className="mt-8">
          <h2 className="mb-2 text-xl font-semibold">줄거리</h2>
          <p className="leading-relaxed text-gray-300">
            {displayOverview || '줄거리 정보가 없습니다.'}
          </p>
        </div>

        {/* 출연진 — 상세 데이터 오면 표시, 그 전엔 skeleton */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">출연진</h2>
          {topCast.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {topCast.map((actor) => (
                <div key={actor.id} className="flex flex-col items-center text-center">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      className="h-28 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-20 items-center justify-center rounded-lg bg-gray-800 text-3xl">
                      👤
                    </div>
                  )}
                  <p className="mt-2 text-sm font-medium">{actor.name}</p>
                  <p className="text-xs text-gray-400">{actor.character}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 animate-pulse">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-28 w-20 rounded-lg bg-gray-700" />
                  <div className="h-4 w-16 rounded bg-gray-700" />
                  <div className="h-3 w-12 rounded bg-gray-800" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
