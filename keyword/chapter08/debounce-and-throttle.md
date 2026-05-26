# Debounce & Throttle

## 왜 필요한가

브라우저 이벤트(키 입력, 스크롤, 리사이즈, 마우스 이동)는 짧은 시간 안에 수십~수백 번 발생할 수 있음

핸들러가 매 이벤트마다 실행되면 다음과 같은 문제가 생김

- **불필요한 네트워크 요청** — 검색어 한 글자마다 API 호출
- **렌더링 부하** — 스크롤 핸들러가 1초에 60번 실행되며 레이아웃 계산 반복
- **배터리·CPU 낭비** — 특히 모바일 환경에서 두드러짐

이를 해결하는 두 가지 전략이 **Debounce**와 **Throttle**임

---

## Debounce

### 개념

이벤트가 연달아 발생하는 동안에는 실행을 미루다가, **마지막 이벤트 이후 지정한 시간(delay)이 지나면 딱 한 번 실행**하는 기법

- 새 이벤트가 들어올 때마다 **기존 타이머를 취소하고 새 타이머를 시작**함
- 핵심: **"타이머 리셋"**
- 실행 결과가 **마지막 입력 기준으로 결정**되는 상황에 적합

### 시각적 흐름 (delay = 300ms)

```
시간(ms)   0     100   200    300   400   500
키 입력    A─────B─────C
타이머        ↻리셋   ↻리셋   └────대기 300ms────┘
실행                                         ⚡ (1회)
```

- A(0ms), B(100ms), C(200ms) 모두 300ms 안에 이어져 타이머가 매번 리셋됨
- C 이후 300ms 동안 추가 입력 없음 → 500ms에 단 한 번 실행

### Trailing vs Leading

| 모드 | 실행 시점 | 특징 |
|------|----------|------|
| **trailing** (기본) | 마지막 이벤트 후 delay 경과 시 | 입력이 끝난 뒤 응답 |
| **leading** | 첫 이벤트 즉시 실행, 이후 delay 동안 추가 실행 억제 | 즉각 반응 + 연타 방지 |
| **leading + trailing** | 첫 이벤트와 마지막 이벤트 모두 실행 | 시작과 끝 모두 처리 |

> Lodash `_.debounce`는 `{ leading: true, trailing: false }` 옵션으로 모드를 바꿀 수 있음

### maxWait 옵션

```ts
debounce(fn, 300, { maxWait: 1000 })
```

이벤트가 **계속 들어와도 최대 1000ms 안에는 반드시 한 번 실행**되도록 보장

입력이 끊이지 않으면 영영 실행되지 않는 상황을 방지함

### 직접 구현

```ts
function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: T) {
    if (timerId !== null) clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}
```

### React에서 사용: `useDebounce` 훅

```tsx
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // 클린업: 다음 렌더 전에 타이머 취소
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

**사용 예시 — 검색 자동완성**

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(`/api/search?q=${debouncedQuery}`);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

- `query`가 바뀔 때마다 UI는 즉시 반응(입력창 내용 갱신)
- 실제 API 호출은 300ms 동안 입력이 멈춰야 발생 → `"apple"` 입력 시 5회 → 1회로 감소

---

## Throttle

### 개념

이벤트가 아무리 자주 발생해도 **지정한 주기(interval)마다 최대 한 번씩만 실행**되도록 제한하는 기법

- 한 번 실행하면 interval 동안 **쿨다운(cooldown)** 이 걸림
- 핵심: **"쿨다운 윈도우"**
- 이벤트가 진행 중에도 **주기적으로 반응**해야 할 때 적합

### 시각적 흐름 (interval = 300ms)

```
시간(ms)   0     100   200   300   400   500   600   700
이벤트     A─────B─────C──────────D────────────E
쿨다운     │←──── 300ms 무시 ────→│←─ 300ms ──→│
실행       ⚡                      ⚡            ⚡
```

- A(0ms) → 즉시 실행, 300ms 쿨다운 시작
- B(100ms), C(200ms) → 쿨다운 구간이라 **무시**
- D(400ms) → 쿨다운 종료 → **재실행**
- E(700ms) → 쿨다운 종료 → **재실행**

### 직접 구현

```ts
function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  interval: number,
): (...args: T) => void {
  let lastTime = 0;

  return function (...args: T) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn(...args);
    }
  };
}
```

### React에서 사용: `useThrottle` 훅

```tsx
import { useRef, useCallback } from 'react';

function useThrottle<T extends unknown[]>(
  fn: (...args: T) => void,
  interval: number,
): (...args: T) => void {
  const lastTimeRef = useRef(0);

  return useCallback(
    (...args: T) => {
      const now = Date.now();
      if (now - lastTimeRef.current >= interval) {
        lastTimeRef.current = now;
        fn(...args);
      }
    },
    [fn, interval],
  );
}

