# Zustand

> 참고
>
> - [Zustand GitHub README](https://github.com/pmndrs/zustand/blob/main/README.md)
> - [Zustand Live Demo](https://zustand-demo.pmnd.rs/)
> - [Beginner TypeScript Guide | Zustand Docs](https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/beginner-typescript.md)

---

## Zustand란?

독일어 “상태(Zustand)”에서 이름을 딴, **작고 빠른** React용 전역 상태 라이브러리임

- **Hook 기반 API** — store 자체가 `useStore` Hook
- **Provider 불필요** (기본 사용) — 컴포넌트 어디서든 import해서 사용
- **selector**로 필요한 slice만 구독 → 불필요한 리렌더 감소
- 번들 크기 약 **1KB** 수준 (공식 README / 커뮤니티 벤치마크)

---

## 왜 사용할까?

| 장점 | 설명 |
| --- | --- |
| 보일러플레이트 적음 | Redux 대비 action/reducer/store 설정이 짧음 |
| 선택적 구독 | `(state) => state.user`처럼 필요한 필드만 구독 |
| Provider 없음 | Context Provider Hell 없이 module-level store |
| React 밖에서도 접근 | `getState()`, `setState()`, `subscribe()` |
| TypeScript | `create<State>()(...)` curried form으로 타입 추론 우수 |
| 미들웨어 | `persist`, `devtools`, `immer` 등 |

Context API와 달리 **value 전체 구독**이 아니라, selector가 반환한 값만 비교함 (`useSyncExternalStore` 기반)

---

## 기본 사용법

### 1) Store 만들기

```tsx
import { create } from 'zustand';

interface BearStore {
  bears: number;
  increase: () => void;
  removeAll: () => void;
}

export const useBearStore = create<BearStore>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  removeAll: () => set({ bears: 0 }),
}));
```

- `set` — partial state를 **merge** (기본). 두 번째 인자 `true`면 replace
- `get` — action 안에서 현재 state 읽기

```tsx
const useSoundStore = create((set, get) => ({
  sound: 'grunt',
  action: () => {
    const sound = get().sound;
    // sound 기반 로직...
  },
}));
```

### 2) 컴포넌트에서 사용

```tsx
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  const increase = useBearStore((state) => state.increase);

  return (
    <div>
      <p>{bears} bears</p>
      <button onClick={increase}>+1</button>
    </div>
  );
}
```

여러 필드를 객체로 selector에 넣을 때는 **매 렌더마다 새 객체**가 생기면 불필요한 리렌더가 날 수 있음 → `useShallow` 사용 권장

```tsx
import { useShallow } from 'zustand/react/shallow';

const { bears, increase } = useBearStore(
  useShallow((state) => ({ bears: state.bears, increase: state.increase })),
);
```

---

## 중요한 개념

### set

- `set({ bears: 1 })` — 기존 state에 merge
- `set({ bears: 0 }, true)` — state **전체 교체** (actions 함수 등 날아갈 수 있어 주의)
- `set((state) => ({ bears: state.bears + 1 }))` — 함수형 업데이트

### get

action·비동기 로직 안에서 **최신 state**를 읽을 때 사용

```tsx
fetchItems: async () => {
  const { page } = get();
  const data = await fetchPage(page);
  set({ items: data });
},
```

### 선택적 구독 (selector)

```tsx
// user만 구독 — theme 변경 시 이 컴포넌트는 리렌더 안 됨
const user = useUserStore((state) => state.user);

// theme만 구독
const theme = useUserStore((state) => state.theme);
```

내부적으로 `useSyncExternalStore` + `Object.is` 비교로 selector 결과가 바뀔 때만 리렌더

---

## 객체 상태 관리 예시

```tsx
interface User {
  name: string;
  role: string;
}

interface UserStore {
  user: User | null;
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}));
```

---

## 비동기 로직 예시

Zustand는 store 안에서 async action을 자유롭게 정의할 수 있음

```tsx
interface TodoStore {
  todos: string[];
  loading: boolean;
  fetchTodos: () => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  fetchTodos: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/todos');
      const todos = await res.json();
      set({ todos, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
```

서버 데이터 **캐싱·동기화·중복 요청 제거**까지 필요하면 TanStack Query가 더 적합함 (클라이언트 UI state와 분리)

---

## Persist 미들웨어

localStorage 등에 state를 자동 저장

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: 'auth-storage' },
  ),
);
```

---

## Immer 미들웨어

중첩 객체 업데이트를 mutable 문법으로 작성

```tsx
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface NestedStore {
  user: { profile: { name: string } };
  rename: (name: string) => void;
}

export const useNestedStore = create<NestedStore>()(
  immer((set) => ({
    user: { profile: { name: '' } },
    rename: (name) =>
      set((state) => {
        state.user.profile.name = name;
      }),
  })),
);
```

---

## Zustand vs Context API

| 항목 | Context API | Zustand |
| --- | --- | --- |
| 구독 단위 | Provider `value` **전체** | selector로 **일부** |
| Provider | 필수 | 기본 불필요 |
| 리렌더 | value 참조 변경 → 모든 consumer 재평가 | selector 결과 변경 시만 |
| 외부 접근 | 어려움 | `getState()` / `subscribe()` |
| 적합한 경우 | 가끔 바뀌는 전역 값 (테마, locale) | 자주 바뀌거나 필드가 많은 전역 state |

Context 분리·`useMemo`로 value 안정화해도 **필드 단위 구독**은 기본 제공하지 않음

---

## React Context와 함께 쓰기 (스코프 store)

테스트·SSR에서 store를 트리별로 격리하려면 vanilla store + Context 패턴 사용 (v4+, 공식 README)

```tsx
import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';

type CounterStore = { count: number; inc: () => void };

const CounterContext = createContext<ReturnType<typeof createStore<CounterStore>> | null>(null);

function CounterProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() =>
    createStore<CounterStore>((set) => ({
      count: 0,
      inc: () => set((s) => ({ count: s.count + 1 })),
    })),
  );
  return <CounterContext.Provider value={store}>{children}</CounterContext.Provider>;
}

function useCounterStore<T>(selector: (s: CounterStore) => T) {
  const store = useContext(CounterContext);
  if (!store) throw new Error('CounterProvider 필요');
  return useStore(store, selector);
}
```

---

## 체크리스트

- Context로 value 전체 구독 때문에 리렌더가 문제인가?
- selector가 **원시값** 또는 `useShallow`로 안정적인가?
- 서버 API 데이터인가 → Zustand보다 TanStack Query 우선 검토
- persist/devtools가 필요한가 → middleware 조합
