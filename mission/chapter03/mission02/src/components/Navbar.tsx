import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = ({ isActive }: { isActive: boolean }) => 
    isActive ? "text-red-600 font-bold" : "text-white hover:text-gray-400";

  return (
    <nav className="flex justify-between items-center p-5 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <NavLink to="/" className="text-2xl font-black text-red-600">INHA MOVIE</NavLink>
      <div className="flex gap-6 text-sm font-medium">
        <NavLink to="/popular" className={activeStyle}>인기 영화</NavLink>
        <NavLink to="/now-playing" className={activeStyle}>현재 상영중</NavLink>
        <NavLink to="/top-rated" className={activeStyle}>평점 높은</NavLink>
        <NavLink to="/upcoming" className={activeStyle}>개봉 예정</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;