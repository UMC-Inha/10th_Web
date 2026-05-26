import { useCallback, useEffect, useRef } from 'react';

/**
 * 콜백을 interval(ms) 간격으로만 실행하도록 제한하는 throttle 훅
 * - leading: interval이 지난 직후 호출은 즉시 실행
 * - trailing: interval 윈도우 내 추가 호출은 기존 타이머를 유지하고 최신 args만 갱신
 *   (타이머를 매번 reset하면 연속 이벤트 시 debounce처럼 동작함)
 * - 언마운트 / interval 변경 시 pending timeout 정리
 */
function useThrottle<T extends unknown[]>(
  callback: (...args: T) => void,
  interval: number,
) {
  const callbackRef = useRef(callback);
  const lastRanRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingArgsRef = useRef<T | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      pendingArgsRef.current = null;
    };
  }, [interval]);

  return useCallback(
    (...args: T) => {
      const now = Date.now();
      const elapsed = now - lastRanRef.current;

      if (elapsed >= interval) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        pendingArgsRef.current = null;
        lastRanRef.current = now;
        callbackRef.current(...args);
        return;
      }

      pendingArgsRef.current = args;

      // 이미 trailing 타이머가 있으면 reset하지 않고 args만 최신화
      if (timeoutRef.current) return;

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        lastRanRef.current = Date.now();

        const pendingArgs = pendingArgsRef.current;
        pendingArgsRef.current = null;
        if (pendingArgs) {
          callbackRef.current(...pendingArgs);
        }
      }, interval - elapsed);
    },
    [interval],
  );
}

export default useThrottle;
