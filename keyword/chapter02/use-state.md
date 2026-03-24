# useState

## useState 기초

### 기본 문법

- `useState`는 함수형 컴포넌트에 state(상태)를 추가하기 위한 React Hook임
- 배열을 반환하며, 첫 번째 요소는 현재 state 값, 두 번째 요소는 state를 업데이트하는 setter 함수임
- 컴포넌트가 처음 렌더링될 때 state는 `useState`에 전달한 초기값(initialState)을 가짐
- setter 함수를 호출하면 state가 업데이트되고, React는 해당 컴포넌트를 리렌더링함

```tsx
import { useState } from 'react';

const [state, setState] = useState(initialState);
```

- `useState`는 Hook이므로 컴포넌트의 최상위 레벨 또는 커스텀 Hook 내부에서만 호출할 수 있음
- 반복문이나 조건문 안에서는 호출할 수 없음

### 카운터 예제

```tsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>숫자 증가</button>
    </>
  );
}

export default App;
```

- `count`의 초기값은 `0`이므로, 최초 렌더링 시 화면에 `0`이 출력됨
- 버튼을 클릭하면 `setCount`가 호출되어 `count` 값이 1 증가하고, React가 컴포넌트를 리렌더링하여 갱신된 값이 화면에 반영됨

### 이벤트 핸들러 분리

이벤트 핸들러의 로직이 복잡해지면, 인라인으로 작성하는 대신 별도의 함수로 분리하는 것이 가독성에 유리함

```tsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const handleIncreaseNumber = () => {
    setCount(count + 1);
  };

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleIncreaseNumber}>숫자 증가</button>
    </>
  );
}

export default App;
```

- 이벤트 핸들러 함수의 네이밍은 `handle` + 동작 형태(예: `handleClick`, `handleSubmit`)가 관례임
- `onClick`에 함수를 전달할 때는 `handleIncreaseNumber()`가 아닌 `handleIncreaseNumber`로, 함수 자체의 참조를 전달해야 함. 괄호를 붙이면 렌더링 시점에 즉시 실행되어 버림

## useState와 TypeScript

### 타입 추론

TypeScript에서 `useState`에 초기값을 전달하면, 해당 초기값으로부터 state의 타입이 자동 추론됨

```tsx
const [count, setCount] = useState(0);
// count: number로 추론됨

setCount(5);       // 정상
setCount('hello'); // 컴파일 에러: 'string'은 'number'에 할당 불가
```

초기값이 명확한 원시 타입이라면 제네릭을 생략해도 안전함

### 제네릭으로 타입 명시

초기값이 `null`이거나 여러 타입을 허용해야 하는 경우에는, 타입 추론이 정확하지 않으므로 제네릭으로 타입을 명시해야 함

```tsx
const [value, setValue] = useState<string | null>(null);

setValue('Hello'); // 정상
setValue(123);     // 컴파일 에러: 'number'은 'string | null'에 할당 불가
```

```tsx
interface User {
  name: string;
  age: number;
}

const [user, setUser] = useState<User | null>(null);
```

## 상태 업데이트의 동작 원리

### State는 스냅샷임

React 공식 문서에서는 "state as a snapshot"이라는 개념을 강조함

- setter 함수를 호출해도 이미 실행 중인 코드의 state 값은 변하지 않음
- state는 해당 렌더링 시점의 값으로 고정된 스냅샷처럼 동작함
- 이는 JavaScript의 클로저(closure) 때문임. 컴포넌트 함수가 실행될 때 state 값을 캡처하고, 해당 렌더링의 이벤트 핸들러는 그 캡처된 값을 참조함

다음 코드에서 `setCount`를 6번 호출해도 `count`는 1만 증가함

```tsx
const handleIncreaseNumber = () => {
  setCount(count + 1); // 0 + 1
  setCount(count + 1); // 0 + 1
  setCount(count + 1); // 0 + 1
  setCount(count + 1); // 0 + 1
  setCount(count + 1); // 0 + 1
  setCount(count + 1); // 0 + 1
  // 최종 결과: 1 (6이 아님)
};
```

`count`는 해당 렌더링에서 `0`이라는 값으로 고정되어 있기 때문에, `setCount(0 + 1)`이 6번 호출되는 것과 동일함. 마지막 호출의 결과인 `1`만 다음 렌더링에 반영됨

### Updater Function (함수형 업데이트)

setter 함수에 값 대신 함수를 전달하면, React는 이 함수(updater function)에 **이전 state(pending state)**를 인자로 넘겨줌. 이를 통해 이전 업데이트 결과를 기반으로 연속적인 상태 변경이 가능함

```tsx
setCount(prev => prev + 1);
```

- `prev`(관례상 `prev` 또는 state 변수명의 첫 글자를 사용)는 직전 업데이트가 반영된 pending state임
- React는 모든 updater function을 큐(queue)에 넣고, 다음 렌더링 시 순서대로 실행함

