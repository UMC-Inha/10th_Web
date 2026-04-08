import { NavLink } from 'react-router';

const Header = () => {
  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-red-700 border-b-2 border-red-700'
      : 'text-red-900 hover:text-red-400 transition';

  return (
    <nav className="flex justify-center items-center gap-4 p-4 bg-red-100">
      <NavLink to="/" className={linkStyle}>
        홈
      </NavLink>
      <NavLink to="/popular" className={linkStyle}>
        인기 영화
      </NavLink>
      <NavLink to="/now-playing" className={linkStyle}>
        상영 중
      </NavLink>
      <NavLink to="/top-rated" className={linkStyle}>
        평점 높은 순
      </NavLink>
      <NavLink to="/upcoming" className={linkStyle}>
        개봉 예정
      </NavLink>
    </nav>
  );
};

export default Header;
