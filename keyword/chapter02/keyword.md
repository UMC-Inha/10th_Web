# React 핵심 맛보기 (tsx, useState, contextAPI, useReducer) 키워드 정리

## Lazy Initialization(게으른 초기화)에 대해 설명해주세요 🍠

### Lazy Initialization이란?

`useState` 는 상태의 초기값을 넣어서 사용하는 훅이다.

```tsx
const [count, setCount] = useState(0);
```

이때 초기값을 바로 넣는 대신, **초기값을 “계산해서 반환하는 함수”**를 넣을 수 있다.

```tsx
const [count, setCount] = useState(() => 0);
```

`useState` 에 **값이 아니라 함수**를 넣고,
**React가 처음 렌더링될 때만 그 함수를 실행해서 초기값을 만들게 하는 방식**을
**Lazy Initialization**이라고 한다.

- 그냥 초기값 넣기 → `useState(초기값)`
- Lazy Initialization 사용 → `useState(() => 초기값)`

✔️ **핵심**

“**초기값 계산을 바로 하지 않고, 정말 처음 필요할 때 한 번만 하게 만든다**”는 점!

</aside>

---

### 필요한 이유?

일반적인 숫자나 문자열 초기값은 계산 비용이 거의 없어서 굳이 필요 없지만

어떤 초기값은 만들 때 비용이 들 수 있다.

예:

- `localStorage` 에서 값 읽기
- 큰 배열 계산
- 복잡한 데이터 가공
- 긴 문자열 파싱
- 무거운 함수 실행

이런 걸 컴포넌트 함수 안에서 그냥 작성하면<br>
👉 **리렌더링이 일어날 때마다 그 계산 코드가 다시 실행**될 수 있다.

그래서 **초기 렌더링 때 딱 한 번만 계산하면 되는 값이라면** <br>
👉 Lazy Initialization을 사용해서 불필요한 반복 계산을 줄일 수 있다.

---

### 기본 초기화 vs Lazy Initialization

#### 일반 초기화

```tsx
const [value, setValue] = useState(getInitialValue());
```

이 코드는 `useState` 에 함수의 실행 결과를 전달한다.

컴포넌트가 렌더링될 때마다
`getInitialValue()` 가 먼저 실행되고, 그 결과가 `useState(...)`에 들어간다.

주의할 점은:

- 상태 초기화는 첫 렌더에서만 반영되지만
- `getInitialValue()` 함수 호출 자체는 렌더링 때마다 일어날 수 있다

예시:

