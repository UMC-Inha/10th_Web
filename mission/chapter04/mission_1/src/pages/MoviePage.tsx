import { useEffect, useState } from 'react';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { getPopularMovies } from '../api/apis';
import usePending from '../hooks/usePending';
import useError from '../hooks/useError';

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isPending, setIsPending] = usePending();
  const [isError, setIsError] = useError();

  //동적을 위한 처리
  const { category } = useParams<{
    category: string;
  }>();

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    if (!category) return;

    const fetchMovies = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const data = await getPopularMovies(category, page);
        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, category]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    //이전 페이지와 다음 페이지로 가는 버튼 + 로딩 시 로딩스피너 나오도록 하고 아니면 무비카드 나오도록 리턴
    <>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[aliceblue] text-navy px-6 py-3 rounded-lg shadow-md
        hover:bg-[skyblue] transition-all duration-200 disabled:bg-gray-300
        cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >{`<`}</button>
        <span>{page} 페이지</span>
        <button
          className="bg-[aliceblue] text-navy px-6 py-3 rounded-lg shadow-md
        hover:bg-[skyblue] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >{`>`}</button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
