# React의 동작 원리

## SPA (Single Page Application)

- SPA는 하나의 HTML 페이지를 기반으로, 페이지 전환 시 전체 문서를 새로 로드하지 않고 필요한 UI만 동적으로 갱신하는 방식임
- 클라이언트 측 JavaScript가 라우팅과 화면 갱신을 담당하므로, 페이지 전환이 빠르고 사용자 경험이 자연스러움
- 다만 초기 로딩 시 JavaScript 번들 크기가 커질 수 있고, SEO(검색 엔진 최적화)나 초기 렌더링 성능 측면에서 추가 대응이 필요함
- 이 때문에 실서비스에서는 CSR(Client-Side Rendering) 외에 SSR(Server-Side Rendering), SSG(Static Site Generation) 등을 조합하여 사용하기도 함
- React는 SPA에서 UI를 구성하고 업데이트하는 역할을 담당하며, 라우팅은 React Router 같은 별도 라이브러리를 사용함

## React = UI 라이브러리

- React는 컴포넌트 기반 UI를 구성하기 위한 라이브러리로, DOM 업데이트와 상태 기반 렌더링에 집중함
- 프레임워크와 달리 다음 기능을 기본 제공하지 않음
  - 라우팅
  - 전역 상태 관리
  - 데이터 패칭 전략
  - 빌드 및 배포 구조
- 따라서 개발자는 필요한 도구를 직접 선택하여 조합해야 함

| 역할 | 라이브러리 예시 |
|---|---|
| 라우팅 | React Router |
| 상태 관리 | Zustand, Redux, Jotai, Recoil |
| 데이터 패칭 | TanStack Query |
| 번들러 | Vite, Webpack, Rollup |

- 높은 유연성을 가지지만, 초기 설계 시 기술 선택에 대한 부담이 존재함

## 함수형 컴포넌트와 데이터 흐름

### 함수형 컴포넌트 (Functional Component)

- React에서 UI를 정의하는 기본 단위임
- JavaScript 함수 형태로 작성되며, props를 인자로 받아 JSX를 반환함
- React는 이 함수를 호출하여 React Element 트리(Virtual DOM)를 생성함

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}
```

### Props

- 부모 컴포넌트가 자식 컴포넌트에게 전달하는 읽기 전용(immutable) 데이터임
- 자식 컴포넌트에서 직접 변경할 수 없음
- 데이터 흐름은 항상 부모에서 자식 방향, 즉 단방향 데이터 흐름(Unidirectional Data Flow)을 따름

```tsx
<Greeting name="Haewon" />
```

- 컴포넌트는 동일한 props에 대해 동일한 UI를 반환하는 순수 함수(pure function)처럼 동작해야 함

### State

- 컴포넌트 내부에서 관리되는, 시간에 따라 변하는 데이터임
- `useState` Hook을 통해 선언하고, setter 함수를 통해 업데이트함

```tsx
const [count, setCount] = useState(0);
```

- state가 변경되면 React는 해당 컴포넌트를 다시 실행(리렌더링)하여 UI를 업데이트함
- state는 직접 수정하지 않고, 반드시 setter 함수를 통해 불변성(immutability)을 유지해야 함

```tsx
// 잘못된 방식: 직접 변경
count = 1;

