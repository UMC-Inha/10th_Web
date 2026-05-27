# Redux vs Redux Toolkit

> 참고 공식 문서
>
> - [Redux – Getting Started](https://redux.js.org/introduction/getting-started)
> - [Redux Toolkit – Getting Started](https://redux-toolkit.js.org/introduction/getting-started)
> - [Redux FAQ: When should I use Redux?](https://redux.js.org/faq/general#when-should-i-use-redux)

---

## Redux란?

**예측 가능하고 유지보수하기 쉬운 전역 상태**를 관리하기 위한 JS 라이브러리임. React뿐 아니라 다른 UI와도 함께 쓸 수 있음

### 핵심 원칙 (Redux Docs)

1. 앱의 전역 state는 **하나의 store** 객체 트리에 저장
2. state를 바꾸는 유일한 방법은 **action**을 dispatch하는 것
3. state 변경 방식은 **순수 reducer 함수**로만 정의

```
UI → dispatch(action) → reducer(state, action) → new state → UI
```

### Legacy Redux 예시 (보일러플레이트 많음)

```tsx
// actions.ts
export const INCREMENT = 'INCREMENT';
export const increment = () => ({ type: INCREMENT });

// reducer.ts
const initialState = { count: 0 };

export function counterReducer(state = initialState, action: { type: string }) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}
```

action type 상수, action creator, reducer, store 설정을 **파일·코드마다 직접** 작성해야 함. 불변 업데이트도 spread로 직접 처리

---

## Redux Toolkit(RTK)이란?

Redux 팀이 **Redux를 쓰는 표준 방식**으로 공식 권장하는 도구 모음임

RTK가 해결하려는 세 가지 불만 (공식 문서):

- store 설정이 너무 복잡하다
- 유용한 기능을 쓰려면 패키지를 많이 깔아야 한다
- 보일러플레이트가 너무 많다

### RTK Counter 예시

```tsx
import { configureStore, createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented(state) {
      state.value += 1; // Immer 덕분에 “변경처럼” 작성 가능
    },
    decremented(state) {
      state.value -= 1;
    },
  },
});

export const { incremented, decremented } = counterSlice.actions;

export const store = configureStore({
  reducer: counterSlice.reducer,
});
```

`createSlice` 하나로 **reducer + action creator + action type**이 생성됨

---

## 한눈에 비교

| 항목 | Redux (Legacy) | Redux Toolkit |
| --- | --- | --- |
| 코드량 | 많음 | 적음 |
| 불변성 | 직접 spread/copy | Immer 내장 (mutable 문법 → immutable 결과) |
| reducer | switch + type 상수 | `createSlice`의 `reducers` 객체 |
| action | creator 수동 작성 | slice에서 자동 생성 |
| store 설정 | `createStore` + middleware 수동 | `configureStore` (thunk, DevTools 기본) |
| 비동기 | redux-thunk/saga 별도 설정 | `createAsyncThunk` 내장 |
| 공식 권장 | 과거 방식 | **현재 표준** |

---

## RTK 주요 API

### configureStore

store를 만들고 slice reducer를 합치며, 기본 middleware(thunk)와 DevTools를 설정함

```tsx
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### createSlice

name, initialState, reducers(동기), extraReducers(비동기 등)를 받아 slice reducer와 action을 생성

### createAsyncThunk

`pending / fulfilled / rejected` action을 자동 dispatch하는 비동기 thunk 생성

```tsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('user/fetch', async (userId: string) => {
  const res = await fetch(`/api/users/${userId}`);
  return res.json();
});
```

### React 연동 — Provider, useSelector, useDispatch

```tsx
// main.tsx
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
```

```tsx
// Counter.tsx
import { useDispatch, useSelector } from 'react-redux';
import { incremented } from './counterSlice';
import type { RootState } from './store';

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return <button onClick={() => dispatch(incremented())}>{count}</button>;
}
```

TypeScript에서는 `RootState`, `AppDispatch` 타입을 export해 selector/dispatch에 재사용하는 패턴이 일반적임

### RTK Query (선택)

`@reduxjs/toolkit/query` — API fetch·캐시·invalidation을 slice 없이 선언적으로 처리 (서버 상태용)

---

## RTK가 공식 권장인 이유

Redux 팀: *"RTK is the standard way to write Redux logic"* — 보일러플레이트를 줄이면서 Redux의 **예측 가능한 단방향 흐름**은 유지함

- DevTools로 action 타임라인 추적·리플레이 가능
- Immer로 실수하기 쉬운 불변 업데이트를 완화
- 팀 onboarding 시 “Redux Toolkit부터”가 현재 업계 표준

---

## 언제 쓸까 / 언제 과한가

### RTK를 고려할 때

- 여러 컴포넌트가 **복잡한 클라이언트 전역 state**를 공유
- 비동기 API + 전역 UI state를 **한 store**에서 체계적으로 관리하고 싶을 때
- action/reducer 패턴으로 **변경 이력·디버깅**이 중요할 때

### 과할 수 있을 때

- `useState` / `useReducer` + Context로 충분한 작은 앱
- 서버에서 가져온 데이터만 필요 → **TanStack Query** 등 서버 상태 도구가 더 적합 (chapter06 참고)

Redux FAQ: *"Don't use Redux just because someone said you should"* — props/Context로 한계가 올 때 도입을 검토

---

## Redux 패턴과 useReducer의 관계

| | useReducer + Context | Redux Toolkit |
| --- | --- | --- |
| 범위 | 앱 일부 또는 중소 규모 | 앱 전역, 팀 단위 |
| DevTools | 없음 (직접 구현) | Redux DevTools |
| 미들웨어 | 없음 | thunk, listener 등 |
| 보일러플레이트 | 적음 | RTK로 Redux 대비 적음 |

미션 규모에서는 useReducer로 패턴을 익힌 뒤, RTK는 **slice·store·hooks** 흐름을 익히는 단계로 보면 됨
