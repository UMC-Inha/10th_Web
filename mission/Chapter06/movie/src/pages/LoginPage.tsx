import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="relative mb-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 text-4xl text-white"
            aria-label="뒤로가기"
          >
            ‹
          </button>
          <h1 className="text-lg font-semibold text-white">로그인</h1>
        </div>
        <p className="text-center text-sm text-neutral-400">로그인 구현 예정</p>
      </div>
    </div>
  )
}

export default LoginPage
