import { useEffect, useMemo, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────
// 상수 정의
// ─────────────────────────────────────────────────────────

/** 데이터가 "신선(fresh)" 상태로 유지되는 시간 (5분) */
const STALE_TIME = 5 * 60 * 1_000;

/** 실패 시 최대 재시도 횟수 */
const MAX_RETRIES = 3;

/** 첫 번째 재시도 전 대기 시간 (1초) */
const INITIAL_RETRY_DELAY = 1_000;

// ─────────────────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────────────────

/**
 * localStorage에 저장하는 캐시 항목 구조
 * - data: 실제 서버 응답 데이터
 * - lastFetched: 마지막으로 데이터를 가져온 시점의 타임스탬프 (ms)
 */
interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

export interface UseCustomFetchResult<T> {
  /** 서버에서 받아온 데이터 (없으면 null) */
  data: T | null;
  /** 네트워크 요청이 진행 중인지 여부 */
  isPending: boolean;
  /** 최종적으로 에러가 발생했는지 여부 */
  isError: boolean;
}

// ─────────────────────────────────────────────────────────
// useCustomFetch 훅
// ─────────────────────────────────────────────────────────

/**
 * React Query의 핵심 기능을 직접 구현한 커스텀 데이터 패칭 훅
 *
 * 구현된 기능:
 * 1. 기본 fetch + 로딩/에러 상태 관리
 * 2. localStorage 기반 캐싱 (staleTime)
 *    - 신선한 캐시가 있으면 네트워크 요청 생략
 *    - 낡은 캐시가 있으면 먼저 보여주고 백그라운드에서 갱신 (stale-while-revalidate)
 * 3. AbortController를 이용한 요청 취소
 *    - URL이 바뀌거나 컴포넌트가 언마운트되면 이전 요청을 즉시 중단
 *    - Race Condition 방지
 * 4. 지수 백오프(Exponential Backoff) 자동 재시도
 *    - 실패 시 1초 → 2초 → 4초 간격으로 최대 MAX_RETRIES회 재시도
 *    - 컴포넌트가 언마운트되면 예약된 재시도 타이머도 함께 취소
 */
export function useCustomFetch<T>(url: string): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // URL을 캐시 키로 사용 (useMemo로 불필요한 재계산 방지)
  const storageKey = useMemo(() => url, [url]);

  // fetch 요청을 취소하기 위한 AbortController 참조
  // useRef를 사용해 리렌더링 시에도 동일한 참조 유지
  const abortControllerRef = useRef<AbortController | null>(null);

  // 재시도 setTimeout ID 참조
  // cleanup 시 clearTimeout으로 불필요한 재시도 방지
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // ── 초기화 ──────────────────────────────────────────
    abortControllerRef.current = new AbortController();
    setIsError(false);

    /**
     * 실제 데이터 패칭 함수
     * @param currentRetry 현재까지 시도한 재시도 횟수 (기본 0)
     */
    const fetchData = async (currentRetry = 0) => {
      const now = Date.now();
      const cachedItem = localStorage.getItem(storageKey);

      // ── 1단계: 캐시 확인 ────────────────────────────────
      if (cachedItem) {
        try {
          const cached: CacheEntry<T> = JSON.parse(cachedItem);
          const isStale = now - cached.lastFetched >= STALE_TIME;

          if (!isStale) {
            // 신선한 캐시 → 네트워크 요청 없이 즉시 반환
            console.log(`[Cache Hit] 캐시 데이터 사용: ${url}`);
            setData(cached.data);
            setIsPending(false);
            return;
          }

          // 낡은 캐시 → 먼저 화면에 보여주면서 백그라운드 갱신 시작
          // (stale-while-revalidate 패턴)
          console.log(`[Cache Stale] 백그라운드 갱신 시작: ${url}`);
          setData(cached.data);
        } catch {
          // 손상된 캐시 항목 제거
          localStorage.removeItem(storageKey);
          console.warn(`[Cache Error] 캐시 손상, 제거: ${url}`);
        }
      }

      // ── 2단계: 네트워크 요청 ────────────────────────────
      setIsPending(true);

      try {
        const response = await fetch(url, {
          // AbortController의 signal을 전달 → 취소 가능하게 설정
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP 오류: ${response.status}`);
        }

        const newData: T = await response.json();

        // 상태 갱신
        setData(newData);

        // 새 데이터를 타임스탬프와 함께 캐시에 저장
        const entry: CacheEntry<T> = {
          data: newData,
          lastFetched: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(entry));
        console.log(`[Fetch Success] 캐시 저장 완료: ${url}`);

        setIsPending(false);
      } catch (error) {
        // ── 취소된 요청은 정상 동작 → 에러로 처리하지 않음 ──
        if (error instanceof Error && error.name === 'AbortError') {
          console.log(`[Fetch Cancelled] 요청 취소됨: ${url}`);
          return;
        }

        // ── 3단계: 재시도 (지수 백오프) ─────────────────────
        if (currentRetry < MAX_RETRIES) {
          // 재시도 딜레이: 1s → 2s → 4s (2^n 배)
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
          console.log(
            `[Retry ${currentRetry + 1}/${MAX_RETRIES}] ${delay}ms 후 재시도: ${url}`
          );

          retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(currentRetry + 1);
          }, delay);
        } else {
          // 최대 재시도 초과 → 에러 상태로 전환
          setIsError(true);
          setIsPending(false);
          console.error(
            `[Fetch Failed] 최대 재시도(${MAX_RETRIES}회) 초과:`,
            error
          );
        }
      }
    };

    fetchData();

    // ── cleanup: 컴포넌트 언마운트 또는 url 변경 시 실행 ──
    return () => {
      // 진행 중인 네트워크 요청 취소 → Race Condition 방지
      abortControllerRef.current?.abort();

      // 예약된 재시도 타이머 취소
      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
}
