import { useEffect, useState } from 'react';
import { getMovies } from '../api/movieApi';
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
        const data = await getMovies('popular', currentPage);
        setMovies(data.results);
      } catch (err) {
        setError("영화 데이터를 가져오는 중 오류가 발생했습니다. 토큰을 확인하세요!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [currentPage]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center mt-20 text-red-500">
      <p className="text-xl font-bold">{error}</p>
    </div>
  );

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-black mb-8 text-white">인기 영화</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {movies.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-6 mt-16">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-6 py-2 bg-zinc-800 text-white rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
        >
          이전
        </button>
        
        <span className="text-lg font-bold text-white">{currentPage} 페이지</span>
        
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-6 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default PopularPage;