import { useEffect } from 'react';
import { type Movie } from '../types/movie';
import { getPosterUrl } from '../api/tmdb';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  const posterUrl = getPosterUrl(movie.poster_path, 'w500');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.original_title || movie.title)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        <div className="modal-content">
          <div className="modal-poster-wrap">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className="modal-poster" />
            ) : (
              <div className="modal-poster-placeholder">
                <span>이미지 없음</span>
              </div>
            )}
          </div>

          <div className="modal-details">
            <h2 className="modal-title">{movie.title}</h2>
            {movie.original_title !== movie.title && (
              <p className="modal-original-title">{movie.original_title}</p>
            )}

            <div className="modal-meta">
              <div className="meta-item">
                <span className="meta-label">평점</span>
                <span className="meta-value rating">
                  ★ {movie.vote_average.toFixed(1)}
                  <span className="vote-count">({movie.vote_count.toLocaleString()}명)</span>
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">개봉일</span>
                <span className="meta-value">{movie.release_date || '-'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">언어</span>
                <span className="meta-value">{movie.original_language.toUpperCase()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">인기도</span>
                <span className="meta-value">{movie.popularity.toFixed(1)}</span>
              </div>
              {movie.adult && (
                <div className="meta-item">
                  <span className="adult-badge">성인</span>
                </div>
              )}
            </div>

            <div className="modal-overview">
              <h3 className="overview-label">줄거리</h3>
              <p className="overview-text">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>

            <div className="modal-actions">
              <a
                href={imdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="imdb-btn"
              >
                IMDb에서 검색하기
              </a>
              <button className="close-btn" onClick={onClose}>
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
