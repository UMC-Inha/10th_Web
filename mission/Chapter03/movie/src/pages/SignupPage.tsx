import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  signupEmailSchema,
  signupPasswordSchema,
  signupNicknameSchema,
  type SignupEmailData,
  type SignupPasswordData,
  type SignupNicknameData,
} from '../lib/schemas'
import type { UserToken } from '../types/auth'
import useLocalStorage from '../hooks/useLocalStorage'
import api, { BASE_URL } from '../lib/api'

const SignupPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [savedEmail, setSavedEmail] = useState('')
  const [savedPassword, setSavedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')
  const [, setToken] = useLocalStorage<UserToken | null>('token', null)

  const emailForm = useForm<SignupEmailData>({
    resolver: zodResolver(signupEmailSchema),
    mode: 'onTouched',
  })

  const passwordForm = useForm<SignupPasswordData>({
    resolver: zodResolver(signupPasswordSchema),
    mode: 'onTouched',
  })

  const nicknameForm = useForm<SignupNicknameData>({
    resolver: zodResolver(signupNicknameSchema),
    mode: 'onTouched',
  })

  const handleEmailNext = emailForm.handleSubmit((data) => {
    setSavedEmail(data.email)
    setStep(2)
  })

  const handlePasswordNext = passwordForm.handleSubmit((data) => {
    setSavedPassword(data.password)
    setStep(3)
  })

  const handleSignupComplete = nicknameForm.handleSubmit(async (data) => {
    try {
      setServerError('')
      const response = await api.post<{ name: string; accessToken: string; refreshToken: string }>(
        '/v1/auth/signup',
        { name: data.nickname, email: savedEmail, password: savedPassword },
      )
      setToken({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        name: response.data.name,
      })
      navigate('/')
    } catch {
      setServerError('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  })

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/v1/auth/google/login`
  }

  const handleBack = () => {
    if (step === 3) setStep(2)
    else if (step === 2) setStep(1)
    else navigate(-1)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">

        {/* 헤더 */}
        <div className="relative mb-8 flex items-center justify-center">
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-0 text-4xl text-white"
            aria-label="뒤로가기"
          >
            ‹
          </button>
          <h1 className="text-lg font-semibold text-white">회원가입</h1>
        </div>

        {/* Step 1: 이메일 입력 */}
        {step === 1 && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/40 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              <GoogleIcon />
              구글 로그인
            </button>

            <div className="my-5 flex items-center gap-3">
              <hr className="flex-1 border-white/30" />
              <span className="text-xs text-white/60">OR</span>
              <hr className="flex-1 border-white/30" />
            </div>

            <form onSubmit={handleEmailNext} noValidate className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  {...emailForm.register('email')}
                  className="w-full rounded-lg border border-white/30 bg-black px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/70"
                />
                {emailForm.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={!emailForm.formState.isValid}
                className="mt-2 w-full rounded-lg border border-white/20 bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음
              </button>
            </form>
          </>
        )}

        {/* Step 2: 비밀번호 입력 */}
        {step === 2 && (
          <form onSubmit={handlePasswordNext} noValidate className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-white/30 px-4 py-3">
              <EnvelopeIcon />
              <span className="text-sm text-white">{savedEmail}</span>
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요!"
                  {...passwordForm.register('password')}
                  className="w-full rounded-lg border border-white/30 bg-black px-4 py-3 pr-12 text-sm text-white placeholder-white/40 outline-none focus:border-white/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
              {passwordForm.formState.errors.password && (
                <p className="mt-1.5 text-xs text-red-400">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  {...passwordForm.register('confirmPassword')}
                  className="w-full rounded-lg border border-white/30 bg-black px-4 py-3 pr-12 text-sm text-white placeholder-white/40 outline-none focus:border-white/70"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                  aria-label={showConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!passwordForm.formState.isValid}
              className="mt-2 w-full rounded-lg border border-white/20 bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </form>
        )}

        {/* Step 3: 프로필 이미지 + 닉네임 */}
        {step === 3 && (
          <form onSubmit={handleSignupComplete} noValidate className="space-y-6">
            {/* 프로필 이미지 플레이스홀더 */}
            <div className="flex justify-center">
              <div className="flex h-32 w-32 items-end justify-center overflow-hidden rounded-full bg-neutral-600">
                <PersonIcon />
              </div>
            </div>

            {/* 닉네임 입력 */}
            <div>
              <input
                type="text"
                placeholder="닉네임을 입력해주세요!"
                {...nicknameForm.register('nickname')}
                className="w-full rounded-lg border border-white/30 bg-black px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/70"
              />
              {nicknameForm.formState.errors.nickname && (
                <p className="mt-1.5 text-xs text-red-400">
                  {nicknameForm.formState.errors.nickname.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-xs text-red-400">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={!nicknameForm.formState.isValid}
              className="w-full rounded-lg bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              회원가입 완료
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
)

const EnvelopeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const PersonIcon = () => (
  <svg width="96" height="96" viewBox="0 0 24 24" fill="currentColor" className="translate-y-3 text-neutral-400" aria-hidden="true">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
)

export default SignupPage
