import { useEffect, useState } from 'react'

const SYNC_EVENT = 'useLocalStorage:sync'

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  // 같은 탭의 다른 인스턴스가 setValue를 호출하면 여기서 감지
  useEffect(() => {
    const handleSync = (e: CustomEvent<{ key: string; value: unknown }>) => {
      if (e.detail.key !== key) return
      setStoredValue(e.detail.value as T)
    }

    window.addEventListener(SYNC_EVENT, handleSync as EventListener)
    return () => window.removeEventListener(SYNC_EVENT, handleSync as EventListener)
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
      // 같은 탭 내 다른 인스턴스에 변경 알림
      window.dispatchEvent(
        new CustomEvent(SYNC_EVENT, { detail: { key, value } }),
      )
    } catch {
      // localStorage unavailable
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
