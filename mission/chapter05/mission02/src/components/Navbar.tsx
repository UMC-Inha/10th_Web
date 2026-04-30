import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { label: '홈', path: '/' },
  { label: '인기 영화', path: '/popular' },
  { label: '개봉 예정', path: '/upcoming' },
  { label: '평점 높은', path: '/top-rated' },
  { label: '상영 중', path: '/now-playing' },
];

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4">
      <div className="flex gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive
                ? 'font-bold text-white'
                : 'text-gray-400 hover:text-white transition-colors'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
      >
        로그아웃
      </button>
    </nav>
  );
};

export default Navbar;
