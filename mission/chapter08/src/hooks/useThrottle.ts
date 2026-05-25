import { useCallback, useEffect, useRef } from 'react';

/**
 * 콜백을 interval(ms) 간격으로만 실행하도록 제한하는 throttle 훅
 * - trailing: interval 내 마지막 호출은 interval 종료 후 1회 실행
 * - 언마운트 / delay 변경 시 pending timeout 정리
 */
function useThrottle<T extends unknown[]>(
  callback: (...args: T) => void,
  interval: number,
) {
  const callbackRef = useRef(callback);
  const lastRanRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [interval]);

  return useCallback(
    (...args: T) => {
      const now = Date.now();
      const elapsed = now - lastRanRef.current;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (elapsed >= interval) {
        lastRanRef.current = now;
        callbackRef.current(...args);
        return;
      }

      timeoutRef.current = setTimeout(() => {
        lastRanRef.current = Date.now();
        callbackRef.current(...args);
      }, interval - elapsed);
    },
    [interval],
  );
}

export default useThrottle;
