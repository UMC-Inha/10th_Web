import MovieList from '../containers/MovieList';

const TopRated = () => <MovieList endpoint="/movie/top_rated" title="평점 높은 순" />;

export default TopRated;