```tsx
function App() {
  const [count, setCount] = useState(expensiveCalculation());

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`expensiveCalculation()`은
상태 초기값으로는 처음 한 번만 의미가 있지만,
컴포넌트가 다시 렌더링될 때도 함수 호출 표현식 자체는 다시 평가되므로

👉 **비효율적일 수 있다.**

---

#### Lazy Initialization

```tsx
const [value, setValue] = useState(() => getInitialValue());
```

함수 자체를 넘기면
React는 **초기 렌더링 시점에만 이 함수를 호출하여 초기값을 만든다.**

- 첫 렌더링 때 : 실행 ⭕
- 이후 렌더링 때 : 다시 실행 ❌

---

#### 예제로 보는 차이

##### 1️⃣ 일반 초기화

```tsx
function Counter() {
  const [count, setCount] = useState(getInitialCount());

  console.log("렌더링");

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

function getInitialCount() {
  console.log("초기값 계산");
  return 0;
}
```

`Counter` 가 리렌더링될 때마다
컴포넌트 함수가 다시 실행되므로 `getInitialCount()` 호출 표현식도 다시 평가될 수 있다.

👉 콘솔에 `초기값 계산` 이 여러 번 보일 수 있음

---

##### 2️⃣ Lazy Initialization

```tsx
function Counter() {
  const [count, setCount] = useState(() => getInitialCount());

  console.log("렌더링");

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

function getInitialCount() {
  console.log("초기값 계산");
  return 0;
}
```

`getInitialCount()`는 **처음 렌더링될 때만 실행**된다.

버튼을 눌러 상태가 바뀌어 리렌더링되더라도 초기화 함수는 다시 실행되지 않는다.

---

### 헷갈리는 부분 정리

#### 1️⃣ 함수 자체를 상태로 저장하는 것과 다르다.

`useState(() => 123)` 을 보면
함수가 state에 저장되는 것이라고 착각할 수 있다.

하지만 이 경우는<br>
👉 React가 이 함수를 <b>초기값 생성 함수(initializer function)</b>로 해석하므로
상태값은 `123`이 된다.

```tsx
const [value, setValue] = useState(() => 123);

console.log(value); // 123
```

여기서 state에 저장되는 건 함수가 아니라 **함수의 반환값**!

---

#### 2️⃣ 함수 값을 state로 저장하고 싶다면?

함수 자체를 상태값으로 저장하고 싶다면 한 번 더 감싸야 한다.

```tsx
const [fn, setFn] = useState(() => () => {
  console.log("hello");
});
```

- 바깥 함수: 초기화 함수
- 안쪽 함수: 실제 state에 저장될 함수

---

### 예제 모음

#### 1️⃣ 저장된 테마 불러오기

```tsx
const [theme, setTheme] = useState<"light" | "dark">(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") return "dark";
  return "light";
});
```

---

#### 2️⃣ 저장된 폼 초안 불러오기

```tsx
type FormData = {
  title: string;
  content: string;
};

const [formData, setFormData] = useState<FormData>(() => {
  const saved = localStorage.getItem("draft");

  if (!saved) {
    return {
      title: "",
      content: "",
    };
  }

  return JSON.parse(saved);
});
```

---

#### 3️⃣ 큰 데이터 초기 생성하기

```tsx
function createInitialTodos() {
  console.log("todo 초기 생성");
  return Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    text: `할 일 ${index + 1}`,
    done: false,
  }));
}

const [todos, setTodos] = useState(() => createInitialTodos());
```

👉 1000개의 todo 생성 로직을 리렌더링마다 수행하지 않아도 된다.

---

## useState vs useReducer 🍠

### 개념

#### 1️⃣ `useState`

👉 **값을 직접 바꾸는 방식**

```tsx
const [count, setCount] = useState(0);

setCount(count + 1);
```

`count` 라는 상태를 만들고, `setCount` 로 새로운 값을 직접 넣는다.

---

#### 2️⃣ `useReducer`

👉 "어떤 행동을 했는지"를 전달하면, **reducer 함수가 그 행동에 따라 상태를 계산하는 방식**

```tsx
const [state, dispatch] = useReducer(reducer, initialState);

dispatch({ type: "INCREMENT" });
```

직접 값을 바꾸는 대신

`distpatch` 로 액션(action)을 보내고, `reducer` 가 그 액션을 보고 다음 상태를 만든다.

---

### useState

#### 기본 형태

```tsx
const [state, setState] = useState(initialValue);
```

예시:

```tsx
const [count, setCount] = useState(0);
```

- `count` → 현재 상태
- `setCount` → 상태 변경 함수
- `0` → 초기값

---

#### ✔ 특징

- 문법이 단순해서 배우기 쉬움
- 직관적
- 간단한 상태에 어울림 (숫자 카운트, 체크 여부, 모달 열림/닫힘)

---

#### ✔ 주의할 점

1️⃣ **이전 상태를 기준으로 바꿀 때는 함수형 업데이트가 더 안전함**

```tsx
setCount(count + 1);
```

이렇게 써도 되지만,

이전 상태를 기준으로 계산해야 할 때는 아래 방식이 더 안전하다.

```tsx
setCount((prev) => prev + 1);
```

왜냐하면 리액트의 상태 업데이트는 비동기적으로 묶여 처리될 수 있어서,

👉 기존 `count` 값을 바로 참조하면 예상과 다르게 동작할 수 있기 때문이다.

예시:

```tsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

