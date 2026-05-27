# useReducer

> 참고 공식 문서
>
> - [useReducer – React](https://react.dev/reference/react/useReducer)
> - [Extracting State Logic into a Reducer – React](https://react.dev/learn/extracting-state-logic-into-a-reducer)

---

## useReducer란?

복잡한 state 업데이트 로직을 **컴포넌트 밖 reducer 함수 한 곳**으로 모아 관리하는 React Hook임

`useState`와 비슷하게 `[state, dispatch]`를 반환하지만, “어떻게 바꿀지”는 reducer가 결정함

React 공식 문서: *"useReducer is very similar to useState, but it lets you move the state update logic from event handlers into a single function outside of your component."*

---

## 기본 문법

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

| 항목 | 역할 |
| --- | --- |
| `state` | 현재 상태 |
| `dispatch` | 상태 변경을 **요청**하는 함수 (identity가 안정적) |
| `reducer` | `(state, action) => newState` 순수 함수 |
| `initialState` | 초기 상태 |

세 번째 인자 `init`을 쓰면 `(initialArg) => initialState` 형태로 초기값을 계산할 수 있음

### reducer 형태

```tsx
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  }
}
```

- reducer는 **순수 함수**여야 함 (기존 state를 직접 mutate하면 안 됨)
- action은 보통 `{ type: string, ...payload }` 형태의 객체
- 알 수 없는 action은 `return state` 또는 Error throw

---

## Counter 예제

```tsx
import { useReducer } from 'react';

interface State {
  count: number;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

const initialState: State = { count: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>{state.count}</h1>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

---

## useState vs useReducer

| 항목 | useState | useReducer |
| --- | --- | --- |
| 단순한 값 (boolean, number) | 적합 | 과할 수 있음 |
| 업데이트 로직이 복잡함 | if/else가 컴포넌트에 흩어짐 | reducer에 집중 가능 |
| 여러 종류의 action | 관리 어려움 | switch/discriminated union으로 명확 |
| reducer 테스트 | — | 컴포넌트 밖 함수라 단위 테스트 용이 |
| 하위에 dispatch만 전달 | state 전체 전달 필요 | Drilling 완화에 유리 |

React 공식 가이드: 다음 중 **하나라도** 해당하면 useReducer 고려

- 다음 state가 이전 state에 **크게 의존**할 때
- 여러 하위 컴포넌트에 **서로 다른 updater**를 전달할 때
- state 업데이트 로직이 **복잡**할 때

---

## 객체(폼) 상태 관리

```tsx
interface FormState {
  name: string;
  age: number;
}

type FormAction =
  | { type: 'setName'; payload: string }
  | { type: 'setAge'; payload: number }
  | { type: 'reset' };

const initialForm: FormState = { name: '', age: 0 };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'setName':
      return { ...state, name: action.payload };
    case 'setAge':
      return { ...state, age: action.payload };
    case 'reset':
      return initialForm;
    default:
      return state;
  }
}
```

---

## dispatch만 props로 전달

state 대신 **dispatch만** 내려보내면, 하위는 “어떤 action을 보낼지”만 알면 됨

```tsx
function Child({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  return <button onClick={() => dispatch({ type: 'increment' })}>+1</button>;
}
```

- `dispatch`는 렌더마다 identity가 바뀌지 않음 (Effect deps에 넣어도 보통 안전)
- state 값 자체를 중간 컴포넌트에 노출하지 않아도 됨

---

## useReducer + Context

규모가 커지면 reducer state와 dispatch를 Context로 묶어 **Redux 없이** 간단한 전역 상태를 만들 수 있음

```tsx
const CounterContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function CounterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}
```

Redux Toolkit의 `createSlice` + `configureStore` 패턴과 개념적으로 유사함 (규모·도구는 다름)

---

## 주의사항

- `dispatch` 직후 `state`를 읽으면 **아직 이전 값**임 (다음 렌더에 반영)
- 새 state가 `Object.is`로 이전과 같으면 React는 리렌더를 건너뜀
- Strict Mode(개발)에서는 reducer가 두 번 호출될 수 있음 → reducer는 반드시 순수해야 함

---

## 체크리스트

- 업데이트 종류(액션)가 여러 개인가?
- state 구조가 객체/배열로 복잡한가?
- reducer를 컴포넌트 밖으로 빼 테스트하고 싶은가?
- dispatch만 내려보내면 props Drilling을 줄일 수 있는가?
