import { useEffect, useState } from 'react';
import { MovieItem } from './components/MovieItem';
import type { IMovie } from './models/movie.model';
import { getPopularMovies } from './api/movieApi';

function App() {
  const [movieData, setMovieData] = useState<IMovie[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);

  const initMovieData = async () => {
    try {
      setIsPending(true);
      const data = await getPopularMovies();
      setMovieData(data.results);
    } catch (err) {
      console.error("데이터 로드 중 에러 발생:", err);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    initMovieData();
  }, []);

  if (isPending) return <div className="min-h-screen bg-black flex items-center justify-center text-white">영화 데이터를 가져오는 중입니다...</div>;

  return (
    <div className="bg-black min-h-screen p-10">
      <header className="mb-12 border-b border-zinc-800 pb-5">
        <h1 className="text-2xl font-black text-white uppercase tracking-widest">Inha Popular</h1>
      </header>
      
      <main className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movieData.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </main>
    </div>
  );
}

export default App;