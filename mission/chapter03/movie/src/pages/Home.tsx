import { Link } from 'react-router';

const shortcuts = [
  {
    to: '/popular',
    title: '인기 영화',
    desc: '지금 많이 찾는 작품을 모았어요',
  },
  {
    to: '/now-playing',
    title: '상영 중',
    desc: '극장에서 볼 수 있는 영화',
  },
  {
    to: '/top-rated',
    title: '평점 높은 순',
    desc: '평가가 좋은 작품만 골랐어요',
  },
  {
    to: '/upcoming',
    title: '개봉 예정',
    desc: '곧 만날 수 있는 신작',
  },
] as const;

const Home = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-stone-50">
      <div className="border-b border-red-100 bg-red-50">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
          <p className="text-sm font-medium text-red-800">Movie DB</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            오늘은 어떤 영화를 볼까요?
          </h1>
          <p className="mt-4 max-w-xl text-base text-gray-600 leading-relaxed">
            TMDB 데이터로 인기·상영·평점·개봉 예정 목록을 한곳에서 볼 수 있어요. <br /> 아래에서
            바로 이동하거나 상단 메뉴를 이용해도 됩니다.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-12">
        <h2 className="text-lg font-semibold text-gray-900">목록 바로가기</h2>
        <p className="mt-1 text-sm text-gray-500">원하는 카테고리를 눌러 목록으로 이동해요.</p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {shortcuts.map(({ to, title, desc }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-6 outline-none ring-red-200 focus-visible:ring-2"
              >
                <span className="text-base font-semibold text-gray-900">{title}</span>
                <span className="mt-2 text-sm text-gray-500 leading-snug">{desc}</span>
                <span className="mt-4 text-sm font-medium text-red-800">목록 보기 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Home;
