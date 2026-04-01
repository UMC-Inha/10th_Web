import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className="rounded-xl border border-white/20 bg-slate-900 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-white">404 - 페이지를 찾을 수 없습니다</h2>
      <p className="mt-2 text-slate-300">요청한 경로가 존재하지 않습니다.</p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-lg border border-sky-500 bg-sky-600 px-4 py-2 text-sm font-medium text-white"
      >
        홈으로 이동
      </Link>
    </section>
  )
}

export default NotFoundPage
