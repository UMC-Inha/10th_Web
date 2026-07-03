import { useState, useCallback } from 'react';
import { searchMovies } from '../api/movieApi';
import type { IMovie } from '../models/movie.model';
import { MovieItem } from '../components/MovieItem';
import MovieModal from '../components/MovieModal';

const SearchPage = () => {
  // 입력 필터 상태 관리
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('ko-KR');
  const [includeAdult, setIncludeAdult] = useState(false);

  // 데이터 응답 관련 상태
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달 제어 상태
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);

  // 실제 API 호출 비동기 로직
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await searchMovies(query, language, includeAdult, 1);
      setMovies(data.results);
      if (data.results.length === 0) {
        setError("검색 결과와 일치하는 영화가 없습니다. 😢");
      }
    } catch (err) {
      setError("영화 검색 중 예기치 못한 에러가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 💡 성능 최적화: 자식 컴포넌트(MovieItem)로 전달되는 모달 제어 함수 주소를 동결!
  // 인풋창에 글자를 마구 쳐서 SearchPage가 리렌더링되어도, 이 함수의 주소는 유지되어 하단 카드의 억울한 재렌더링을 막습니다.
  const handleOpenModal = useCallback((movie: IMovie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className="pb-20 text-white min-h-[80vh] px-2">
      <h1 className="text-2xl font-black mb-6 text-white">영화 통합 검색</h1>

      {/* 1. 요구사항: form 태그 랩핑 (엔터 제출 자동 활성화) */}
      <form onSubmit={handleSearchSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          
          {/* 영화 제목 인풋 구역 */}
          <div className="flex-1 w-full flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">영화 제목</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="영화 제목을 입력하세요..."
              className="w-full bg-zinc-950 border border-zinc-700 px-4 py-2.5 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-zinc-600"
            />
          </div>

          {/* 언어 선택 셀렉트 박스 구역 */}
          <div className="w-full md:w-48 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">🌐 언어 선택</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
            >
              <option value="ko-KR">한국어 (ko-KR)</option>
              <option value="en-US">영어 (en-US)</option>
              <option value="ja-JP">일본어 (ja-JP)</option>
            </select>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full md:w-32 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 px-4 rounded-lg transition-colors shadow-lg"
          >
            검색하기
          </button>
        </div>

        {/* 성인 콘텐츠 체크박스 라인 */}
        <div className="flex items-center gap-2 mt-1 self-start">
          <input
            type="checkbox"
            id="adultContent"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
            className="w-4 h-4 rounded accent-red-600 bg-zinc-950 border-zinc-700 cursor-pointer"
          />
          <label htmlFor="adultContent" className="text-xs font-medium text-zinc-300 cursor-pointer select-none">
            🔞 성인 콘텐츠 포함 표시하기
          </label>
        </div>
      </form>

      {/* 로딩 인디케이터 구역 */}
      {isLoading && (
        <div className="flex justify-center my-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* 에러 및 빈 검색어 구역 피드백 */}
      {error && <div className="text-center my-14 text-zinc-400 font-medium text-sm">{error}</div>}

      {/* 2. 영화 카드 리스트 그리드 레이아웃 */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 animate-fade-in">
          {movies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} onOpenModal={handleOpenModal} />
          ))}
        </div>
      )}

      {/* 상세 팝업용 렌더링 모달 */}
      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
    </div>
  );
};

export default SearchPage;