import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { UserToken } from '../types/lp'

export const BASE_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const stored = localStorage.getItem('token')
  if (stored) {
    const { accessToken } = JSON.parse(stored) as UserToken
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

export default api