```tsx
const handleIncreaseNumber = () => {
  setCount(prev => prev + 1); // 0 -> 1
  setCount(prev => prev + 1); // 1 -> 2
  setCount(prev => prev + 1); // 2 -> 3
  setCount(prev => prev + 1); // 3 -> 4
  setCount(prev => prev + 1); // 4 -> 5
  setCount(prev => prev + 1); // 5 -> 6
  // 최종 결과: 6
};
```

이전 state를 기반으로 다음 state를 계산해야 하는 경우에는 항상 updater function을 사용하는 것이 안전함

### Automatic Batching (자동 배칭)

- React 18부터 이벤트 핸들러 내의 여러 `setState` 호출은 하나의 리렌더링으로 배칭됨
- 위 예제에서 `setCount`를 6번 호출해도 리렌더링은 1번만 발생함
- 이벤트 핸들러뿐 아니라 Promise, setTimeout 등 모든 컨텍스트에서 자동 배칭이 적용됨

## 객체 상태 업데이트

### 불변성 유지 원칙

React 공식 문서에서는 state에 저장된 객체를 직접 변경(mutate)하지 말고, 새로운 객체를 생성하여 교체해야 한다고 명시하고 있음

- state에 저장된 객체를 직접 수정해도 React는 변경을 감지하지 못하여 리렌더링이 발생하지 않음
- React는 setter 함수에 전달된 값이 이전 state와 다른 참조(reference)인지를 `Object.is`로 비교하여 리렌더링 여부를 결정함

```tsx
// 잘못된 방식: 직접 변경 (React가 변경을 감지하지 못함)
person.name = '김해원';
setPerson(person);

// 올바른 방식: 새 객체를 생성하여 전달
setPerson({ ...person, name: '김해원' });
```

### Spread 연산자를 활용한 업데이트

spread 연산자(`...`)를 사용하여 기존 객체의 속성을 복사한 뒤, 변경하고자 하는 속성만 덮어쓰는 패턴이 일반적임

```tsx
import { useState } from 'react';

function App() {
  const [person, setPerson] = useState({
    name: '김해원',
    age: 22,
    nickname: '엠버',
    city: '',
  });

  const updateCity = () => {
    setPerson(prev => ({
      ...prev,
      city: '인천',
    }));
  };

  const increaseAge = () => {
    setPerson(prev => ({
      ...prev,
      age: prev.age + 1,
    }));
  };

  return (
    <>
      <h1>이름: {person.name}</h1>
      <h2>나이: {person.age}</h2>
      <h3>닉네임: {person.nickname}</h3>
      {person.city && <h4>도시: {person.city}</h4>}
      <button onClick={updateCity}>도시 추가</button>
      <button onClick={increaseAge}>나이 증가</button>
    </>
  );
}

export default App;
```

- `...prev`로 기존 속성을 모두 복사한 뒤, 그 아래에 변경할 속성을 작성하면 해당 속성만 덮어쓰기됨
- updater function(`prev => ...`)을 사용하면 이전 state를 안전하게 참조할 수 있음

### 얕은 복사와 깊은 복사

spread 연산자는 **얕은 복사(shallow copy)**를 수행함. 1단계 깊이의 속성만 새로 복사하고, 중첩된 객체는 원본과 같은 참조를 공유함

```tsx
const [person, setPerson] = useState({
  name: '김해원',
  age: 22,
  nickname: '엠버',
});

const newPerson = { ...person };
newPerson.nickname = '해원';

console.log(person.nickname); // '엠버' (원본은 유지됨, 1단계 속성이므로 안전)
```

중첩된 객체가 있는 경우, 변경하려는 중첩 객체도 spread로 새 객체를 만들어야 함

```tsx
const [user, setUser] = useState({
  name: '김해원',
  address: {
    city: '인천',
    district: '미추홀구',
  },
});

const updateDistrict = () => {
  setUser(prev => ({
    ...prev,
    address: {
      ...prev.address,
      district: '남구',
    },
  }));
};
```

**깊은 복사(deep copy)**는 중첩된 모든 레벨의 객체를 완전히 새로운 복사본으로 만드는 것임

```tsx
const deepCopy = JSON.parse(JSON.stringify(original));
```

- `JSON.parse(JSON.stringify(...))`는 간단하지만, `undefined`, 함수, `Date`, `Map`, `Set` 등의 값은 올바르게 복사되지 않는 한계가 있음
- 브라우저 내장 API인 `structuredClone()`을 사용하면 더 안전하게 깊은 복사가 가능함
- 중첩이 깊은 객체 상태를 자주 다루는 경우, Immer 같은 라이브러리를 사용하면 불변성을 유지하면서도 직접 수정하는 것처럼 직관적인 코드를 작성할 수 있음
