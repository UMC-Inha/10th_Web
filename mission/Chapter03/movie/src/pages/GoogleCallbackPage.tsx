import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { UserToken } from '../types/auth'
import useLocalStorage from '../hooks/useLocalStorage'

const GoogleCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [, setToken] = useLocalStorage<UserToken | null>('token', null)

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const name = searchParams.get('name') ?? ''

    if (accessToken && refreshToken) {
      setToken({ accessToken, refreshToken, name })
      navigate('/', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="text-white">로그인 처리 중...</p>
    </div>
  )
}

export default GoogleCallbackPage
