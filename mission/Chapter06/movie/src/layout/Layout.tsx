import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useSidebar } from '../hooks/useSidebar'

const Layout = () => {
  const { isOpen, close, toggle } = useSidebar()

  return (
    <div className="flex h-screen flex-col bg-black">
      <Header onMenuClick={toggle} />
      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar isOpen={isOpen} onClose={close} />

        {/* 모바일 backdrop */}
        <div
          onClick={close}
          aria-hidden="true"
          className={`
            absolute inset-0 z-10 bg-black/40 lg:hidden
            transition-opacity duration-200
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        />

        {/* 사이드바 열림 시 main 스크롤도 잠금 (이 레이아웃에서 실제 스크롤은 main에 있음) */}
        <main className={`flex-1 overflow-y-auto ${isOpen ? 'overflow-hidden' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
