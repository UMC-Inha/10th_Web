# useContext

## Props Drilling 문제

### Props Drilling이란

- React에서 데이터를 전달하는 기본 방법은 props이며, 부모에서 자식으로 단방향 전달됨
- 컴포넌트 트리가 깊어지면, 실제로 데이터를 사용하지 않는 중간 컴포넌트도 단순히 하위 컴포넌트에 전달하기 위해 props를 받아야 하는 상황이 발생함
- 이를 **Props Drilling**이라고 함

```
App (count, handleIncrement, handleDecrement 소유)
 └─ ButtonGroup (직접 사용하지 않지만 전달을 위해 props를 받음)
     └─ Button (실제 사용)
```

### Props Drilling의 문제점

1. 컴포넌트 트리가 깊어질수록 전달 경로가 길어지고 코드가 복잡해짐
2. 중간 컴포넌트가 자신과 무관한 props를 받게 되어 역할이 불명확해짐
3. props 이름이나 타입이 변경되면 경로상의 모든 컴포넌트를 수정해야 함
4. 중간 컴포넌트가 특정 props에 의존하게 되면서 재사용성이 떨어짐

### Props Drilling 예제

**App.tsx**

```tsx
import { useState } from 'react';
import ButtonGroup from './components/ButtonGroup';

function App() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount(prev => prev + 1);
  const handleDecrement = () => setCount(prev => prev - 1);

  return (
    <>
      <h1>{count}</h1>
      <ButtonGroup handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
    </>
  );
}

export default App;
```

**ButtonGroup.tsx**

```tsx
import Button from './Button';

interface ButtonGroupProps {
  handleIncrement: () => void;
  handleDecrement: () => void;
}

const ButtonGroup = ({ handleIncrement, handleDecrement }: ButtonGroupProps) => {
  return (
    <div>
      <Button onClick={handleIncrement} text="+1 증가" />
      <Button onClick={handleDecrement} text="-1 감소" />
    </div>
  );
};

export default ButtonGroup;
```

**Button.tsx**

```tsx
interface ButtonProps {
  onClick: () => void;
  text: string;
}

const Button = ({ onClick, text }: ButtonProps) => {
  return <button onClick={onClick}>{text}</button>;
};

export default Button;
```

`ButtonGroup`은 `handleIncrement`와 `handleDecrement`를 직접 사용하지 않고, 단지 `Button`에 전달하기 위해서만 props를 받고 있음. 이것이 Props Drilling임

## Context API

React 공식 문서에서는 Context를 "props를 전달하지 않고도 컴포넌트 트리 전체에 데이터를 제공할 수 있는 방법"으로 설명함

Context는 세 가지 요소로 구성됨

### createContext

`createContext`는 Context 객체를 생성하는 함수임. 인자로 전달하는 값은 Provider 없이 `useContext`를 호출했을 때 사용되는 기본값(default value)임

```tsx
import { createContext } from 'react';

const MyContext = createContext(defaultValue);
```

### Provider

`Context.Provider`는 Context의 값을 하위 트리에 제공하는 컴포넌트임. `value` prop으로 전달한 값이 해당 Provider 하위의 모든 컴포넌트에서 접근 가능해짐

```tsx
<MyContext.Provider value={someValue}>
  {children}
</MyContext.Provider>
```

- Provider는 중첩할 수 있으며, 가장 가까운 상위 Provider의 `value`가 사용됨
- `value`가 변경되면, 해당 Context를 구독하고 있는 모든 하위 컴포넌트가 리렌더링됨

### useContext

`useContext`는 컴포넌트에서 Context의 현재 값을 읽기 위한 Hook임. 가장 가까운 상위 Provider의 `value`를 반환함

```tsx
import { useContext } from 'react';

const value = useContext(MyContext);
```

- 상위 트리에 해당 Context의 Provider가 없으면, `createContext`에 전달한 기본값(default value)을 반환함

## 실습: Props Drilling을 Context로 해결하기

### 1. Context와 Provider 생성

`src/context/CounterProvider.tsx` 파일을 생성함

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface CounterContextType {
  count: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);
```

- Context의 타입을 `CounterContextType | undefined`로 정의하고, 기본값을 `undefined`로 설정함
- 이렇게 하면 Provider 밖에서 `useContext`를 호출했을 때 `undefined`가 반환되므로, 타입 수준에서 실수를 감지할 수 있음

이어서 같은 파일에 Provider 컴포넌트를 작성함

```tsx
export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount(prev => prev + 1);
  const handleDecrement = () => setCount(prev => prev - 1);

  return (
    <CounterContext.Provider value={{ count, handleIncrement, handleDecrement }}>
      {children}
    </CounterContext.Provider>
  );
};
```

- state와 그 state를 변경하는 함수를 Provider 내부에서 정의하고, `value` prop으로 하위 트리에 제공함
- `children`을 렌더링하여 Provider가 감싸는 모든 하위 컴포넌트가 이 값에 접근할 수 있게 함

### 2. 커스텀 Hook 생성

매번 `useContext(CounterContext)`를 호출하고 `undefined` 체크를 하는 것은 번거로우므로, 커스텀 Hook으로 추출함

```tsx
export const useCounter = () => {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error('useCounter는 반드시 CounterProvider 내부에서 사용해야 합니다');
  }
  return context;
};
```

- `context`가 `undefined`이면 Provider 밖에서 호출된 것이므로 명시적으로 에러를 throw함
- 이 throw 이후 반환 타입에서 `undefined`가 제거되므로, 호출하는 쪽에서 옵셔널 체이닝(`?.`) 없이 안전하게 사용할 수 있음 (TypeScript의 type narrowing)

### 3. Provider 적용

Context의 값을 사용하려면 컴포넌트 트리의 상위에서 Provider로 감싸야 함. 일반적으로 `main.tsx`에서 감쌈

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CounterProvider } from './context/CounterProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CounterProvider>
      <App />
    </CounterProvider>
  </StrictMode>
);
```

