import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">TMDB 영화 탐색</h1>
          <p className="mt-1 text-sm text-slate-600">카테고리별 영화 목록과 페이지네이션 예제</p>
        </header>
        <Navbar />
        <Outlet />
      </div>
    </main>
  )
}

export default Layout
