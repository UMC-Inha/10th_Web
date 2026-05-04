import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { UserToken } from '../types/auth'
import useLocalStorage from '../hooks/useLocalStorage'

const ACCESS_TOKEN_KEYS = ['accessToken', 'access_token', 'token']
const REFRESH_TOKEN_KEYS = ['refreshToken', 'refresh_token']

function getValueByCandidates(params: URLSearchParams, candidates: string[]) {
  for (const key of candidates) {
    const value = params.get(key)
    if (value) return value
  }
  return null
}

const GoogleCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [, setToken] = useLocalStorage<UserToken | null>('token', null)
  const [message, setMessage] = useState('구글 로그인 처리 중...')

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const mergedParams = new URLSearchParams([
      ...searchParams.entries(),
      ...hashParams.entries(),
    ])

    const error = mergedParams.get('error')
    if (error) {
      setMessage(`구글 로그인 실패: ${error}`)
      return
    }

    const accessToken = getValueByCandidates(mergedParams, ACCESS_TOKEN_KEYS)
    const refreshToken = getValueByCandidates(mergedParams, REFRESH_TOKEN_KEYS)
    const name = mergedParams.get('name') ?? ''

    if (!accessToken) {
      setMessage('토큰을 받지 못했습니다. 다시 로그인해 주세요.')
      return
    }

    setToken({ accessToken, refreshToken: refreshToken ?? '', name })
    navigate('/', { replace: true })
  }, [navigate, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="text-white">{message}</p>
    </div>
  )
}

export default GoogleCallbackPage