Provider로 감싸지 않으면 커스텀 Hook에서 에러가 throw되어 즉시 문제를 인지할 수 있음

### 4. Props Drilling 제거

이제 각 컴포넌트에서 필요한 값만 커스텀 Hook으로 직접 가져올 수 있으므로, 중간 컴포넌트를 거쳐 props를 전달할 필요가 없어짐

**App.tsx**

```tsx
import ButtonGroup from './components/ButtonGroup';
import { useCounter } from './context/CounterProvider';

function App() {
  const { count } = useCounter();

  return (
    <>
      <h1>{count}</h1>
      <ButtonGroup />
    </>
  );
}

export default App;
```

**ButtonGroup.tsx**

```tsx
import { useCounter } from '../context/CounterProvider';
import Button from './Button';

const ButtonGroup = () => {
  const { handleIncrement, handleDecrement } = useCounter();

  return (
    <div>
      <Button onClick={handleIncrement} text="+1 증가" />
      <Button onClick={handleDecrement} text="-1 감소" />
    </div>
  );
};

export default ButtonGroup;
```

**Button.tsx**

```tsx
interface ButtonProps {
  onClick: () => void;
  text: string;
}

const Button = ({ onClick, text }: ButtonProps) => {
  return <button onClick={onClick}>{text}</button>;
};

export default Button;
```

- `App`은 `count`만, `ButtonGroup`은 핸들러 함수만 각각 필요한 값을 직접 가져옴
- `ButtonGroup`의 props 인터페이스가 완전히 제거되어, 순수하게 버튼을 배치하는 역할만 담당하게 됨
- `Button`은 Context와 무관하게 `onClick`과 `text`만 받는 범용 컴포넌트로 유지됨

### 전체 파일 구조

```
src/
├── context/
│   └── CounterProvider.tsx   // createContext, Provider, useCounter Hook
├── components/
│   ├── ButtonGroup.tsx       // useCounter로 핸들러를 직접 소비
│   └── Button.tsx            // Context와 무관한 범용 버튼 컴포넌트
├── App.tsx                   // useCounter로 count를 직접 소비
└── main.tsx                  // CounterProvider로 앱 전체를 감쌈
```

## useContext의 특성과 주의사항

### 리렌더링 동작

- Provider의 `value`가 변경되면, 해당 Context를 `useContext`로 구독하는 **모든** 하위 컴포넌트가 리렌더링됨
- 이때 중간에 `React.memo`가 있더라도 건너뛰고 리렌더링이 발생함
- `value`의 변경 여부는 `Object.is` 비교로 판단하므로, 매 렌더링마다 새 객체를 생성하면 불필요한 리렌더링이 발생할 수 있음

```tsx
// 매 렌더링마다 새 객체가 생성되어 하위 컴포넌트가 항상 리렌더링됨
<MyContext.Provider value={{ count, handleIncrement }}>

// useMemo로 value 객체를 메모이제이션하면 불필요한 리렌더링을 방지할 수 있음
const contextValue = useMemo(
  () => ({ count, handleIncrement }),
  [count, handleIncrement]
);
<MyContext.Provider value={contextValue}>
```

### Context를 사용하기 전에 고려할 것

React 공식 문서에서는 Context를 사용하기 전에 다음 대안을 먼저 고려할 것을 권장함

1. **props 전달로 시작하기** -- 컴포넌트가 적고 트리가 얕다면 props 전달이 가장 명확하고 데이터 흐름을 추적하기 쉬움
2. **컴포넌트를 추출하고 children으로 JSX 전달하기** -- 데이터를 사용하지 않는 중간 컴포넌트를 여러 단계 거쳐 전달하고 있다면, 컴포넌트 구조를 재설계하는 것이 더 나은 해결책일 수 있음

Context가 적합한 경우는 다음과 같음

- 테마(theme), 다크 모드
- 현재 로그인한 사용자 정보
- 라우팅 정보
- 전역적으로 필요한 설정값

### Context는 전역 상태 관리 도구가 아님

- Context는 "값을 트리 아래로 전달하는 메커니즘"이지, 상태 관리 도구 자체는 아님
- 상태 관리는 `useState`나 `useReducer`가 담당하고, Context는 그 상태를 하위 트리에 전달하는 역할을 함
- 빈번하게 변경되는 복잡한 전역 상태에는 Zustand, Redux 같은 전용 상태 관리 라이브러리가 더 적합할 수 있음. Context는 `value`가 변경될 때 구독하는 모든 컴포넌트가 리렌더링되므로, 세밀한 구독(selector) 제어가 필요한 경우에는 한계가 있음
