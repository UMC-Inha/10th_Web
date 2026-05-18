import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import useLocalStorage from '../hooks/useLocalStorage'
import type { UserToken } from '../types/lp'

interface Props {
  isOpen: boolean
}

const Sidebar = ({ isOpen }: Props) => {
  const navigate = useNavigate()
  const [, setToken] = useLocalStorage<UserToken | null>('token', null)
  const [showConfirm, setShowConfirm] = useState(false)

  const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: () => api.delete('/v1/users'),
    onSuccess: () => {
      setToken(null)
      navigate('/login')
    },
  })

  return (
    <>
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
            onClick={() => setShowConfirm(true)}
            className="w-full rounded px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-800 hover:text-red-400 text-left"
          >
            탈퇴하기
          </button>
        </div>
      </aside>

      {/* 탈퇴 확인 모달 */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-72 rounded-2xl bg-neutral-800 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-base font-semibold text-white">정말 탈퇴하시겠어요?</p>
            <p className="mb-6 text-sm text-neutral-400">탈퇴 후 모든 데이터가 삭제됩니다.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-neutral-600 py-2.5 text-sm text-neutral-300 hover:border-white hover:text-white"
              >
                아니오
              </button>
              <button
                type="button"
                onClick={() => deleteAccount()}
                disabled={isPending}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40"
              >
                {isPending ? '탈퇴 중...' : '예'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
