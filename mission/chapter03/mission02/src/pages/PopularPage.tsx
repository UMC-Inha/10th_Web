import { useEffect, useState } from 'react';
import { getPopularMovies } from '../api/movieApi';
import type { IMovie } from '../models/movie.model';
import { MovieItem } from '../components/MovieItem';

const PopularPage = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPopularMovies(currentPage); 
        setMovies(data.results);
      } catch (err) {
        setError("영화 데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [currentPage]);

  if (isLoading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">인기 영화 목록</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map(movie => <MovieItem key={movie.id} movie={movie} />)}
      </div>

      <div className="flex justify-center items-center gap-6 mt-12 pb-10">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-zinc-800 rounded disabled:opacity-30"
        >
          이전
        </button>
        <span className="font-bold text-lg">{currentPage} 페이지</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default PopularPage;