import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type {
  CastMember,
  CrewMember,
  MovieCreditsResponse,
  MovieDetails,
} from '../types/movie'

const TMDB_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmQ2NDAxMTg5NTdjZTc1OWYyNGY2MjM4MWEwYjMwOSIsIm5iZiI6MTc3NTAyMTYwNC40ODUsInN1YiI6IjY5Y2NhZTI0YWU0M2I4MGIzMTU1MGRjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TWWBx2Ne_2oV9t72nXONrf08hd7VFD2FOuUNKBG6cgc'

const MovieDetailPage = () => {
  // URL의 movieId를 가져와 상세/크레딧 API 요청에 사용
  const { movieId } = useParams()

  // 영화 상세 정보 상태
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  // 출연진과 제작진을 각각 분리해서 저장
  const [cast, setCast] = useState<CastMember[]>([])
  const [crew, setCrew] = useState<CrewMember[]>([])
  // 상세 페이지 로딩 상태
  const [isLoading, setIsLoading] = useState(true)
  // 상세 페이지 에러 상태
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchDetail = async () => {
      if (!movieId) {
        setErrorMessage('잘못된 경로입니다. 영화 ID가 없습니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        // 상세 정보와 크레딧 정보를 동시에 요청
        const [detailResponse, creditsResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
            headers: {
              Authorization: `Bearer ${TMDB_TOKEN}`,
            },
          }),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
            headers: {
              Authorization: `Bearer ${TMDB_TOKEN}`,
            },
          }),
        ])

        if (!detailResponse.ok) {
          throw new Error(`상세 정보 요청 실패: ${detailResponse.status}`)
        }

        if (!creditsResponse.ok) {
          throw new Error(`크레딧 요청 실패: ${creditsResponse.status}`)
        }

        const detailData: MovieDetails = await detailResponse.json()
        const creditsData: MovieCreditsResponse = await creditsResponse.json()

        console.log('movie detail:', detailData)
        console.log('movie credits:', creditsData)

        setMovie(detailData)
        setCast(creditsData.cast)
        setCrew(creditsData.crew)
        setErrorMessage('')
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('알 수 없는 오류가 발생했습니다.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
    // movieId가 변경되면 다른 영화 상세 정보를 다시 불러옴
  }, [movieId])

  const directors = useMemo(
    // 제작진 중 감독만 추려서 상단에 함께 보여줌
    () => crew.filter((member) => member.job === 'Director').slice(0, 3),
    [crew],
  )

  const featuredPeople = useMemo(() => {
    // 감독과 출연진을 같은 그리드 UI에서 보여주기 위해 하나의 리스트 합침
    const directorItems = directors.map((director) => ({
      key: `director-${director.id}`,
      name: director.name,
      role: director.job,
      profilePath: null,
    }))

    const castItems = cast.slice(0, 18).map((actor) => ({
      key: `cast-${actor.id}`,
      name: actor.name,
      role: actor.character || '배역 정보 없음',
      profilePath: actor.profile_path,
    }))

    return [...directorItems, ...castItems]
  }, [cast, directors])

  if (isLoading) {
    return (
      // 데이터가 준비되기 전 - 로딩 스피너
      <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-black/80 p-4 shadow-sm">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-slate-100" />
        <p className="text-slate-200">영화 상세 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (errorMessage || !movie) {
    return (
      // API 실패 또는 잘못된 ID일 때 - 안내 화면
      <section className="rounded-xl border border-red-400/40 bg-red-950/60 p-5">
        <p className="text-red-200">{errorMessage || '영화 정보를 찾을 수 없습니다.'}</p>
        <Link
          to="/popular"
          className="mt-3 inline-block rounded-md border border-slate-400/60 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        >
          인기 영화로 돌아가기
        </Link>
      </section>
    )
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image'

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null

  // 개봉일에서 연도만 추출
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : '-'

  return (
    <section className="space-y-5 text-slate-100">
      <Link
        to="/popular"
        className="inline-block rounded-md border border-white/25 bg-black/50 px-3 py-2 text-sm text-slate-100"
      >
        ← 목록으로
      </Link>

      <article className="overflow-hidden rounded-2xl">
        <div className="relative min-h-75">
          {backdropUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            />
          )}

          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/30" />

          <div className="relative grid gap-4 p-5 sm:grid-cols-[220px_1fr] sm:p-6">
            <img
              src={posterUrl}
              alt={movie.title}
              className="hidden aspect-2/3 w-full max-w-55 rounded-xl object-cover sm:block"
            />

            <div className="max-w-xl">
              <h2 className="text-2xl font-bold">{movie.title}</h2>
              <p className="mt-2 text-xl font-semibold text-slate-200">평균 {movie.vote_average.toFixed(1)}</p>
              <p className="text-xl font-semibold text-slate-200">{releaseYear}</p>
              <p className="text-xl font-semibold text-slate-200">{movie.runtime ? `${movie.runtime}분` : '-'}</p>
              <p className="mt-4 text-3xl font-black italic">{movie.overview ? movie.overview.slice(0, 20) + '!' : '영화 소개!'}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-200">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
              <p className="mt-3 text-sm text-slate-300">
                {movie.genres.length > 0 ? movie.genres.map((genre) => genre.name).join(' · ') : '장르 정보 없음'}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* 감독과 출연진을 원형 카드 그리드로 보여주는 섹션 */}
      <section className="rounded-2xl p-5">
        <h3 className="mb-5 text-4xl font-bold">감독/출연</h3>

        {featuredPeople.length === 0 ? (
          <p className="text-sm text-slate-300">출연진/제작진 정보가 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
            {featuredPeople.map((person) => {
              const profileUrl = person.profilePath
                ? `https://image.tmdb.org/t/p/w185${person.profilePath}`
                : null

              return (
                <li key={person.key} className="text-center">
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-white/50 bg-slate-800">
                    {profileUrl ? (
                      <img
                        src={profileUrl}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-300">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-base font-semibold leading-tight">{person.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{person.role}</p>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* <div className="rounded-xl p-4 text-sm text-slate-300">
        <p>감독 {directors.length}명 · 출연진 {cast.length}명</p>
      </div> */}
    </section>
  )
}

export default MovieDetailPage
