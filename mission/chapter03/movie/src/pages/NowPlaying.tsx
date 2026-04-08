import MovieList from '../containers/MovieList';

const NowPlaying = () => <MovieList endpoint="/movie/now_playing" title="상영 중" />;

export default NowPlaying;
