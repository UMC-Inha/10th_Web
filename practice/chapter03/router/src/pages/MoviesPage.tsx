import { useParams } from 'react-router';

const MoviesPage = () => {
  const params = useParams();

  return <h1>{params.movieId}번의 Movies Page 야호~!</h1>;
};

export default MoviesPage;
