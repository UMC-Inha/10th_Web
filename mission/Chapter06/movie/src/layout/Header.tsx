import { Link, useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import type { UserToken } from '../types/lp'
import axiosInstance from '../lib/api'

interface Props {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: Props) => {
  const navigate = useNavigate()
  const [token, setToken] = useLocalStorage<UserToken | null>('token', null)

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/v1/auth/signout')
    } catch {
      // 서버 무효화 실패해도 클라이언트 토큰은 제거
    } finally {
      setToken(null)
      navigate('/login')
    }
  }

  return (
    <header className="flex h-14 items-center justify-between bg-neutral-900 px-4 border-b border-neutral-800 shrink-0">
      {/* 좌측 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="text-white"
          aria-label="메뉴"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
          </svg>
        </button>
        <Link to="/" className="text-pink-500 font-bold text-lg">
          돌려돌려LP판
        </Link>
      </div>

      {/* 우측 */}
      <div className="flex items-center gap-3">
        <button type="button" aria-label="검색" className="text-white">
          <SearchIcon />
        </button>

        {token ? (
          <>
            <span className="text-sm text-white">{token.name}님 반갑습니다.</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-white hover:text-pink-400"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-white hover:text-pink-400">
              로그인
            </Link>
            <Link
              to="/signup"
              className="rounded bg-pink-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-pink-400"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export default Header