// 올바른 방식: setter 함수 사용
setCount(1);
```

### 단방향 데이터 흐름 (Unidirectional Data Flow)

React는 단방향 데이터 흐름을 따름

```
부모 --[props]--> 자식 --[이벤트]--> 부모의 state 변경 --[props]--> 자식 리렌더링
```

- 데이터의 흐름이 예측 가능하고 디버깅이 용이함
- 상태는 항상 상위에서 하위로 전달됨

## 렌더링 과정

### 리렌더링 트리거 조건

React는 다음 조건에서 컴포넌트를 다시 실행(리렌더링)함

1. **state 변경** -- `setState` 호출 시
2. **props 변경** -- 부모 컴포넌트가 리렌더링되어 새로운 props를 전달할 때
3. **Context 값 변경** -- 구독 중인 Context의 값이 변경될 때
4. **key 변경** -- 컴포넌트의 key가 바뀌면 기존 인스턴스를 언마운트(unmount)하고 새로 마운트(mount)함

> 리렌더링은 컴포넌트 함수의 재실행을 의미하며, 실제 DOM 전체를 다시 그리는 것이 아님
> Render Phase에서 새로운 Virtual DOM을 생성하고, Diff 결과 변경이 있을 때만 실제 DOM에 반영(Commit)함

### Render Phase와 Commit Phase

React의 렌더링은 크게 두 단계로 나뉨

**Render Phase (렌더 단계)**

- 컴포넌트 함수를 실행하여 새로운 React Element 트리(Virtual DOM)를 생성함
- 이전 트리와 비교(Diff)하여 변경 사항을 계산함
- 이 단계는 순수하게 계산만 수행하며, 부수 효과(side effect)가 없어야 함
- Concurrent Rendering에서는 이 단계가 중단(interrupt)될 수 있음

**Commit Phase (커밋 단계)**

- Diff 결과를 바탕으로 변경된 부분만 실제 DOM에 반영함
- DOM 업데이트 이후 `useLayoutEffect`가 동기적으로 실행됨
- 브라우저 페인트 이후 `useEffect`가 비동기적으로 실행됨
- 이 단계는 중단될 수 없음

### Automatic Batching (자동 배칭)

- React 18부터 이벤트 핸들러, Promise, setTimeout 등 모든 컨텍스트에서 여러 `setState` 호출을 하나의 렌더링으로 묶어 처리함
- 이를 통해 불필요한 중간 리렌더링을 줄여 성능을 향상시킴

```tsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 18: 위 두 setState가 하나의 리렌더링으로 배칭됨
}
```

## Virtual DOM과 Reconciliation

### Virtual DOM (가상 DOM)

- 실제 DOM을 직접 조작하는 대신, UI 상태를 메모리 상의 JavaScript 객체 트리로 표현한 것임
- 컴포넌트가 렌더링되면 React는 JSX를 기반으로 React Element 트리(Virtual DOM)를 생성함
- 실제 DOM보다 가볍고 빠르게 비교할 수 있음

### Reconciliation (재조정)

state나 props가 변경되면 React는 다음 과정을 수행함

1. 새로운 Virtual DOM 트리를 생성함
2. 이전 Virtual DOM 트리와 비교(Diff)함
3. 변경 사항만 실제 DOM에 반영함

이 전체 과정을 **Reconciliation(재조정)**이라고 함

### Diffing Algorithm

React는 두 트리를 비교할 때 O(n) 시간 복잡도를 달성하기 위해 두 가지 휴리스틱을 사용함

1. **다른 타입의 엘리먼트는 다른 트리를 생성함**
   루트 엘리먼트의 타입이 다르면(예: `<div>` -> `<section>`) 이전 트리를 완전히 제거하고 새로 구축함

2. **`key` prop을 통해 자식 엘리먼트의 동일성을 판단함**
   같은 타입의 엘리먼트는 속성(attribute)만 비교하여 변경된 부분만 업데이트함

### Key의 역할

- `key`는 리스트 내 엘리먼트를 식별하기 위한 고유 식별자임
- React는 `key`를 기준으로 이전 트리와 새 트리에서 동일한 엘리먼트를 매칭함

```tsx
items.map((item) => <li key={item.id}>{item.name}</li>);
```

- `key`가 없으면 배열 인덱스를 기반으로 비교하므로, 삽입/삭제/재정렬 시 잘못된 DOM 재사용이 발생할 수 있음
- 안정적인 고유 값(예: DB id)을 `key`로 사용해야 함
- `key`가 변경되면 React는 해당 컴포넌트를 완전히 언마운트한 뒤 새로 마운트함. 이를 이용해 컴포넌트의 state를 의도적으로 초기화할 수도 있음

## 동시성 렌더링 (Concurrent Rendering)

### 개념

- React 18에서 도입된 렌더링 방식으로, 렌더링 작업을 여러 단위로 분할하고 우선순위에 따라 스케줄링하는 메커니즘임
- "동시에 실행된다"는 의미가 아니라, 렌더링 작업을 **중단(interrupt)**하고 더 중요한 작업을 먼저 처리할 수 있다는 의미임
- 사용자 경험(UX)을 개선하기 위한 스케줄링 전략임

### 스케줄링과 우선순위

React는 업데이트를 우선순위(priority)에 따라 분류함

- **긴급 업데이트(urgent update)**: 사용자 입력, 클릭 등 즉각적인 반응이 필요한 업데이트
- **전환 업데이트(transition update)**: 검색 결과 필터링, 대규모 리스트 렌더링 등 약간의 지연이 허용되는 업데이트

긴 렌더링 작업이 진행 중이더라도 긴급 업데이트가 발생하면 기존 작업을 중단하고 우선 처리함

### Transition API

**`startTransition`**

특정 상태 업데이트를 전환 업데이트(non-urgent update)로 표시하는 API임

```tsx
import { startTransition } from 'react';

