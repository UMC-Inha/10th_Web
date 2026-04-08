import { useParams, Link } from 'react-router';
import { useAxios } from '../hooks/useAxios';
import { api } from '../apis/axios';
import type { MovieDetailBundle, MovieCredits, MovieDetails } from '../types/movie';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const posterUrl = (path: string | null, size: 'w342' | 'w500' = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const profileUrl = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w185${path}` : null;

function MovieDetailInner({ movieId }: { movieId: number }) {
  const { data, isLoading, error, fetchData } = useAxios<MovieDetailBundle>(
    async (signal) => {
      const [movieRes, creditsRes] = await Promise.all([
        api.get<MovieDetails>(`/movie/${movieId}`, {
          params: { language: 'ko-KR' },
          signal,
        }),
        api.get<MovieCredits>(`/movie/${movieId}/credits`, {
          params: { language: 'ko-KR' },
          signal,
        }),
      ]);
      return { movie: movieRes.data, credits: creditsRes.data };
    },
    [movieId]
  );

  if (isLoading && !data) return <LoadingSpinner />;
  if (error && !data) return <ErrorAlert message={error} onRetry={fetchData} />;

  if (!data) return null;

  const { movie, credits } = data;
  const directors = credits.crew.filter((c) => c.job === 'Director').slice(0, 5);
  const castTop = credits.cast.slice(0, 12);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/popular" className="text-sm text-red-800 underline">
        ← 목록으로
      </Link>

      {error && data ? (
        <div className="mt-4">
          <ErrorAlert message={error} onRetry={fetchData} />
        </div>
      ) : null}

      {isLoading && data ? (
        <div className="mt-4">
          <LoadingSpinner label="다시 불러오는 중…" />
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-8 md:flex-row">
        <div className="mx-auto w-48 shrink-0 md:mx-0 md:w-56">
          {posterUrl(movie.poster_path) ? (
            <img
              src={posterUrl(movie.poster_path)!}
              alt={movie.title}
              className="w-full rounded-lg border border-gray-200"
            />
          ) : (
            <div className="flex aspect-2/3 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 text-sm text-gray-500">
              포스터 없음
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{movie.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {movie.release_date} · 평점 {movie.vote_average.toFixed(1)} ·{' '}
            {movie.runtime != null ? `${movie.runtime}분` : '상영시간 정보 없음'}
          </p>
          {movie.genres.length > 0 ? (
            <p className="mt-2 text-sm text-gray-600">
              {movie.genres.map((g) => g.name).join(', ')}
            </p>
          ) : null}
          <p className="mt-4 text-gray-700 leading-relaxed">{movie.overview || '줄거리 정보가 없습니다.'}</p>
        </div>
      </div>

      {directors.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">감독</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700">
            {directors.map((d) => (
              <li key={`${d.id}-${d.name}`} className="rounded bg-gray-100 px-2 py-1">
                {d.name}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">주요 출연</h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {castTop.map((person) => (
            <li key={person.id} className="flex gap-3 border border-gray-100 rounded-lg p-2">
              {profileUrl(person.profile_path) ? (
                <img
                  src={profileUrl(person.profile_path)!}
                  alt=""
                  className="h-16 w-12 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                  ?
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{person.name}</p>
                <p className="truncate text-xs text-gray-500">{person.character}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const MovieDetail = () => {
  const { movieId } = useParams();
  const id = movieId ? Number(movieId) : NaN;

  if (!movieId || !Number.isInteger(id) || id < 1) {
    return (
      <div className="px-4 py-8">
        <ErrorAlert message="올바른 영화 주소가 아닙니다." />
        <Link to="/" className="mt-4 inline-block text-sm text-red-800 underline">
          홈으로
        </Link>
      </div>
    );
  }

  return <MovieDetailInner movieId={id} />;
};

export default MovieDetail;
