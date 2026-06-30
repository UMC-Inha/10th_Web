import { useState, useCallback, useMemo, useRef } from 'react';
import SearchForm from './components/SearchForm';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import { searchMovies } from './api/tmdb';
import { type Movie } from './types/movie';
import './App.css';

interface SearchState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  searched: boolean;
  totalPages: number;
  totalResults: number;
}

const initialSearchState: SearchState = {
  movies: [],
  loading: false,
  error: null,
  searched: false,
  totalPages: 0,
  totalResults: 0,
};

function App() {
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState('ko-KR');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [searchState, setSearchState] = useState<SearchState>(initialSearchState);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMovies = useCallback(
    async (targetPage: number, q: string, adult: boolean, lang: string) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setSearchState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const data = await searchMovies(q, adult, lang, targetPage, controller.signal);
        setSearchState({
          movies: data.results,
          loading: false,
          error: null,
          searched: true,
          totalPages: data.total_pages,
          totalResults: data.total_results,
        });
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setSearchState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : '오류가 발생했습니다.',
        }));
      }
    },
    []
  );

  const handleSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      setSearchedQuery(q);
      setPage(1);
      fetchMovies(1, q, includeAdult, language);
    },
    [includeAdult, language, fetchMovies]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchMovies(newPage, searchedQuery, includeAdult, language);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchedQuery, includeAdult, language, fetchMovies]
  );

  const handleCardClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const isEmpty = useMemo(
    () => searchState.searched && !searchState.loading && searchState.movies.length === 0,
    [searchState.searched, searchState.loading, searchState.movies.length]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🎬 영화 검색</h1>
        <p className="app-subtitle">TMDB로 전 세계 영화를 검색해보세요</p>
      </header>

      <main className="app-main">
        <SearchForm
          includeAdult={includeAdult}
          onIncludeAdultChange={setIncludeAdult}
          language={language}
          onLanguageChange={setLanguage}
          onSubmit={handleSearch}
          loading={searchState.loading}
        />

        {searchState.error && (
          <div className="error-msg">
            ⚠️ 오류: {searchState.error}
          </div>
        )}

        {searchState.loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>검색 중...</p>
          </div>
        )}

        {!searchState.loading && searchState.searched && (
          <p className="result-count">
            총 <strong>{searchState.totalResults.toLocaleString()}</strong>개의 검색 결과
          </p>
        )}

        {isEmpty && (
          <div className="empty-msg">
            <p>검색 결과가 없습니다.</p>
            <p className="empty-sub">다른 키워드로 검색해보세요.</p>
          </div>
        )}

        {!searchState.loading && searchState.movies.length > 0 && (
          <>
            <div className="movie-grid">
              {searchState.movies.map((movie) => (
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
                {page} / {searchState.totalPages}
              </span>
              <button
                className="page-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= searchState.totalPages}
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
