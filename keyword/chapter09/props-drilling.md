# Props Drilling

> 참고
>
> - [Passing Data Deeply with Context | React Docs](https://react.dev/learn/passing-data-deeply-with-context)
> - [chapter02/use-context.md](../chapter02/use-context.md) — Context API 실습

---

## Props Drilling이란?

상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달할 때, **실제로 그 값을 쓰지 않는 중간 컴포넌트**도 props를 받아 다시 아래로 넘겨야 하는 상황을 말함

React는 **단방향 데이터 흐름**(부모 → 자식)을 따르기 때문에, 트리가 깊어질수록 전달 경로가 길어짐

```
App (name 보유)
 └─ Parent   ← name 사용 안 함, 전달만
     └─ Child   ← name 사용 안 함, 전달만
         └─ GrandChild   ← name 실제 사용
```

### 예시

```tsx
function App() {
  return <Parent name="Matthew" />;
}

function Parent({ name }: { name: string }) {
  return <Child name={name} />;
}

function Child({ name }: { name: string }) {
  return <GrandChild name={name} />;
}

function GrandChild({ name }: { name: string }) {
  return <div>Hello {name}</div>;
}
```

`name`이 필요한 컴포넌트는 `GrandChild` 하나뿐이지만, `Parent`와 `Child`도 props를 받아야 함

---

## 왜 문제인가

| 문제 | 설명 |
| --- | --- |
| 유지보수 | props 이름·타입 변경 시 경로상 모든 컴포넌트 수정 필요 |
| 가독성 | 중간 컴포넌트가 실제로 쓰는 값인지, 전달용인지 구분하기 어려움 |
| 재사용성 | `Child`를 다른 곳에 쓰려면 불필요한 props까지 강제로 전달해야 함 |
| 리팩토링 부담 | 컴포넌트 구조를 바꿀 때마다 props 전달 경로도 함께 수정해야 함 |

---

## 자주 발생하는 상황

여러 곳에서 공통으로 필요한 값을 내려보낼 때 Drilling이 길어지기 쉬움

- 로그인 사용자 정보 (`user`, `profile`)
- 테마 (다크/라이트 모드)
- 언어 설정 (i18n, locale)
- 레이아웃 전역 설정
- 모달 열림 여부, 알림 상태 등 UI 상태

---

## 줄이는 방법

### 1. 컴포넌트 설계부터 점검

Context나 전역 상태 라이브러리로 가기 전에 먼저 확인할 것

1. 이 데이터가 정말 이 깊이까지 내려가야 하는가?
2. 컴포넌트 역할을 다시 나누면 props 경로를 줄일 수 있는가?

특정 섹션에서만 쓰는 데이터라면, 그 섹션을 묶어 **그 안에서만** 상태를 관리하는 편이 나을 수 있음 (State Colocation)

### 2. children / 컴포넌트 추출

React 공식 문서는 “데이터를 사용하지 않는 중간 컴포넌트가 많다면, **children으로 JSX를 전달**하는 구조 재설계”를 권장함

```tsx
function Page({ user }: { user: User }) {
  return (
    <Layout>
      <Profile user={user} /> {/* Layout은 user를 몰라도 됨 */}
    </Layout>
  );
}
```

### 3. Context API

여러 컴포넌트가 공통으로 쓰는 값은 Provider로 감싸고, 필요한 곳에서 `useContext`로 직접 읽음

```tsx
interface UserContextType {
  name: string;
}

const UserContext = createContext<UserContextType | null>(null);

function App() {
  return (
    <UserContext.Provider value={{ name: 'Matthew' }}>
      <Parent />
    </UserContext.Provider>
  );
}

function GrandChild() {
  const user = useContext(UserContext);
  if (!user) return null;
  return <div>Hello {user.name}</div>;
}
```

중간 컴포넌트(`Parent`, `Child`)는 `name` props를 받을 필요가 없어짐

> Context 상세: [chapter02/use-context.md](../chapter02/use-context.md)

### 4. 상태 관리 라이브러리

규모가 커지면 Redux Toolkit, Zustand 등으로 **스토어에서 직접 구독**하는 방식이 Drilling을 줄이는 데 유리함

### 5. Custom Hook

같은 로직을 여러 컴포넌트에서 쓴다면 Hook으로 분리. 전역 공유가 필요하면 Hook 내부에서 Context나 스토어와 결합

```tsx
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggle = () => setIsDarkMode((prev) => !prev);
  return { isDarkMode, toggle };
}
```

---

## Context로 리팩토링 예시

### Before — Drilling

```tsx
function App() {
  return <Page isDarkMode={true} />;
}

function Page({ isDarkMode }: { isDarkMode: boolean }) {
  return <Layout isDarkMode={isDarkMode} />;
}

function Layout({ isDarkMode }: { isDarkMode: boolean }) {
  return <Header isDarkMode={isDarkMode} />;
}

function Header({ isDarkMode }: { isDarkMode: boolean }) {
  return <h1>{isDarkMode ? 'Dark' : 'Light'} Mode</h1>;
}
```

### After — Context

```tsx
interface ThemeContextType {
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function App() {
  return (
    <ThemeContext.Provider value={{ isDarkMode: true }}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  if (!theme) return null;
  return <h1>{theme.isDarkMode ? 'Dark' : 'Light'} Mode</h1>;
}
```

---

## TypeScript 관점

props와 Context 타입을 명시하면 컴파일 단계에서 전달 오류를 잡을 수 있음

```tsx
interface AuthContextType {
  userName: string;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
```

Provider 밖 사용을 막으려면 커스텀 Hook에서 `undefined`/`null` 체크 후 throw하는 패턴이 일반적임

---

## 체크리스트

- 이 props는 이 컴포넌트가 **직접 필요해서** 받는가? (전달만이면 Drilling 가능성)
- 이 상태는 **특정 영역**에서만 쓰이는가, **앱 전역**에서 필요한가?
- 컴포넌트 구조를 나누면 props 깊이를 줄일 수 있는가?
- Context를 쓸 때 **전역 변수 지옥**이 되지 않는가? (정말 공통 값에만 사용)
- 공통 로직은 Custom Hook으로 분리할 수 있는가?
