// src/hooks/useCustomFetch.ts

import {useQuery} from "@tanstack/react-query";

export const useCustomFetch = <T>(url : string) => {
    return useQuery({
        queryKey: [url],

        queryFn: async ({signal}) => {
            const response = await fetch(url, {signal});

            if (!response.ok) {
                throw new Error('fail to fetch data');
            }

            return response.json() as Promise<T>;
        },
        retry: 3, // 실패 시 최대 3회 재시도
        // 지수 백오프 전략
        retryDelay: (attemptIndex)  => {
            return Math.min(1000 * Math.pow(2, attemptIndex), 30_000);
        },
        staleTime: 5 * 60 * 1_000, // 데이터가 신선하다고 간주되는 시간 (5분)
        gcTime: 10 * 60 * 1_000, // 가비지 컬렉션 시간 (10분) -> 쿼리가 사용되지 않은 채로 10분이 지나면 캐시에서 제거
    })
}

/*import { useState, useEffect, useMemo, useRef} from "react";

const STALE_TIME = 0.5 * 60 * 1_000; // 5분
const MAX_RETRIES = 3; // 최대 재시도 횟수
// 1초 마다 재시도
const RETRY_INTERVAL = 1 * 1_000; // 1초

// 로컬스토리지에 저장할 데이터의 구조
interface CacheEntry<T> {
  data: T;
  lastFetched: number; // 데이터를 마지막으로 가져온 timestamp
}

export const useCustomFetch = <T>(url : string) => {
      const [data, setData] = useState<T| null>(null);
      const [isPending, setIsPending] = useState<boolean>(true);
      const [isError, setIsError] = useState<boolean>(false);

      // url이 바뀔 때마다 실행
      const storageKey = useMemo(() => url, [url]);
      // 진행 중인 요청을 안전하게 취소하기 위해 useRef로 관리
      const abortControllerRef = useRef<AbortController | null>(null);
      const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
      abortControllerRef.current = new AbortController();
      const fetchData = async (currentRetry = 0) : Promise<void> => {
        // 동일한 URL에 대한 반복적인 네트워크 요청을 방지함 
        // 이미 가져온 데이터가 유효하다면(시간이 지나지 않았다면) 로컬 데이터를 즉시 반환
        const currentTime = new Date().getTime();
        const cachedItem = localStorage.getItem(storageKey); // storkageKey는 url임

        //캐시 데이터 확인, 신선도 검증
        if (cachedItem) {
            try {
                //local storage에 저장을 할 때는 직렬화 하여 저장함 -> pasre 상태로 꺼내야함
                const cachedData : CacheEntry<T> = JSON.parse(cachedItem);

                // cash가 신선한 경우 (5분이 지나지 않은 경우) 캐시된 데이터 사용
                if (currentTime - cachedData.lastFetched < STALE_TIME) {
                    setData(cachedData.data);
                    setIsPending(false);
                    console.log('캐시된 데이터 사용', url);
                    return; // 네트워크 요청을 하지 않고 캐시된 데이터를 사용
                }

                // 캐시가 만료된 경우 ->  캐싱된 데이터를 보여줌, 다시 네트워크 요청 후 데이터를 채워 넣음
                setData(cachedData.data);
                console.log('만료된 캐시 데이터 사용', url);
            } catch{
                localStorage.removeItem(storageKey); // 파싱 에러가 발생하면 해당 캐시 삭제
                console.warn('캐시 에러: 캐시 삭제함', url);
            }
        }

        setIsPending(true);
        setIsError(false);
    try {
        const response = await fetch(url, {
            signal: abortControllerRef.current?.signal
        });

        // fetch는 400, 500 에러도 정상적으로 응답이 오기 때문에 직접 에러처리를 해줘야함
        if (!response.ok) {
          throw new Error('fail to fetch data');
        }

        const newData = await response.json() as T;
        setData(newData);

        const newCacheEntry: CacheEntry<T> = {
            data: newData,
            lastFetched: new Date().getTime() // 현재 시간을 타임스탬프로 저장
        };
        localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('요청 취소됨', url);
            return;
        }

        // 지수 백오프 방식 사용
        if (currentRetry < MAX_RETRIES) {
            const retryDelay = RETRY_INTERVAL * Math.pow(2, currentRetry); // 1s, 2s, 4s
            console.log(`재시도 ${currentRetry + 1} / ${MAX_RETRIES} Retrying ${retryDelay}ms 후에 재시도합니다`);

        retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(currentRetry + 1);
        }, retryDelay);
    } else {
        // 최대 재시도 횟수 초과
        setIsError(true);
        setIsPending(false);
        console.log('최대 재시도 횟수 초과', url);
        return;
    }

        setIsError(true);
    console.log(error);
    } finally {
    setIsPending(false);
    }
};
    fetchData();
    // 클린업 해줘야함 -> 리소스 낭비를 방지한다
    return () => {
        abortControllerRef.current?.abort(); // 컴포넌트 언마운트 시 진행 중인 요청 취소

        // 예약된 재시도 타이머 취소
        if (retryTimeoutRef.current !== null) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
    };
},[url, storageKey]);

return {data, isPending, isError};
};
*/