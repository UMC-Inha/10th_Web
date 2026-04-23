import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { getMovieDetails, getMovieCredits } from '../api/movieApi';
import type { IMovie, ICreditResponse } from '../models/movie.model';
import { useCustomFetch } from '../hooks/useCustomFetch';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const detailFetch = useCallback(() => getMovieDetails(movieId!), [movieId]);
  const creditFetch = useCallback(() => getMovieCredits(movieId!), [movieId]);

  const { data: detail, isLoading: detailLoading, error: detailError } = useCustomFetch<IMovie>(detailFetch);
  const { data: credits, isLoading: creditsLoading, error: creditsError } = useCustomFetch<ICreditResponse>(creditFetch);

  if (detailLoading || creditsLoading) return <LoadingSpinner />;
  if (detailError) return <ErrorMessage message={detailError} />;
  if (creditsError) return <ErrorMessage message={creditsError} />;
  if (!detail || !credits) return null;

  return (
    <div className="min-h-screen text-white">
      {/* 배경 블러 이미지 */}
      {detail.backdrop_path && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${detail.backdrop_path})` }}
        />
      )}

      {/* 상단 영화 정보 */}
      <div className="flex flex-col md:flex-row gap-10 mb-16">
        <div className="shrink-0">
          {detail.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
              className="w-56 md:w-72 rounded-2xl shadow-2xl shadow-black/60"
              alt={detail.title}
            />
          ) : (
            <div className="w-56 md:w-72 aspect-[2/3] bg-zinc-800 rounded-2xl flex items-center justify-center">
              <span className="text-zinc-500 text-sm">이미지 없음</span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-4xl md:text-5xl font-black leading-tight">{detail.title}</h1>

          {detail.tagline && (
            <p className="text-zinc-400 italic text-lg">"{detail.tagline}"</p>
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full font-bold">
              ★ {detail.vote_average.toFixed(1)}
            </span>
            {detail.release_date && (
              <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full">
                {detail.release_date.slice(0, 4)}년
              </span>
            )}
            {detail.runtime && (
              <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full">
                {detail.runtime}분
              </span>
            )}
          </div>

          {detail.genres && detail.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {detail.genres.map((g) => (
                <span key={g.id} className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-zinc-300 leading-relaxed max-w-2xl text-sm md:text-base">
            {detail.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>
      </div>

      {/* 출연진 */}
      {credits.cast.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-600 rounded inline-block" />
            감독/출연
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4">
            {credits.cast.slice(0, 20).map((person) => (
              <div key={person.id} className="text-center group">
                <div className="relative w-full aspect-square mb-2 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-zinc-700 group-hover:ring-red-600 transition-all">
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                      className="w-full h-full object-cover"
                      alt={person.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-zinc-600">
                      👤
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold truncate">{person.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;