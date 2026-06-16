import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMovieDetails, getMovieCredits } from '../api/movieApi';
import type { ICreditResponse, IMovie } from '../models/movie.model';

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [detail, setDetail] = useState<IMovie|null>(null);
  const [credits, setCredits] = useState<ICreditResponse|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [detailData, creditData] = await Promise.all([
          getMovieDetails(movieId!),
          getMovieCredits(movieId!)
        ]);
        setDetail(detailData);
        setCredits(creditData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [movieId]);

  if (loading) return <div className="text-white p-10">영화 정보를 불러오는 중...</div>;
  if (!detail) return null;
  if (!credits) return null;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex flex-col md:flex-row gap-10">
        <img 
          src={`https://image.tmdb.org/t/p/w500${detail.poster_path}`} 
          className="w-full md:w-80 rounded-xl shadow-2xl"
          alt={detail.title}
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-black mb-4">{detail.title}</h1>
          <p className="text-yellow-500 text-xl font-bold mb-4">평점: ★ {detail.vote_average.toFixed(1)}</p>
          <p className="text-gray-300 leading-relaxed max-w-2xl">{detail.overview}</p>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-8">감독 및 출연진</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {credits.cast.slice(0, 10).map((person) => (
            <div key={person.id} className="text-center">
              <img 
                src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '/default-profile.png'} 
                className="w-full aspect-square object-cover rounded-full mb-2"
              />
              <p className="text-xs font-bold truncate">{person.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{person.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;