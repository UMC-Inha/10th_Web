import { useEffect, useState } from 'react';
import axios from 'axios';

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useCustomFetch<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = []
): UseFetchResult<T> {
  const depsKey = JSON.stringify(deps);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFn();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.status_message ?? '데이터를 불러오는 중 오류가 발생했습니다.');
          } else {
            setError('알 수 없는 오류가 발생했습니다.');
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => { cancelled = true; };
    //fetchFn을 의존성 배열에 추가함
  }, [fetchFn, depsKey]);

  return { data, isLoading, error };
}