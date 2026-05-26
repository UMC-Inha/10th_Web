import { useEffect, useState } from 'react';

/**
 * 값이 변경된 후 delay ms 동안 추가 변경이 없으면 지연된 값을 반환함
 * - 의존성(value, delay) 변경 시 이전 타이머를 clearTimeout으로 정리함
 * - delay가 바뀌면 즉시 새 타이머로 교체됨
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
