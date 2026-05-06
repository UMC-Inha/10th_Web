import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../lib/schemas'
import type { UserToken } from '../types/auth'
import useLocalStorage from '../hooks/useLocalStorage'
import api, { BASE_URL } from '../lib/api'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const [, setToken] = useLocalStorage<UserToken | null>('token', null)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError('')
    try {
      const response = await api.post<{ name: string; accessToken: string; refreshToken: string }>(
        '/v1/auth/signin',
        { email: data.email, password: data.password },
      )
      setToken({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        name: response.data.name,
      })
      navigate('/')
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined
      setServerError(message ?? '이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/v1/auth/google/login`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
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

        {/* 구글 로그인 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/40 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
        >
          <GoogleIcon />
          구글 로그인
        </button>

        {/* OR 구분선 */}
        <div className="my-5 flex items-center gap-3">
          <hr className="flex-1 border-white/30" />
          <span className="text-xs text-white/60">OR</span>
          <hr className="flex-1 border-white/30" />
        </div>

        {/* 이메일 / 비밀번호 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="이메일을 입력해주세요!"
              {...register('email')}
              className="w-full rounded-lg border border-white/30 bg-black px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/70"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              {...register('password')}
              className="w-full rounded-lg border border-white/30 bg-black px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/70"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-red-400">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className="mt-2 w-full rounded-lg border border-white/20 bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
)

export default LoginPage
