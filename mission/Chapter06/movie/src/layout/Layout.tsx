import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col bg-black">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        {/* 모바일에서만 backdrop 표시 */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-10 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
