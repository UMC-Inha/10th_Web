import { memo } from 'react';
import { type Movie } from '../types/movie';
import { getPosterUrl } from '../api/tmdb';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = memo(function MovieCard({ movie, onClick }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="card-poster">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="poster-img" />
        ) : (
          <div className="poster-placeholder">
            <span>이미지 없음</span>
          </div>
        )}
        <div className="card-overlay">
          <p className="overlay-overview">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <div className="card-meta">
          <span className="card-rating">★ {movie.vote_average.toFixed(1)}</span>
          <span className="card-year">{movie.release_date?.slice(0, 4) || '-'}</span>
        </div>
      </div>
    </div>
  );
});

export default MovieCard;
