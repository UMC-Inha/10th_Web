import { useEffect, useState } from 'react'

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN

type FetchResult<T> = {
  data: T | null
  isLoading: boolean
  errorMessage: string
}

function useCustomFetch<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!url) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    const fetchData = async () => {
      setIsLoading(true)
      setErrorMessage('')

      if (!TMDB_TOKEN) {
        if (!cancelled) {
          setErrorMessage('TMDB 토큰이 설정되지 않았습니다. .env 파일의 VITE_TMDB_TOKEN 값을 확인해주세요.')
          setIsLoading(false)
        }
        return
      }

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        })

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`)
        }

        const json: T = await response.json()

        if (!cancelled) {
          setData(json)
          setErrorMessage('')
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    // URL이 바뀌면 이전 요청 결과를 무시
    return () => {
      cancelled = true
    }
  }, [url])

  return { data, isLoading, errorMessage }
}

export default useCustomFetch
