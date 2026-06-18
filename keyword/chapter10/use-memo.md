# useMemo

> 참고: [useMemo 공식 문서](https://react.dev/reference/react/useMemo)

---

## useMemo가 무엇인지?

`useMemo`는 **계산 결과(값)를 메모이제이션**하는 React Hook이다.

```tsx
const cachedValue = useMemo(calculateValue, dependencies);
```

- `calculateValue` 함수를 실행한 **반환값**을 캐시한다.
- `dependencies`가 이전 렌더와 **모두 같으면** 이전 결과를 **그대로 재사용**한다.
- 하나라도 바뀌면 함수를 다시 실행하고 새 결과를 반환한다.

`useCallback`이 **함수 참조**를, `useMemo`는 **값(객체·배열·숫자·문자열 등) 참조**를 유지한다고 보면 된다.

```tsx
// useCallback — 함수 자체를 캐시
const fn = useCallback(() => doSomething(a, b), [a, b]);

// useMemo — 함수 실행 결과를 캐시
const value = useMemo(() => doSomething(a, b), [a, b]);
```

---

## 왜 useMemo를 사용하는지?

### 1. 비용 큰 계산 스킵

필터링·정렬·집계처럼 **연산이 무거운** 로직을 매 렌더마다 다시 실행하지 않게 한다.

```tsx
const filteredLps = useMemo(
  () => lps.filter((lp) => lp.title.includes(query)),
  [lps, query],
);
```

### 2. 참조 안정화 (memo / useEffect와 연계)

객체·배열을 매 렌더마다 새로 만들면, 참조가 바뀌어 **memo된 자식이나 useEffect가 불필요하게 재실행**된다.

```tsx
const contextValue = useMemo(
  () => ({ user, login, logout }),
  [user, login, logout],
);

return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
```

### 3. 파생 상태(derived state) 표현

원본 state에서 **계산으로만 얻을 수 있는 값**을 명시적으로 분리한다.

```tsx
const canSubmit = useMemo(
  () => loginSchema.safeParse(values).success,
  [values],
);
```

### 이득 vs 오버헤드

| 이득 | 오버헤드 |
|---|---|
| 무거운 계산 1회만 실행 | deps 비교 + 캐시 저장 |
| 객체/배열 참조 유지 | 가벼운 계산에는 오히려 손해 |
| Context value 안정화 | 남용 시 코드 복잡도 증가 |

React 공식 문서: **“useMemo는 성능 최적화 도구이지만, 모든 계산에 쓸 필요는 없다.”**

---

## useMemo 기본 사용법

```tsx
import { useMemo, useState } from 'react';

function LpsPage() {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const { data } = useInfiniteQuery({ /* ... */ });

  // pages 배열을 flatMap할 때마다 새 배열이 생기므로, data/sort 기준으로 메모
  const lps = useMemo(
    () => data?.pages.flatMap((page) => page?.data ?? []) ?? [],
    [data],
  );

  return (/* ... */);
}
```

### deps 배열 규칙

- `calculateValue` **안에서 읽는** reactive value(state, props, context, 다른 hook 결과)를 deps에 넣는다.
- `useCallback`과 동일하게 `exhaustive-deps` 규칙을 따른다.
- deps가 비어 있으면 **마운트 시 1회만** 계산하고 이후 항상 같은 결과를 반환한다.

### 의존성 변경 시

```tsx
const sorted = useMemo(
  () => [...items].sort((a, b) => a.date - b.date),
  [items, sortOrder],
);
```

`items`나 `sortOrder`가 바뀔 때만 정렬을 다시 수행한다.

---

## useMemo에서 중요한 개념

### 1. 참조 동일성

```tsx
const options = useMemo(() => ({ staleTime: 60_000 }), []);
// options 참조는 렌더마다 같음 → useQuery options prop 안정

const options = { staleTime: 60_000 };
// 매 렌더 새 객체 → 참조 매번 변경
```

### 2. useCallback과의 관계

```tsx
// 아래 두 코드는 거의 동일한 효과
const fn = useCallback(() => greet(a, b), [a, b]);
const fn = useMemo(() => () => greet(a, b), [a, b]);
```

함수를 메모할 때는 **`useCallback`이 더 의도가 명확**하다.

### 3. useMemo ≠ “값을 기억해 두는 저장소”

`useMemo`는 **렌더 간** 결과를 재사용하는 것이지, 영구 저장소가 아니다. 컴포넌트가 언마운트되면 캐시도 사라진다.

영구 저장이 필요하면 `useRef`, 외부 store(zustand, Redux), 서버 캐시(TanStack Query) 등을 사용한다.

### 4. React Compiler (참고)

React 19+ / React Compiler 환경에서는 컴파일러가 자동으로 메모이제이션을 적용할 수 있다. 그래도 **deps·참조 동일성 개념**은 이해해 두는 것이 중요하다.

---

## useMemo 실전 예시

### 1. 무한 스크롤 flatMap

TanStack Query `useInfiniteQuery`의 `data.pages`를 flatMap하면 **매 렌더 새 배열**이 생긴다.

```tsx
const lps = useMemo(
  () => data?.pages.flatMap((page) => page?.data ?? []) ?? [],
  [data],
);
```

`data` 참조가 같으면 `lps`도 같은 배열 참조를 유지한다.

### 2. Context value 메모이제이션

```tsx
const value = useMemo(
  () => ({
    loggedIn,
    userName,
    login,
    logout,
    updateUserName,
  }),
  [loggedIn, userName, login, logout, updateUserName],
);

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

`value` 객체 참조가 안정적이면 Context consumer의 **불필요한 리렌더**를 줄일 수 있다.

### 3. 폼 유효성(canSubmit) 파생

```tsx
const canSubmit = useMemo(
  () => signupSchema.safeParse(values).success,
  [values],
);
```

매 입력마다 schema parse를 실행하지만, `values`가 같으면 결과 참조·불리언을 재사용한다.

### 4. 필터 + 정렬 파이프라인

```tsx
const visibleTodos = useMemo(() => {
  return todos
    .filter((t) => (showDone ? true : !t.done))
    .sort((a, b) => a.createdAt - b.createdAt);
}, [todos, showDone]);
```

`todos`나 `showDone`이 바뀔 때만 filter/sort를 다시 실행한다.

### 5. useMemo를 쓰지 않아도 되는 경우

```tsx
// ❌ 과한 useMemo — 단순 문자열 연결
const label = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);

// ✅ 그냥 계산해도 충분
const label = `${firstName} ${lastName}`;
```

---

## useCallback vs useMemo vs memo 한눈에

| API | 메모 대상 | 주요 용도 |
|---|---|---|
| `useCallback` | 함수 | 콜백 참조 유지, effect deps 안정화 |
| `useMemo` | 값(계산 결과) | 무거운 계산, 객체/배열 참조 유지 |
| `memo` | 컴포넌트 | props 같을 때 리렌더 스킵 |

세 가지는 **참조 동일성**이라는 같은 기반 위에서 동작한다.

---

## 🍠 실습 2. 기록하기

- **깃허브 주소**: _(본인 레포 URL 작성)_
- **실습 내용**: `AuthContext`의 `value`에 `useMemo` 적용, 또는 `LpsPage`의 `lps` flatMap에 `useMemo` 적용 후 Profiler 비교
- **실행 영상**: _(Before/After 캡처 또는 영상 링크 작성)_
