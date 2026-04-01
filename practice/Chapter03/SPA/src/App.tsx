import { useEffect, useMemo, useState } from 'react'

// 허용할 경로
type RoutePath = '/' | '/about' | '/contact'

const routeSet = new Set<RoutePath>(['/', '/about', '/contact'])

const isRoutePath = (path: string): path is RoutePath => routeSet.has(path as RoutePath)

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = (path: RoutePath) => {
    if (path === window.location.pathname) return
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const page = useMemo(() => {
    if (!isRoutePath(currentPath)) {
      return {
        title: '404 - 페이지를 찾을 수 없어요',
        body: '요청하신 경로가 존재하지 않습니다.',
        isNotFound: true,
      }
    }

    if (currentPath === '/') {
      return {
        title: '홈',
        body: '안녕하세요! 김서현입니다.',
        isNotFound: false,
      }
    }

    if (currentPath === '/about') {
      return {
        title: '내 소개',
        body: '저는 경영학과 22학번입니다.',
        isNotFound: false,
      }
    }

    return {
      title: '이메일',
      body: '이메일: seohyeon0219@naver.com',
      isNotFound: false,
    }
  }, [currentPath])

  const navItems: Array<{ path: RoutePath; label: string }> = [
    { path: '/', label: '홈' },
    { path: '/about', label: '내 소개' },
    { path: '/contact', label: 'contact' },
  ]

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-800">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header className="mb-6 border-b border-slate-100 pb-5">
          <p className="mb-2 text-xs font-semibold tracking-wide text-sky-600">SPA 실습 과제</p>
          <h1 className="text-2xl font-bold sm:text-3xl">자기소개</h1>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path

            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(item.path)
                }}
                className={[
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                ].join(' ')}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <main className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <p className="mb-3 text-xs text-slate-500">현재 경로: {currentPath}</p>
          <h2 className={['mb-2 text-xl font-semibold', page.isNotFound ? 'text-rose-600' : 'text-slate-800'].join(' ')}>
            {page.title}
          </h2>
          <p className="leading-relaxed text-slate-700">{page.body}</p>
        </main>
      </div>
    </div>
  )
}

export default App
