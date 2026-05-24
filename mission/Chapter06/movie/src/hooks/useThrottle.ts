import { useCallback, useEffect, useRef } from 'react'

export function useThrottle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  interval: number,
): (...args: Args) => void {
  const lastCalledRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 항상 최신 fn을 참조하되, useCallback 의존성에는 포함하지 않음
  const fnRef = useRef(fn)
  fnRef.current = fn

  // interval 변경 또는 언마운트 시 대기 중인 trailing 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [interval])

  return useCallback(
    (...args: Args) => {
      const now = Date.now()
      const remaining = interval - (now - lastCalledRef.current)

      if (remaining <= 0) {
        // 쿨다운 경과 → 즉시 실행 (leading)
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        lastCalledRef.current = now
        fnRef.current(...args)
      } else {
        // 쿨다운 중 → 마지막 호출을 trailing으로 예약
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
          lastCalledRef.current = Date.now()
          timerRef.current = null
          fnRef.current(...args)
        }, remaining)
      }
    },
    [interval],
  )
}