이렇게 하면 3 증가한다.

반면 아래는 기대와 다를 수 있다.

```tsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

---

2️⃣ **객체 상태는 직접 수정하면 안 됨**

```tsx
const [user, setUser] = useState({ name: "카사", age: 25 });
```

잘못된 예:

```tsx
user.age = 21;
setUser(user);
```

👉 이건 기존 객체를 직접 수정하는 방식이라 좋지 않다.

올바른 예:

```tsx
setUser({ ...user, age: 21 });
```

👉 리액트 상태는 **불변성**을 지키면서 새 객체를 만들어 바꾸는 것이 중요하다.

---

3️⃣ **상태가 많아지면 코드가 흩어질 수 있음**

예를 들어 폼 하나에 상태가 많아지면:

```tsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
```

이렇게 상태와 setter가 계속 늘어난다.

이 정도가 되면 관리가 점점 복잡해질 수 있다.

---

### useReducer

#### 기본 형태

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- `state` → 현재 상태
- `dispatch` → 액션 보내는 함수
- `reducer` → 액션을 받아서 다음 상태를 계산하는 함수

---

#### 함수 형태

```tsx
function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

👉 `action.type`에 따라 어떻게 상태를 바꿀지 규칙을 한곳에 모아두는 방식

---

#### 흐름

`useReducer`는 보통 이렇게 이해하면 된다.

1. 사용자가 버튼을 클릭함
2. `dispatch({ type: "INCREMENT" })` 실행
3. reducer가 액션을 받음
4. reducer가 새로운 state를 반환함
5. 컴포넌트가 다시 렌더링됨

직접 상태를 넣는 게 아니라

**👉 행동을 설명하는 액션을 보내고, reducer가 상태를 계산한다**

---

#### ✔ 특징

1️⃣ **상태 변경 규칙을 한곳에 모을 수 있다**.

여러 상태 변경 로직이 여기저기 흩어져 있지 않고 `reducer` 안에 모인다.

---

2️⃣ **복잡한 상태를 관리하기 좋다**

👉 여러 필드가 서로 연결되어 있거나, 특정 액션에 따라 여러 상태가 한 번에 바뀌어야 할 때 유리

예:

- `isLoading: true`
- `error: ""`
- `success: false`

이런 걸 하나의 액션으로 정리 가능하다.

---

3️⃣ **상태 변화가 예측 가능하다**

어떤 액션이 들어오면 상태가 어떻게 바뀌는지 switch 문에서 명확하게 볼 수 있다.

---

4️⃣ **유지보수에 유리하다**

프로젝트가 커질수록 상태 변경 로직이 흩어져 있으면 찾기 힘들다.

`useReducer`는 액션 이름만 봐도 어떤 의도인지 알기 쉬워서

👉 코드를 읽고 수정하기가 편하다.

---

#### ✔ 주의할 점

1️⃣ **간단한 상태에는 오히려 과할 수 있음**

숫자 하나 증가시키는 정도인데 reducer, action, dispatch까지 쓰면 코드가 더 길어질 수 있다.

👉 단순 카운터라면 `useState`가 더 자연스럽다.

---

2️⃣ **코드 양이 늘어남**

`useState`는 한 줄이면 되는 것도

`useReducer`는 타입, 초기 상태, reducer 함수까지 필요할 수 있다.

👉 간단한 상황에서는 장점보다 단점이 커질 수 있다.

---

### useState와 useReducer의 차이

#### useState

- 값을 직접 설정함
- 간단한 상태에 적합
- 코드가 짧고 직관적임
- 배우기 쉬움
- 상태가 많아지면 코드가 흩어질 수 있음

#### useReducer

