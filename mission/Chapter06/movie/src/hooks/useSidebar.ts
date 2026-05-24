import { useEffect, useState } from 'react'

const LG = 1024 // Tailwind lg 브레이크포인트

export function useSidebar() {
  // 데스크탑이면 기본 열림, 모바일이면 기본 닫힘
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= LG)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((prev) => !prev)

  // 화면이 모바일 너비로 바뀌면 자동으로 닫기
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${LG - 1}px)`)
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false)
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { isOpen, open, close, toggle }
}
