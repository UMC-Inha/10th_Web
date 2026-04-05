import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

type UseAxiosResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => void;
};

const isAbortError = (error: unknown): boolean => {
  if (axios.isCancel(error)) return true;
  if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') return true;
  return error instanceof DOMException && error.name === 'AbortError';
};

/**
 * @param requestFn - axios 등에 `signal`을 넘겨 요청 취소 가능하게 할 것
 * @param deps - 바뀌면 이전 요청을 abort하고 새로 요청
 */
export const useAxios = <T>(
  requestFn: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[] = []
): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestFnRef = useRef(requestFn);
  requestFnRef.current = requestFn;

  /** effect / 수동 재시도 중 마지막으로 돌고 있는 요청만 가리킴 */
  const activeAbortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (signal: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await requestFnRef.current(signal);
      if (signal.aborted) return;
      setData(result);
    } catch (err) {
      if (signal.aborted || isAbortError(err)) return;
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 에러가 발생했습니다.');
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    activeAbortRef.current?.abort();
    const controller = new AbortController();
    activeAbortRef.current = controller;
    void run(controller.signal);
    return () => {
      controller.abort();
      if (activeAbortRef.current === controller) {
        activeAbortRef.current = null;
      }
    };
  }, [run, ...deps]);

  const fetchData = useCallback(() => {
    activeAbortRef.current?.abort();
    const controller = new AbortController();
    activeAbortRef.current = controller;
    void run(controller.signal);
  }, [run]);

  return { data, isLoading, error, fetchData };
};
