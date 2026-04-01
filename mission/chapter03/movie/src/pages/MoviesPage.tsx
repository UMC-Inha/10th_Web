import { useState } from "react";
import useMovieList from "../hooks/useMovieList";
import MovieCard from "../components/movie/MovieCard";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorView from "../components/common/ErrorView";
import Pagination from "../components/common/Pagination";

interface MoviesPageInnerProps {
  categoryId: string;
}

// 실제 영화 목록 UI — categoryId가 key로 전달되므로 카테고리 변경 시 remount되어 page가 초기화됨
const MoviesPageInner = ({ categoryId }: MoviesPageInnerProps) => {
  const [page, setPage] = useState<number>(1);
  const { movies, loading, error, totalPages } = useMovieList(categoryId, page);

  return (
    <>
      {/* 페이지네이션 */}
      {!loading && !error && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
      {/* 영화 목록 */}
      <main className="p-6 flex justify-center items-center min-h-screen">
        {error ? (
          // 에러 화면
          <ErrorView message={error} />
        ) : loading ? (
          // 로딩 스피너
          <LoadingSpinner />
        ) : (
          // 영화 카드 목록
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} categoryId={categoryId} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

// 영화 목록 페이지 - 카테고리별 영화 목록을 보여준다
const MoviesPage = () => {
  const { categoryId } = useParams();
  if (!categoryId) return <ErrorView message="Invalid category" />;
  return <MoviesPageInner key={categoryId} categoryId={categoryId} />;
};

export default MoviesPage;