export default useThrottle;
```

**사용 예시 — 무한 스크롤 트리거**

```tsx
function InfiniteList() {
  const { fetchNextPage, hasNextPage } = useInfiniteQuery(/* ... */);

  const handleScroll = useThrottle(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
    if (nearBottom && hasNextPage) fetchNextPage();
  }, 300);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div>{/* 목록 렌더링 */}</div>;
}
```

- 스크롤 이벤트는 초당 수십 번 발생하지만, `fetchNextPage`는 **300ms마다 최대 1회** 호출됨

---

## Debounce vs Throttle 비교

| 항목 | Debounce | Throttle |
|------|----------|----------|
| **실행 시점** | 마지막 이벤트 후 delay 경과 시 | 주기(interval)마다 최대 1회 |
| **이벤트 도중** | 실행 없음 (계속 미룸) | 주기마다 실행 |
| **사용자 체감** | 입력 끝나면 응답 | 도중에도 반응 |
| **검색 자동완성** | ✅ 적합 | ❌ 중간 글자 무시됨 |
| **스크롤 / 리사이즈** | ⚠️ 멈춰야만 반응 | ✅ 적합 |
| **무한 스크롤 트리거** | ⚠️ 한 박자 늦음 | ✅ 적합 |
| **버튼 연타 방지** | ✅ (leading 모드) | ✅ |
| **maxWait 옵션** | ✅ lodash 지원 | — |
| **입력 안 멈추면** | 영영 실행 안 될 수 있음 | 주기마다 꼬박꼬박 실행됨 |

> **결정 팁**: "마지막 값만 중요하다" → Debounce / "도중에도 반응해야 한다" → Throttle

---

## 라이브러리 활용

직접 구현 대신 **lodash**, **es-toolkit** 등을 쓰면 edge case까지 처리된 구현을 활용할 수 있음

```ts
import { debounce, throttle } from 'lodash-es';

const debouncedSearch = debounce((q: string) => fetch(`/api/search?q=${q}`), 300);
const throttledScroll = throttle(() => console.log(window.scrollY), 300);
```

> lodash는 트리쉐이킹을 위해 `lodash-es` 패키지를 사용하는 것이 권장됨

---

## React에서 주의할 점

### 컴포넌트 외부에서 생성

함수형 컴포넌트 안에서 `debounce(fn, 300)`을 직접 호출하면 **렌더마다 새 함수**가 생성되어 타이머가 매번 리셋됨

```tsx
// ❌ 렌더마다 새 debounce 함수 생성
function Bad() {
  const handler = debounce(() => fetch('/api'), 300); // 매 렌더에 재생성됨
  return <input onChange={handler} />;
}

// ✅ useCallback 또는 useRef로 참조 고정
function Good() {
  const handler = useCallback(
    debounce(() => fetch('/api'), 300),
    [],
  );
  return <input onChange={handler} />;
}
```

### 클린업 (메모리 누수 방지)

컴포넌트 언마운트 시 pending 타이머가 남아 있으면 메모리 누수 또는 상태 업데이트 경고가 발생함

```tsx
useEffect(() => {
  const debouncedFn = debounce(fn, 300);
  element.addEventListener('input', debouncedFn);
  return () => {
    debouncedFn.cancel(); // lodash 제공 메서드로 pending 타이머 취소
    element.removeEventListener('input', debouncedFn);
  };
}, []);
```

---

## 직접 구현 vs 자동완성 비교 정리 (🍠 과제)

### Debounce 개념 정리

- 이벤트 마지막 발생 후 일정 시간 동안 추가 발생이 없으면 그제서야 실행
- 구현 핵심: `setTimeout` + `clearTimeout`
- 사용처: 검색 자동완성, 입력 폼 검증, 창 리사이즈 후 레이아웃 재계산

### Debounce 코드

```ts
function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: T) {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

// 사용
const debouncedSearch = debounce((query: string) => {
  console.log('검색:', query);
}, 300);

document.querySelector('input')?.addEventListener('input', (e) => {
  debouncedSearch((e.target as HTMLInputElement).value);
});
```

### Throttle 개념 정리

- 이벤트 발생 빈도에 관계없이 지정된 주기 안에서 최대 1회만 실행
- 구현 핵심: 마지막 실행 시각 기록 후 `Date.now() - lastTime >= interval` 조건 확인
- 사용처: 스크롤, 리사이즈, 드래그, 마우스 이동, 무한 스크롤 트리거

### Throttle 코드

```ts
function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  interval: number,
): (...args: T) => void {
  let lastTime = 0;

  return function (...args: T) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn(...args);
    }
  };
}

// 사용
const throttledScroll = throttle(() => {
  console.log('스크롤 위치:', window.scrollY);
}, 300);

window.addEventListener('scroll', throttledScroll);
```

---

## 참고 자료

- [MDN — setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [MDN — clearTimeout](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)
- [Lodash — _.debounce](https://lodash.com/docs/#debounce)
- [Lodash — _.throttle](https://lodash.com/docs/#throttle)
- [Debounce vs Throttle: Definitive Visual Guide — kettanaito.com](https://kettanaito.com/blog/debounce-vs-throttle)
- [WHATWG HTML Living Standard — event loop processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)
- [React Docs — useEffect cleanup](https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
