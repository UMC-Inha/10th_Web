# TanStack Query

## TanStack Query란?

- 서버 상태(비동기 데이터)의 <strong>패칭 · 캐싱 · 동기화 · 리페치 · 에러/로딩 상태 관리</strong>를 표준화해주는 라이브러리임
- 기존의 `useState + useEffect` 조합으로 직접 처리하던 반복 코드를 훅 하나로 대체할 수 있음
- React 전용이었던 React Query가 v4부터 Vue·Svelte 등 다양한 프레임워크를 지원하며 <strong>TanStack Query</strong>로 이름이 바뀜

<aside>

클라이언트 상태(UI 상태 등)는 `useState`·`zustand` 같은 도구로 관리하고,

<strong>서버에서 가져오는 비동기 데이터</strong>는 TanStack Query로 관리하는 것이 현재 권장되는 패턴임

</aside>

---

## 설치 및 기본 설정

```bash
npm i @tanstack/react-query
```

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 하위 컴포넌트 */}
    </QueryClientProvider>
  );
}
```

- `QueryClient` — 캐시를 직접 관리하는 인스턴스임
- `QueryClientProvider` — 하위 컴포넌트 전체에 `QueryClient`를 전달하는 Context Provider임

---

## TanStack Query Devtools

쿼리·뮤테이션의 <strong>캐시 상태, 리페치, 에러</strong> 등을 시각적으로 확인·디버깅할 수 있는 개발 도구임

v5부터 뮤테이션 관찰도 지원하며, 프로덕션 빌드에서는 자동으로 제외됨

```bash
npm i @tanstack/react-query-devtools
```

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {/* 앱 컴포넌트 */}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## useQuery

데이터를 <strong>조회</strong>하는 핵심 훅임

`queryKey`로 캐시 주소를 정하고, `queryFn`으로 비동기 패칭 함수를 등록함

```tsx
const { data, isPending, isError, error, isFetching, refetch } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 30_000,
  gcTime: 5 * 60 * 1000,
  retry: 1,
  refetchOnWindowFocus: true,
});
```

### 주요 상태값

| 상태 | 설명 |
|------|------|
| `isPending` | 캐시 없이 첫 패칭 중일 때 true |
| `isError` | 마지막 요청이 실패했을 때 true |
| `data` | 성공 시 응답 데이터 |
| `isFetching` | 백그라운드 리페치 포함 모든 요청 중 true |

### 자주 쓰는 주요 옵션

| 옵션 | 설명 |
|------|------|
| `queryKey` | 캐시 주소. 같은 키면 캐시 공유 |
| `queryFn` | 실제 데이터를 가져오는 비동기 함수 |
| `staleTime` | 데이터가 fresh로 유지되는 시간 (기본 0ms) |
| `gcTime` | 미사용 캐시를 메모리에 보관하는 시간 (기본 5분) |
| `enabled` | false면 쿼리 실행 안 함 (조건부 패칭) |
| `retry` | 실패 시 재시도 횟수 |
| `select` | 응답 데이터를 원하는 형태로 가공 |
| `placeholderData` | 실제 데이터 도착 전 임시로 보여줄 값 |
| `refetchOnWindowFocus` | 탭 복귀 시 자동 최신화 |
| `refetchInterval` | 주기적 자동 리페치 |
| `throwOnError` | ErrorBoundary로 에러 전파 |

### `staleTime` vs `gcTime` 차이

| 구분 | `staleTime` | `gcTime` |
|------|-------------|----------|
| 역할 | 데이터 신선도 유지 시간 | 미사용 캐시 메모리 보관 시간 |
| 만료 시 동작 | stale 상태 → 리페치 트리거 대기 | 캐시에서 완전히 삭제 |
| 기본값 | 0ms (즉시 stale) | 300,000ms (5분) |
| 핵심 질문 | "언제 새로 요청하나?" | "언제 메모리에서 지우나?" |

<aside>

**캐싱 전략 팁**
- `staleTime`을 길게 → 불필요한 네트워크 요청 감소
- `gcTime`을 길게 → 화면 복귀 시 캐시 즉시 활용
- `gcTime`은 항상 `staleTime` 이상으로 설정하는 것이 권장됨

</aside>

---

## useInfiniteQuery

### 오프셋 vs 커서 기반 페이지네이션

| 항목 | 오프셋 기반 | 커서 기반 |
|------|-------------|-----------|
| 원리 | "N번째부터 M개" (LIMIT/OFFSET) | "마지막 항목 다음부터" (WHERE id < cursor) |
| 구현 복잡도 | 낮음 | 중간 |
| 데이터 일관성 | 낮음 (중복·누락 위험) | 높음 |
| 깊은 페이지 성능 | 저하됨 | 일정함 |
| 랜덤 접근 | 가능 | 불가 |
| 적합한 UI | 번호형 페이지네이션 | 무한 스크롤 |

### useInfiniteQuery란?

데이터를 <strong>페이지 단위로 분할</strong>해 불러오고, 받아온 페이지를 <strong>캐시에 누적</strong>해주는 훅임

무한 스크롤 구현에 특화되어 있음

```tsx
const {
  data,               // data.pages: 누적된 페이지 배열
  fetchNextPage,      // 다음 페이지 요청 함수
  hasNextPage,        // 다음 페이지 존재 여부
  isFetchingNextPage, // 다음 페이지 로딩 중 여부
} = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) =>
    lastPage.length < PAGE_SIZE ? undefined : allPages.length + 1,
});
```

### 핵심 옵션

| 옵션 | 설명 |
|------|------|
| `initialPageParam` | 첫 페이지 요청에 사용할 초기 파라미터 |
| `getNextPageParam` | 마지막 페이지 응답으로 다음 pageParam 계산. `undefined` 반환 시 종료 |
| `getPreviousPageParam` | 이전 페이지 파라미터 계산 (필요 시) |

### `data.pages` 구조

```js
{
  pages: [
    [post1, ..., post10],   // 1페이지
    [post11, ..., post20],  // 2페이지
  ],
  pageParams: [1, 2]
}
```

실제 렌더링 시에는 `data.pages.flatMap((page) => page)`로 펼쳐서 사용함

### 자동 무한 스크롤 (Intersection Observer)

페이지 최하단에 보이지 않는 sentinel 요소를 두고, 화면에 나타나는 순간 `fetchNextPage`를 호출함

```tsx
const sentinelRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (!sentinelRef.current) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });
  observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

