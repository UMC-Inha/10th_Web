# React 전역 상태 관리 가이드

> 참고
>
> - [개발자 매튜 | React 전역 상태 관리 완벽 가이드: Context API vs Zustand vs Jotai](https://www.yolog.co.kr/post/global-state/)
> - [useSyncExternalStore – React](https://react.dev/reference/react/useSyncExternalStore)
> - [TanStack Query – Overview](https://tanstack.com/query/latest/docs/framework/react/overview)

---

## 상태의 세 가지 종류

| 종류 | 설명 | 예시 |
| --- | --- | --- |
| **로컬 state** | 한 컴포넌트 안에서만 | 폼 input, 모달 open |
| **전역 state (클라이언트)** | 여러 컴포넌트가 공유, 클라이언트가 통제 | 테마, 장바구니 UI, 인증 토큰 |
| **서버 state** | API에서 오는 데이터, 신선도·캐시 필요 | LP 목록, 댓글 |

이 문서는 **클라이언트 전역 state** 비교에 집중함. 서버 state는 TanStack Query(chapter06)가 담당하는 영역

---

## Context API value 전체 구독 vs Zustand selector 구독

### Context — value 전체 구독

```tsx
function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const value = { user, setUser, theme, setTheme };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
```

`useContext`는 Provider의 **`value` 객체 참조**를 구독함

- `user`만 바뀌어도 `value`가 새 객체 → **theme만 쓰는 컴포넌트도 재평가**
- `theme`만 바꿔도 **user만 쓰는 컴포넌트도 재평가**
- Context를 나누거나 `useMemo`로 value를 안정화해도, **한 Context 안의 특정 필드만** 구독하는 API는 없음

React 공식 문서도 Context value 변경 시 해당 Context를 읽는 컴포넌트가 리렌더된다고 설명함

### Zustand — selector 기반 구독

```tsx
function Parent() {
  const user = useUserStore((state) => state.user);
  return <div>{user?.name}</div>;
}

function Child() {
  const theme = useUserStore((state) => state.theme);
  return <button>{theme}</button>;
}
```

- store는 React 트리 **밖** module-level에 존재
- `useSyncExternalStore`로 외부 store 구독 → Concurrent Rendering에서 tearing 방지
- 각 컴포넌트의 **selector 반환값**만 `Object.is`로 비교
- `set({ theme: 'dark' })` → `Parent`(user 구독)는 리렌더 **안 됨**

### 성능 차이 요약

| | Context API | Zustand |
| --- | --- | --- |
| 구독 단위 | `value` 전체 | selector가 고른 slice |
| A 필드 변경 시 B만 쓰는 컴포넌트 | 재평가됨 (memo 없으면 리렌더) | selector 결과 동일 → 스킵 |
| Provider | 필수 | 기본 불필요 |
| 적합 | 자주 안 바뀌는 값 (locale, auth snapshot) | 필드 많고 갱신 잦은 전역 state |

매튜 블로그 벤치마크(커뮤니티 측정 인용): 50개 필드 폼에서 한 필드 변경 시 Context ~280ms vs Zustand ~45ms 수준 — **환경마다 다르므로 Profiler로 직접 측정**하는 것이 원칙

---

## Jotai atom 조합과 파생 상태 (Zustand 대비)

### Zustand — Top-down, 단일 store + selector

```tsx
const useStore = create(() => ({
  user: { name: '매튜', age: 30 },
  theme: 'light',
}));

// 파생 값은 컴포넌트나 selector에서 직접 계산
const userName = useStore((s) => s.user.name);
const doubleAge = useStore((s) => s.user.age * 2);
```

파생 state가 많아지면 selector가 흩어지거나, store action/reducer에 로직이 몰릴 수 있음

### Jotai — Bottom-up, atom + 의존성 그래프

```tsx
import { atom } from 'jotai';

const userAtom = atom({ name: '매튜', age: 30 });
const themeAtom = atom<'light' | 'dark'>('light');

// 파생 atom — read 시 get()으로 의존 atom 자동 추적
const userNameAtom = atom((get) => get(userAtom).name);
const doubleAgeAtom = atom((get) => get(userAtom).age * 2);
const isLoggedInAtom = atom((get) => get(userAtom) !== null);
```

### 의존성 추적 관점의 장점

Jotai는 파생 atom의 `read(get)` 실행 중 **`get(다른Atom)` 호출을 기록**해 의존성 그래프를 만듦

```
userAtom
  ├─> userNameAtom
  └─> doubleAgeAtom
```

- `userAtom` 변경 → **의존하는 atom만** 재계산 → 그 atom을 구독하는 컴포넌트만 리렌더
- `themeAtom` 변경 → `userNameAtom`과 무관 → user 관련 UI는 영향 없음
- 파생 state를 **선언적으로 atom으로 조합** — Zustand는 store 한 덩어리 + selector, Jotai는 atom 단위 그래프

Zustand: “큰 store를 selector로 쪼갠다”  
Jotai: “작은 atom을 조합하고, 의존성은 프레임워크가 추적한다”

| | Zustand | Jotai |
| --- | --- | --- |
| 구조 | 단일(또는 소수) store | atom 단위 bottom-up |
| 파생 state | selector / getState 수동 | `atom(get => ...)` 자동 의존 |
| Suspense 연동 | 가능 | atom 단위 async에 강함 |
| 학습 곡선 | 낮음 | atom/Provider 개념 필요 |

---

## useEffect로 서버 상태를 관리할 때의 문제

### 나쁜 패턴

```tsx
function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;
  return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

### 1) 캐싱 없음

- 컴ponent **unmount** 시 `useState` 데이터 소실
- 같은 페이지로 다시 오면 **매번 fetch** — 네트워크·로딩 UX 낭비
- TanStack Query는 `queryKey` 기준 **메모리 캐시** + `staleTime`으로 재사용

### 2) 중복 요청

- `ProductList`와 `ProductHeader`가 각각 같은 API를 `useEffect`로 호출하면 **동일 요청이 N번** 발생
- Query는 같은 `queryKey` 요청을 **dedupe**하고 in-flight 공유

### 3) 클라이언트 간 불일치

- 컴포넌트 A는 `useState`로 products, B도 별도 `useState` → 한쪽만 갱신되면 **화면마다 다른 데이터**
- 전역 cache(source of truth)가 없어 **동기화 책임이 개발자**에게 있음

### 4) 그 외 한계

- 로딩/에러/재시도/백그라운드 refetch/낙관적 업데이트를 **매 fetch마다 수동 구현**
- race condition: 느린 요청이 나중에 도착해 **최신 데이터를 덮어씀** (cleanup·abort 없을 때)
- 서버 데이터는 **다른 사용자·탭·시간**에 따라 변함 — 클라이언트 전역 state와 성격이 다름

### 개선 — TanStack Query

```tsx
function ProductList() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then((res) => res.json()),
  });

  if (isLoading) return <div>로딩 중...</div>;
  return <ul>{products?.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

- 캐시·중복 제거·stale/fresh·invalidate가 **라이브러리 책임**
- Zustand/Redux는 **클라이언트 UI state**, TanStack Query는 **서버 state** — 역할 분리가 실무 패턴

---

## 선택 가이드 (요약)

```
1. 한 컴포넌트만 쓰나? → useState
2. 여러 컴포넌트 공유?
   └─ 자주 안 바뀜 → Context API
   └─ 자주 바뀜 / 필드 많음 → Zustand
   └─ 파생 state·atom 그래프 많음 → Jotai
3. API에서 가져온 데이터? → TanStack Query (useEffect + useState 지양)
4. 복잡한 클라이언트 전역 + DevTools → Redux Toolkit
```

chapter08처럼 **역할별로 도구를 조합**하는 것이 한 라이브러리만 고집하는 것보다 유지보수에 유리함
