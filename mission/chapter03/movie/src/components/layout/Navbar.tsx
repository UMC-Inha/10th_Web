import NavItem from "./NavItem";

//홈, 인기 영화, 개봉 예정, 평점 높은, 상영 중
const navItems = [
  { url: "/", label: "홈" },
  { url: "/movies/popular", label: "인기 영화" },
  { url: "/movies/upcoming", label: "개봉 예정" },
  { url: "/movies/top_rated", label: "평점 높은" },
  { url: "/movies/now_playing", label: "상영 중" },
];

// 네비게이션 바 컴포넌트
const Navbar = () => {
  return (
    <nav className="flex gap-6 px-8 py-4 bg-gray-900 shadow-md">
      {navItems.map((item) => (
        // 네비게이션 아이템
        <NavItem url={item.url} key={item.url}>
          {item.label}
        </NavItem>
      ))}
    </nav>
  );
};

export default Navbar;
