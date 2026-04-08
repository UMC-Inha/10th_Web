import MovieRow from "../components/movie/MovieRow";

const CATEGORIES = [
  { id: "popular", label: "인기 영화" },
  { id: "top_rated", label: "평점 높은 영화" },
  { id: "now_playing", label: "현재 상영 중" },
  { id: "upcoming", label: "개봉 예정" },
];

// 홈 페이지 컴포넌트
const HomePage = () => {
  return (
    <main className="min-h-screen bg-gray-900 px-16 py-10 flex flex-col gap-10">
      {/* 영화 카테고리 */}
      {CATEGORIES.map((cat) => (
        <MovieRow key={cat.id} categoryId={cat.id} label={cat.label} />
      ))}
    </main>
  );
};

export default HomePage;