// JSX
<div ref={sentinelRef} style={{ height: 1 }} />
```

<aside>

sentinel 요소가 화면에 보이면 → Observer 콜백 실행 → 조건 만족 시 `fetchNextPage()` 호출

다음 페이지가 없으면(`hasNextPage === false`) 자동으로 멈춤

</aside>

---

## Skeleton UI

데이터 로딩 중 빈 화면 대신 <strong>콘텐츠가 들어갈 자리를 회색 박스·선으로 미리 보여주는</strong> 디자인 기법임

### 장점

| 장점 | 설명 |
|------|------|
| 체감 로딩 시간 감소 | 심리적으로 더 빠르게 느껴짐 |
| 사용자 이탈률 감소 | "작동 중"임을 알려 이탈을 방지함 |
| 시각적 일관성 | 레이아웃 점프(CLS) 없이 자연스럽게 채워짐 |
| 신뢰도 향상 | 시스템이 정상 작동 중임을 명확히 전달함 |

### 단점

| 단점 | 설명 |
|------|------|
| 구현 비용 | 화면마다 별도의 뼈대 UI 설계·개발이 필요함 |
| 짧은 로딩 시 역효과 | 200ms 미만 응답이면 오히려 깜빡임처럼 보임 |
| 실제 UI와 불일치 | 뼈대 형태가 실제 콘텐츠와 많이 다르면 혼란을 줌 |

### TanStack Query와 연동

```tsx
const { data, isPending } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

if (isPending) return <SkeletonList />;
return <PostList data={data} />;
```

`isPending`이 `true`인 동안 Skeleton 컴포넌트를 렌더링하고, 데이터가 도착하면 실제 컴포넌트로 교체함

---

## 한 줄 정리

- <strong>useQuery</strong> — 서버 데이터 조회·캐싱을 훅 하나로 처리함
- <strong>useInfiniteQuery</strong> — 페이지 누적 방식의 무한 스크롤 데이터 패칭에 특화됨
- <strong>staleTime / gcTime</strong> — 언제 새로 요청하고, 언제 캐시를 지울지 결정하는 두 축임
- <strong>Skeleton UI</strong> — 로딩 중 사용자 경험을 높이는 시각적 자리 표시 기법임
