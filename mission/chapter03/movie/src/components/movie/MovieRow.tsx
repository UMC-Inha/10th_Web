import useMovieList from "../../hooks/useMovieList";
import MovieCard from "./MovieCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorView from "../common/ErrorView";

interface MovieRowProps {
  categoryId: string;
  label: string;
}

// 영화 목록을 보여주는 컴포넌트
const MovieRow = ({ categoryId, label }: MovieRowProps) => {
  const { movies, loading, error } = useMovieList(categoryId);

  return (
    <section>
      {/* 영화 목록 제목 */}
      <h2 className="text-white text-xl font-semibold mb-4">{label}</h2>
      {/* 영화 목록 */}
      {loading ? (
        // 로딩 스피너
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        // 에러 화면
        <ErrorView message={error} />
      ) : (
        // 영화 목록
        <div className="flex gap-4 overflow-x-auto pb-2">
          {movies.map((movie) => (
            <div key={movie.id} className="shrink-0 w-36">
              <MovieCard movie={movie} categoryId={categoryId} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieRow;
