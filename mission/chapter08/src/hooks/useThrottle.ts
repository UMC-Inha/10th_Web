import { useCallback, useRef } from 'react';

/**
 * 지정한 interval 동안 최대 한 번만 실행되는 스로틀된 함수를 반환함
 * - fn은 ref로 관리하여 interval이 바뀌지 않아도 항상 최신 콜백이 호출됨
 * - 언마운트 시 타이머를 clearTimeout으로 정리함
 */
function useThrottle<T extends unknown[]>(
  fn: (...args: T) => void,
  interval: number,
): (...args: T) => void {
  const lastTimeRef = useRef(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useCallback(
    (...args: T) => {
      const now = Date.now();
      if (now - lastTimeRef.current >= interval) {
        lastTimeRef.current = now;
        fnRef.current(...args);
      }
    },
    [interval],
  );
}

export default useThrottle;