startTransition(() => {
  setSearchResults(filteredData);
});
```

**`useTransition`**

전환의 대기 상태(pending)를 함께 관리할 수 있는 Hook임

```tsx
const [isPending, startTransition] = useTransition();
```

- 긴급 업데이트(예: 입력 필드 반영)는 즉시 처리되고, 전환 업데이트(예: 검색 결과 리스트)는 긴급 업데이트가 끝난 후 처리됨
- 이를 통해 무거운 렌더링 중에도 사용자 입력의 반응성을 유지할 수 있음

## Suspense

### 개념

- `<Suspense>`는 자식 컴포넌트의 비동기 작업(데이터 로딩, 코드 스플리팅 등)이 완료되기 전까지 fallback UI를 선언적으로 지정할 수 있게 해주는 컴포넌트임
- 로딩 상태를 명령적으로(`if (isLoading) return <Spinner />`) 처리하는 대신, 컴포넌트 트리 구조 안에서 선언적으로 표현할 수 있게 해줌

```tsx
<Suspense fallback={<Loading />}>
  <SomeAsyncComponent />
</Suspense>
```

### 동작 원리

- 자식 컴포넌트가 렌더링 도중 아직 준비되지 않은 데이터에 접근하면, React에게 "아직 준비 안 됨"을 알림(suspend)
- React는 해당 컴포넌트의 렌더링을 중단하고, 가장 가까운 `<Suspense>` boundary를 찾아 `fallback`을 렌더링함
- 비동기 작업이 완료되면 React는 suspended된 컴포넌트를 다시 렌더링함

### 코드 스플리팅과 `React.lazy`

- `React.lazy`를 사용하면 컴포넌트를 동적으로 import하여 번들을 분리할 수 있음
- lazy로 감싼 컴포넌트는 반드시 `<Suspense>` 안에서 렌더링해야 함

```tsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 데이터 패칭과 Suspense

- React 18부터 Suspense는 코드 스플리팅뿐만 아니라 데이터 패칭에도 사용할 수 있도록 확장됨
- 다만 React 자체가 데이터 패칭 라이브러리를 제공하는 것이 아니라, Suspense 프로토콜을 지원하는 프레임워크나 라이브러리(Relay, Next.js, TanStack Query 등)와 함께 사용하는 구조임

### Suspense와 Concurrent Rendering의 관계

- Suspense는 Concurrent Rendering과 결합하여 더 효과적으로 동작함
- Transition 안에서 발생한 suspend는 이미 보이고 있는 UI를 fallback으로 즉시 대체하지 않고, 이전 UI를 유지하면서 새 콘텐츠가 준비될 때까지 기다림
- 이를 통해 불필요한 로딩 스피너 노출을 줄이고, 더 부드러운 화면 전환을 제공함

