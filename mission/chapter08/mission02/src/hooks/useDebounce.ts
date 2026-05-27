import { useState, useEffect, useRef } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const prevSerializedRef = useRef<string>("");

  useEffect(() => {
    // 실제 내용이 바뀌었는지 JSON.stringify로 비교
    const currentSerialized = JSON.stringify(value);
    if (prevSerializedRef.current === currentSerialized) return;
    prevSerializedRef.current = currentSerialized;

    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}