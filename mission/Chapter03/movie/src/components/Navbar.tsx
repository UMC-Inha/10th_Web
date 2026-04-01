import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '홈' },
  { to: '/popular', label: '인기 영화' },
  { to: '/upcoming', label: '개봉 예정' },
  { to: '/top-rated', label: '평점 높은' },
  { to: '/now-playing', label: '상영 중' },
]

const Navbar = () => {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            [
              'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
            ].join(' ')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navbar
