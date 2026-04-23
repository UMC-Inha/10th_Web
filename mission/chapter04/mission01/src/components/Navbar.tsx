import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-red-500 font-bold border-b-2 border-red-500 pb-0.5'
      : 'text-zinc-400 hover:text-white transition-colors';

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/60 sticky top-0 z-50">
      <NavLink to="/" className="text-xl font-black text-white tracking-tight">
        INHA <span className="text-red-600">MOVIE</span>
      </NavLink>
      <div className="flex gap-8 text-sm font-medium">
        <NavLink to="/popular" className={activeStyle}>인기 영화</NavLink>
        <NavLink to="/now-playing" className={activeStyle}>현재 상영중</NavLink>
        <NavLink to="/top-rated" className={activeStyle}>평점 높은</NavLink>
        <NavLink to="/upcoming" className={activeStyle}>개봉 예정</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;