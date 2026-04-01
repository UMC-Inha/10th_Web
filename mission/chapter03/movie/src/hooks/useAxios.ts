import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

type UseAxiosResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
};

/**
 * @param requestFn - 최신 클로저는 ref로 유지 (무한 루프 방지)
 * @param deps - 값이 바뀔 때마다 useEffect에서 fetchData 재실행 (예: 페이지 번호)
 */
export const useAxios = <T>(
  requestFn: () => Promise<T>,
  deps: readonly unknown[] = []
): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestFnRef = useRef(requestFn);
  requestFnRef.current = requestFn;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await requestFnRef.current();
      setData(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('알 수 없는 에러가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData, ...deps]);

  return { data, isLoading, error, fetchData };
};
