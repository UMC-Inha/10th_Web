import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value : T, delay: number = 500): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(0); // 첫 입력 즉시 실행
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const valueRef = useRef<T>(value);

    useEffect(()=> {
        valueRef.current = value;
    }, [value]);

    useEffect(()=> {
    const now = Date.now();
    const remaining = lastExecuted.current + delay - now;

    const excute = () => {
        lastExecuted.current = Date.now();
        setThrottledValue(valueRef.current);
        timerRef.current = null;
    };

    if (remaining <= 0) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      excute();
    } else if (!timerRef.current) {
        timerRef.current = setTimeout(excute, remaining);
    }
}, [value, delay]);

    useEffect(()=>{
        return() => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    },[]);

    return throttledValue;
}

export default useThrottle;