```tsx
const [tab, setTab] = useState('home');

function handleTabChange(nextTab: string) {
  startTransition(() => {
    setTab(nextTab);
  });
}

// Transition 안에서 탭이 바뀌면, 새 탭 콘텐츠가 준비될 때까지
// 이전 탭 UI를 유지하고 fallback을 바로 보여주지 않음
```

### React 19에서의 Suspense 개선

**Sibling Pre-rendering 제거**

- React 18에서는 Suspense boundary 안의 컴포넌트가 suspend되더라도, 그 형제(sibling) 컴포넌트들을 미리 렌더링(pre-warm)한 뒤에 fallback을 commit했음
- React 19에서는 컴포넌트가 suspend되면 형제 컴포넌트의 렌더링을 기다리지 않고 즉시 fallback을 commit함
- fallback이 commit된 이후에 형제 컴포넌트들의 pre-render를 백그라운드에서 수행함
- 결과적으로 사용자가 fallback UI를 더 빠르게 볼 수 있게 됨

**`use` Hook을 통한 Suspense 통합**

- React 19에서 도입된 `use` Hook은 렌더링 중에 Promise를 읽을 수 있게 해줌
- Promise가 아직 resolve되지 않았으면 컴포넌트가 suspend되고, resolve되면 그 값을 반환함
- 기존에 Suspense를 지원하는 별도 라이브러리가 필요했던 데이터 패칭 패턴을 더 직관적으로 작성할 수 있게 됨

```tsx
import { use, Suspense } from 'react';

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userPromise={fetchUser()} />
    </Suspense>
  );
}
```

- `use`는 조건문이나 반복문 안에서도 호출할 수 있다는 점에서 기존 Hook의 규칙과 다름
- Promise 외에 Context를 읽는 용도로도 사용할 수 있음

## 성능 최적화 (Memoization)

React는 기본적으로 부모가 리렌더링되면 모든 자식도 리렌더링함. 필요한 경우 다음 API를 사용하여 불필요한 리렌더링을 방지할 수 있음

| API | 용도 |
|---|---|
| `React.memo` | props가 변경되지 않으면 컴포넌트의 리렌더링을 건너뜀 |
| `useMemo` | 의존성 배열(deps)이 변경되지 않으면 계산 결과를 재사용함 |
| `useCallback` | 의존성 배열(deps)이 변경되지 않으면 함수 참조를 재사용함 |

```tsx
const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b]);
const memoizedFn = useCallback(() => handleClick(id), [id]);
```

- 불필요한 최적화는 오히려 메모리 사용량과 코드 복잡도를 증가시킴
- 반드시 **측정 -> 병목 확인 -> 최적화 적용** 순서를 따라야 함

## StrictMode

- React의 개발 모드 전용 도구로, 컴포넌트의 일부 동작을 의도적으로 두 번 호출하여 불순한 렌더링이나 부수 효과(side effect) 문제를 조기에 발견하기 위한 장치임
- 프로덕션 빌드에서는 동작하지 않으므로 실서비스에 영향을 주지 않음
- 이중 호출 대상: 컴포넌트 함수 본문, `useState`/`useReducer`의 초기화 함수, `useMemo`, `useCallback` 등

```tsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

## 전체 렌더링 흐름 요약

```
state/props 변경 감지
       |
       v
[Render Phase]  컴포넌트 함수 실행 --> 새로운 React Element 트리(Virtual DOM) 생성
       |
       v
[Reconciliation]  이전 Virtual DOM과 Diff 비교
       |
       v
[Commit Phase]  변경된 부분만 실제 DOM에 반영 --> 브라우저 페인트
       |
       v
[Effect 실행]  useLayoutEffect (동기) --> useEffect (비동기)
```