- 액션을 dispatch해서 상태를 바꿈
- 복잡한 상태에 적합
- 상태 변경 규칙을 한곳에 모을 수 있음
- 유지보수에 유리함
- 초반에는 코드가 더 길고 어렵게 느껴질 수 있음

<br>

| 구분           | useState             | useReducer                         |
| -------------- | -------------------- | ---------------------------------- |
| 상태 변경 방식 | 새 값을 직접 설정    | 액션을 dispatch해서 reducer가 계산 |
| 문법 난이도    | 쉬움                 | 상대적으로 어려움                  |
| 코드 길이      | 짧음                 | 길어질 수 있음                     |
| 잘 맞는 상황   | 단순 상태            | 복잡한 상태                        |
| 상태 로직 관리 | 분산되기 쉬움        | 한곳에 모으기 좋음                 |
| 가독성         | 단순한 경우 좋음     | 복잡한 경우 더 좋음                |
| 유지보수       | 상태가 많아지면 불편 | 규칙이 많아질수록 유리             |
| 초보자 접근성  | 높음                 | 처음엔 조금 어려움                 |

---

#### 코드 비교

##### 1️⃣ useState

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>증가</button>
      <button onClick={() => setCount((prev) => prev - 1)}>감소</button>
      <button onClick={() => setCount(0)}>초기화</button>
    </div>
  );
}

export default Counter;
```

✔ **특징**

- 짧고 읽기 쉽다
- 단순 기능에 적합하다

---

##### 2️⃣ useReducer

```tsx
import { useReducer } from "react";

type State = {
  count: number;
};

type Action = { type: "INCREMENT" } | { type: "DECREMENT" } | { type: "RESET" };

const initialState: State = {
  count: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>증가</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>감소</button>
      <button onClick={() => dispatch({ type: "RESET" })}>초기화</button>
    </div>
  );
}

