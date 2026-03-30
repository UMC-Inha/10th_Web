// src/pages/movies.tsx
import { useParams } from 'react-router-dom';

const MoviesPage = () => {
  const params = useParams(); // 동적 경로에서 넘겨받은 값 읽기 위해 useParams 사용

  console.log(params);

  return <h1>{params.movieId}번의 Movies Page 야호~!</h1>;
};

export default MoviesPage;
