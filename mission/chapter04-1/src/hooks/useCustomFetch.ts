import { useState, useEffect } from "react";


export const useCustomFetch = <T, P extends unknown[]>(
  fetchFn: (...args: P) => Promise<T>, 
  params: P
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchFn(...params);
        if (!isCancelled) {
          setData(result);
          setIsError(false);
        }
      } catch {
        if (!isCancelled) setIsError(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [JSON.stringify(params)]); 

  return { data, isLoading, isError, setData };
};