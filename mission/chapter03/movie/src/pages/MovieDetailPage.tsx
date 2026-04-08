import { useParams } from "react-router-dom";
import useMovieDetail from "../hooks/useMovieDetail";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorView from "../components/common/ErrorView";
import MovieInfo from "../components/movie/MovieInfo";
import MovieCreditList from "../components/movie/MovieCreditList";

// 영화 상세 페이지 컴포넌트
const MovieDetailPage = () => {
  const { movieId } = useParams();
  const { movieDetail, movieCredit, loading, error } = useMovieDetail(movieId);

  return (
    <main className="min-h-screen bg-gray-900">
      {/* 로딩 중일 때 */}
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      ) : error ? (
        // 에러 발생 시
        <div className="flex justify-center items-center min-h-screen">
          <ErrorView message={error} />
        </div>
      ) : movieDetail && movieCredit ? (
        <>
          {/* 영화 정보 */}
          <MovieInfo movieDetail={movieDetail} />
          {/* 영화 크레딧 정보 */}
          <MovieCreditList movieCredit={movieCredit} />
        </>
      ) : null}
    </main>
  );
};

export default MovieDetailPage;
