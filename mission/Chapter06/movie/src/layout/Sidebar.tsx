import { Link } from 'react-router-dom'

interface Props {
  isOpen: boolean
}

const Sidebar = ({ isOpen }: Props) => {
  return (
    // 데스크톱(lg+): relative로 레이아웃에 포함, 항상 표시
    // 모바일: absolute 드로어, isOpen에 따라 슬라이드
    <aside
      className={`
        flex flex-col justify-between bg-neutral-900 border-r border-neutral-800 shrink-0 w-36
        absolute lg:relative h-full z-20 lg:z-auto
        transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <nav className="flex flex-col gap-1 p-3 pt-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <SearchIcon />
          찾기
        </Link>
        <Link
          to="/my"
          className="flex items-center gap-2 rounded px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <PersonIcon />
          마이페이지
        </Link>
      </nav>

      <div className="p-3">
        <button
          type="button"
          className="w-full rounded px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-800 hover:text-red-400 text-left"
        >
          탈퇴하기
        </button>
      </div>
    </aside>
  )
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default Sidebar
