import { useState, useCallback, useMemo } from 'react';
import SearchForm from './components/SearchForm';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import { searchMovies } from './api/tmdb';
import { type Movie } from './types/movie';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState('ko-KR');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovies = useCallback(
    async (targetPage: number, q: string, adult: boolean, lang: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(q, adult, lang, targetPage);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
        setSearched(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;
      setPage(1);
      fetchMovies(1, query, includeAdult, language);
    },
    [query, includeAdult, language, fetchMovies]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchMovies(newPage, query, includeAdult, language);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [query, includeAdult, language, fetchMovies]
  );

  const handleCardClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // 검색 결과 없음 여부를 메모이제이션
  const isEmpty = useMemo(
    () => searched && !loading && movies.length === 0,
    [searched, loading, movies.length]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🎬 영화 검색</h1>
        <p className="app-subtitle">TMDB로 전 세계 영화를 검색해보세요</p>
      </header>

      <main className="app-main">
        <SearchForm
          query={query}
          onQueryChange={setQuery}
          includeAdult={includeAdult}
          onIncludeAdultChange={setIncludeAdult}
          language={language}
          onLanguageChange={setLanguage}
          onSubmit={handleSearch}
          loading={loading}
        />

        {error && (
          <div className="error-msg">
            ⚠️ 오류: {error}
          </div>
        )}

        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>검색 중...</p>
          </div>
        )}

        {!loading && searched && (
          <p className="result-count">
            총 <strong>{totalResults.toLocaleString()}</strong>개의 검색 결과
          </p>
        )}

        {isEmpty && (
          <div className="empty-msg">
            <p>검색 결과가 없습니다.</p>
            <p className="empty-sub">다른 키워드로 검색해보세요.</p>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={handleCardClick} />
              ))}
            </div>

            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                이전
              </button>
              <span className="page-info">
                {page} / {totalPages}
              </span>
              <button
                className="page-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                다음
              </button>
            </div>
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
