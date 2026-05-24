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
        {/*
          데스크탑 전용 스페이서: 사이드바와 동일한 너비로 레이아웃 공간을 차지해
          main 콘텐츠를 오른쪽으로 밀어냄. 모바일에서는 숨김.
        */}
        <div
          aria-hidden="true"
          className={`
            hidden lg:block shrink-0 h-full
            transition-[width] duration-300 ease-in-out
            ${isOpen ? 'w-36' : 'w-0'}
          `}
        />

        {/* 사이드바: 항상 absolute. 데스크탑은 스페이서가 공간 확보, 모바일은 오버레이 */}
        <Sidebar isOpen={isOpen} onClose={close} />

        {/* 모바일 backdrop: 모바일에서만 사이드바 열릴 때 표시 */}
        <div
          onClick={close}
          aria-hidden="true"
          className={`
            absolute inset-0 z-10 bg-black/40 lg:hidden
            transition-opacity duration-200
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        />

        {/* 모바일에서 사이드바 오버레이 중 배경 스크롤 방지 */}
        <main className={`flex-1 overflow-y-auto ${isOpen ? 'max-lg:overflow-hidden' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
