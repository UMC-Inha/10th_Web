import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { UserToken } from '../types/auth'

export const BASE_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:8000'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface LoginResponse {
  id: number
  name: string
  accessToken: string
  refreshToken: string
}

const api = axios.create({
  baseURL: BASE_URL,
})

// 동시 401 처리: refresh가 진행 중이면 나머지 요청은 큐에서 대기
let isRefreshing = false
let refreshSubscribers: ((token: string | null) => void)[] = []

function notifySubscribers(token: string | null) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// 요청 인터셉터: 저장된 accessToken을 Authorization 헤더에 주입
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const stored = localStorage.getItem('token')
  if (stored) {
    const { accessToken } = JSON.parse(stored) as UserToken
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 응답 인터셉터: 401 수신 시 refreshToken으로 accessToken 재발급 후 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // refresh가 이미 진행 중이면 완료될 때까지 큐에서 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((token) => {
          if (!token) return reject(error)
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(api(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const stored = localStorage.getItem('token')
      if (!stored) throw new Error('no token')

      const token = JSON.parse(stored) as UserToken

      // base axios 사용 — api 인스턴스를 쓰면 인터셉터가 다시 돌아 무한 루프 발생
      const { data } = await axios.post<LoginResponse>(
        `${BASE_URL}/v1/auth/refresh`,
        { refresh: token.refreshToken },
      )

      const updated: UserToken = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        name: data.name,
      }
      localStorage.setItem('token', JSON.stringify(updated))

      notifySubscribers(data.accessToken)
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest)
    } catch {
      notifySubscribers(null)
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
