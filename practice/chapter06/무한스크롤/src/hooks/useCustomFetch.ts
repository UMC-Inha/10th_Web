import { useEffect, useMemo, useRef, useState } from 'react';

const STALE_TIME = 5 * 60 * 1000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

export const useCustomFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const storageKey = useMemo(() => url, [url]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    setIsError(false);

    const fetchData = async (currentRetry = 0) => {
      const currentTime = Date.now();
      const cachedItem = localStorage.getItem(storageKey);

      if (cachedItem && currentRetry === 0) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

          if (currentTime - cachedData.lastFetched < STALE_TIME) {
            console.log('[Cache Hit] Using cached data');

            setData(cachedData.data);
            setIsPending(false);
            return;
          }

          console.log('[Cache Stale] Showing cached data and refetching');
          setData(cachedData.data);
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      setIsPending(true);

      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status}`);
        }

        const newData: T = await response.json();

        setData(newData);

        localStorage.setItem(
          storageKey,
          JSON.stringify({
            data: newData,
            lastFetched: Date.now(),
          }),
        );

        console.log('[Fetch Success]', newData);

        setIsPending(false);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('[Fetch Aborted] Request was cancelled');
          return;
        }

        if (currentRetry < MAX_RETRIES) {
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);

          console.log(
            `[Retry ${currentRetry + 1}/${MAX_RETRIES}] Retrying in ${retryDelay}ms...`,
          );

          retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(currentRetry + 1);
          }, retryDelay);

          return;
        }

        console.error(`[Fetch Failed] Maximum retries (${MAX_RETRIES}) exceeded`);
        console.error(error);

        setIsError(true);
        setIsPending(false);
      }
    };

    fetchData();

    return () => {
      abortControllerRef.current?.abort();

      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
};