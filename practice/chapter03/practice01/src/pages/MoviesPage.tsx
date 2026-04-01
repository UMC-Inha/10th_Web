import { useParams } from "react-router-dom";

const MoviesPage = () => {
  // useParams를 사용하여 URL 매개변수 가져오기
  const params = useParams(); // { movieId?: string }

  console.log(params);

  return (
    <main style={{ padding: 24 }}>
      <h1>영화 페이지</h1>
      <p>{params.movieId} 영화 페이지입니다.</p>
    </main>
  );
};

export default MoviesPage;