export default Counter;
```

✔ **특징**

- 지금은 길어 보임
- 하지만 액션 종류가 많아질수록 구조가 정리됨

---

# 추가 정리

## SPA

### SPA란?

SPA (Single Page Application)는
브라우저가 하나의 HTML 문서를 기반으로 유지하면서,
페이지 이동 시마다 **새로운 HTML 전체를 다시 받지 않고**,
클라이언트가 **필요한 화면만 동적으로 렌더링하는 웹 애플리케이션 방식**이다.

👉 화면은 여러 개처럼 보이지만 실제로는 **문서 전체를 매번 교체하지 않고**,
현재 URL과 상태에 따라 필요한 UI만 바꿔 보여준다.

---

### 왜 SPA를 사용할까?

전통적인 웹 방식(MPA)은 페이지를 이동할 때마다
서버로부터 새로운 HTML 문서를 받아오므로,

👉 화면이 새로고침되고 전환이 끊기는 느낌이 생길 수 있다.

반면 SPA는 처음 로딩 이후에는 필요한 데이터만 서버와 주고받고,
화면 전환은 브라우저 안의 JavaScript가 담당한다.

👉 앱처럼 부드럽고 빠른 사용자 경험을 만들기 좋다.

---

### SPA의 동작 원리

#### 1️⃣ 초기 접속

브라우저는 서버로부터 기본 HTML, CSS, JavaScript 파일을 받는다.

이때 HTML은 보통 큰 완성 화면이라기보다,
애플리케이션이 붙을 **기본 뼈대(document shell)** 역할을 한다.

👉 실제 콘텐츠가 완성된 문서라기보다 JavaScript가 동적으로 화면을 채워 넣을 수 있는 기반 구조

---

#### 2️⃣ 클라이언트가 화면을 렌더링

JavaScript가 실행되면
현재 URL, 상태, 데이터에 따라 어떤 화면을 보여줄지 결정하고 DOM을 구성한다.

👉 React, Vue 같은 라이브러리는 이 과정을 컴포넌트 단위로 관리

---

#### 3️⃣ 페이지 이동처럼 보이는 동작

예를 들어 사용자가

`/home` → `/about` 으로 이동해도

브라우저가 문서 전체를 새로 요청하는 것이 아니라,
클라이언트 라우터가 URL 변화를 감지하고 **해당 화면에 맞는 컴포넌트를 렌더링**한다.

---

#### 4️⃣ 필요한 데이터만 요청

화면에 필요한 정보가 있으면
서버에 API 요청을 보내 JSON 같은 데이터만 받아온 뒤 화면을 다시 그린다.

👉 SPA는 **문서 전체를 다시 받는 대신 데이터와 일부 리소스만 요청**하는 방식에 가깝다.

---

### SPA를 이루는 핵심 요소

#### 1️⃣ 클라이언트 사이드 렌더링

주소가 바뀌어도 서버가 매번 새로운 HTML을 주는 것이 아니라,

👉 브라우저 쪽 라우터가 현재 경로에 맞는 화면을 선택한다.

예:

- `/`
- `/about`
- `/profile`

이런 경로에 따라 각각 다른 컴포넌트를 렌더링한다.

---

#### 2️⃣ 상태 관리

SPA에서는 로그인 상태, 폼 입력값, 장바구니, 선택된 탭 같은 상태를
브라우저 쪽에서 오래 유지하고 관리해야 한다.

페이지 전체가 새로고침되지 않기 때문에 상태 관리가 특히 중요하다.

---

#### 3️⃣ API 통신

백엔드는 보통 완성된 HTML보다 데이터를 제공하는 역할에 집중하고,

프론트엔드는 그 데이터를 받아 UI를 만든다.

---

#### 4️⃣ History API

SPA는 **브라우저의 History API**를 활용해

주소를 바꾸고 뒤로 가기/앞으로 가기 같은 동작을 자연스럽게 처리한다.

---

### 장점과 단점

#### 장점

- 화면 전환이 빠르고 자연스럽다
- 앱 같은 사용자 경험을 만들기 좋다
- 프론트엔드와 백엔드 역할을 분리하기 쉽다
- 컴포넌트 기반 개발과 잘 맞는다
- 상태를 유지한 채 인터랙션을 이어가기 좋다

#### 단점

- 초기 로딩 시 JavaScript 번들이 크면 느릴 수 있다
  - **초기 로딩이 느릴 수 있는 이유**
    SPA는 처음 접속했을 때
    JavaScript 파일을 내려받고 실행한 뒤 화면을 그리는 경우가 많다.
    즉, 사용자는 처음에
    - HTML
    - CSS
    - JavaScript 번들
    - 필요한 초기 데이터
      등을 준비한 뒤에야 화면을 보게 되는 경우가 있다.
      그래서 JavaScript 번들 크기가 크거나,
      초기 실행해야 할 코드가 많으면
      **첫 화면 표시가 늦어질 수 있다.**
      이 문제를 줄이기 위해
    - **코드 스플리팅(Code Splitting)**
    - **Lazy Loading**
    - **캐싱**
    - **SSR / SSG 활용**
      같은 최적화 기법을 함께 사용하기도 한다.
- 클라이언트에서 처리해야 할 로직이 많아 구조가 복잡해질 수 있다.
- 상태 관리가 어려워질 수 있다.
- CSR 중심으로만 구성하면 SEO 대응이 까다로울 수 있다.
- 사용자가 직접 특정 URL로 진입했을 때 서버 설정이 제대로 되어 있지 않으면 `404` 문제가 생길 수 있다.
  - **`404` 문제가 생기는 이유**
    SPA에서는 `/about`, `/profile` , `/posts/1` 같은 경로를
    보통 **클라이언트 라우터가 처리한다.**
    앱 안에서 링크를 눌러 이동할 때: <br>
    브라우저가 문서 전체를 다시 요청 ❌ <br>
    JavaScript가 현재 주소에 맞는 화면을 렌더링
    사용자가 브라우저 주소창에 `/about` 같은 주소를 직접 입력해서 들어올 때:<br>
    가장 먼저 요청을 받는 것은 클라이언트가 아니라 **서버**다.
    이때 서버가
    ” `/about` 이라는 실제 파일 없네?”
    라고 판단하면 `404 Not Found` 에러를 반환할 수 있다.
    그래서 SPA를 배포할 때는 보통
    어떤 경로로 들어오더라도 먼저 기본 `index.html` 을 내려주고,
    그 이후에 화면 분기는 클라이언트 라우터가 처리하도록 설정한다.
    👉 SPA에서는 **라우터 뿐 아니라 서버 fallback 설정도 중요하다.**

---

### SPA와 CSR은 같은 말이 아니다

- SPA: 애플리케이션 구조
- CSR: 클라이언트가 렌더링 하는 방식

SPA는 보통 CSR과 함께 쓰지만
SPA적인 사용자 경험을 만들면서도 SSR이나 SSG를 함께 활용하는 경우도 있다.

예를 들어

React 자체로 만든 전통적인 SPA는 CSR 방식이 중심이지만,
Next.js 같은 프레임워크는 SSR, SSG, CSR을 함께 활용할 수 있다.

👉 현대 웹 개발에서는 SPA적 사용자 경험을 유지하면서도 초기 로딩 성능이나 SEO를 보완하는 방식이 많이 사용된다.

👉 **SPA는 전체 구조, CSR은 화면을 그리는 방식**으로 구분해서 이해하기

---

### SPA와 MPA의 차이

#### MPA (**Multi Page Application)**

👉 페이지를 이동할 때마다 서버가 새로운 HTML 문서를 반환하는 방식

#### SPA (Single Page Application)

👉 처음 받은 문서를 기반으로, 이후 화면 전환은 클라이언트가 처리하는 방식

| 구분        | SPA                                        | MPA                            |
| ----------- | ------------------------------------------ | ------------------------------ |
| 문서 이동   | 전체 문서 재요청 없이 동작하는 경우가 많음 | 페이지마다 새 HTML 요청        |
| 화면 전환   | 부드럽고 빠름                              | 새로고침 기반                  |
| 렌더링 주체 | 클라이언트 비중이 큼                       | 서버 비중이 큼                 |
| 초기 로딩   | 무거울 수 있음                             | 비교적 가벼울 수 있음          |
| SEO         | 별도 대응 필요할 수 있음                   | 비교적 유리                    |
| 상태 유지   | 클라이언트에서 유리                        | 페이지 이동 시 초기화되기 쉬움 |

---

## React

React는 **사용자 인터페이스(UI)를 만들기 위한 JavaScript 라이브러리**이다.

웹 화면을 작은 조각인 **컴포넌트(Component)**단위로 나누어 만들고,
이 컴포넌트들을 조압해서 페이지와 애플리케이션을 구성하는 방식

✔️ React의 핵심 <br>
👉 **상태가 바뀌면 화면도 다시 그린다.**

개발자는 현재 상태에 따라 어떤 UI가 보여야 하는지를 선언하고,
실제 화면 업데이트는 React가 처리한다.

<aside>
💡 <b>컴포넌트 기반으로 UI를 만들고, 상태 변화에 따라 화면을 효율적으로 업데이트하는 JavaScript 라이브러리</b>

</aside>

---

### React의 핵심 특징

#### 1️⃣ 컴포넌트 기반 개발

React에서는 화면을 작은 단위의 **컴포넌트**로 나누어 만든다.

예를 들어 하나의 페이지도 내부적으로 다음처럼 나눌 수 있다.

- Header
- Sidebar
- Card
- Button
- LoginForm
- Footer

👉 이렇게 나누면

- 코드 재사용이 쉬워지고
- 유지보수가 편해지고
- 역할별로 구조를 나누기 쉬워진다.

---

#### 2️⃣ 선언형 UI

React는 **선언형(Declarative)** 방식으로 동작한다.

개발자는
DOM을 직접 하나하나 수정하기보다, <br>
👉 **지금 상태라면 화면은 이렇게 보여야 한다**를 코드로 작성한다는 뜻

전통적인 JavaScript에서는

- 요소 찾기
- 텍스트 바꾸기
- 클래스 추가/제거
- 이벤트마다 DOM 수정

같은 작업을 직접 처리해야 했지만

React는

👉 상태가 바뀌면 그 상태에 맞는 화면을 다시 계산하여 보여준다.

<aside>
💡

- **무엇을 보여줄지 선언**
- **어떻게 바꿀지는 React가 처리**

하는 구조

</aside>

---

#### 3️⃣ 상태(state) 중심 동작

state
👉 컴포넌트가 기억해야 하는 값

예:

- 클릭 횟수
- 로그인 여부
- 선택된 탭
- 모달 열림/닫힘 상태
- 좋아요 수

이런 값이 바뀌면

React는 다시 렌더링해서 화면을 갱신한다.

👉 React는 **상태 변화** **→ UI 변경** 흐름으로 동작

---

#### 4️⃣ 재사용성

한 번 만든 컴포넌트는 여러 곳에서 다시 사용할 수 있다.

예를 들어 `Button` 컴포넌트를 하나 만들면

- 회원가입 버튼
- 로그인 버튼
- 삭제 버튼
- 저장 버튼

처럼 여러 곳에서 재사용이 가능하다.

🔹 이때 `props` 를 통해 텍스트나 동작만 바꿔서 사용 가능

👉 React는 **중복 코드 감소**에 유리

---

### React의 핵심 개념

#### 1️⃣ Component

**UI의 독립적인 조각**

React에서는 보통 함수로 컴포넌트를 생성

```jsx
function myButton() {
  return <button>클릭</button>;
}
```

- 하나의 컴포넌트는 자기만의 구조와 동작을 가질 수 있다.

---

#### 2️⃣ JSX

JavaScript 안에서 HTML처럼 보이는 문법을 작성할 수 있게 해주는 문법

```jsx
const element = <h1>카사</h1>;
```

- HTML 같지만 실제로는 JavaScript 안에서 작성되는 문법으로
- React에서는 JSX를 사용해 UI 구조를 더 직관적으로 표현 가능

---

#### 3️⃣ Props

**부모 컴포넌트가 자식 컴포넌트에게 전달하는 값**

```jsx
function Greeting(props) {
  return <h1>안녕, {props.name}</h1>;
}
```

```jsx
<Greeting name="카사" />
```

✔️ 특징

- 부모 → 자식으로 전달
- 읽기 전용
- 컴포넌트를 재사용할 때 유용

👉 같은 컴포넌트라도 props에 따라 다른 내용을 보여줄 수 있다.

---

#### 4️⃣ State

**컴포넌트 내부에서 변경될 수 있는 값**

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

- `count` : 현재 상태 값
- `setCount` : 상태를 변경하는 함수

👉 state가 바뀌면 React는 컴포넌트를 다시 렌더링한다.

---

#### 5️⃣ Hook

함수 컴포넌트 안에서 React의 기능을 사용할 수 있게 해주는 도구

대표적인 Hook:

- `useState` : 상태 관리
- `useEffect` : 렌더링 이후 실행할 작업 처리
- `useRef` : DOM 참조 또는 값 저장
- `useContext` : 전역처럼 값 공유

---

### React는 프레임워크가 아니라 라이브러리이다.

👉 React가 주로 UI를 만드는 역할에 집중하기 때문

예를 들어 React 자체만으로는

- 라우팅
- 서버 데이터 처리 방식
- 폴더 구조 강제
- 전체 앱의 구조

를 강하게 정해주지 않는다.

따라서 필요에 따라

- React Router
- Zustand
- Redux
- Next.js

같은 도구와 함께 사용한다.
