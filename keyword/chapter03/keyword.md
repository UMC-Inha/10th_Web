# 부드럽고 강력한 웹앱 만들기: Tailwind CSS, React Router, API 통신 키워드 정리

 <br>
 <br>
 
# pushState, popstate 이벤트, 전체 리로드와의 차이🍠
## 전통적인 전체 리로드(Full Page Reload)방식

### 동작 원리

사용자가 링크를 클릭하거나 URL을 직접 입력하면, 브라우저는 **서버에 새로운 HTTP 요청**을 보낸다.
서버는 요청에 해당하는 HTML 문서를 통째로 응답하고, 브라우저는 기존 페이지를 완전히 버리고 새 HTML을 파싱·렌더링한다.

```jsx
사용자 클릭
    ↓
브라우저 → 서버 HTTP GET 요청
    ↓
서버 → 완전한 HTML 응답
    ↓
브라우저 기존 DOM 파괴 → 새 HTML 파싱 → 렌더링
```

### 특징

| 항목              | 설명                                                  |
| ----------------- | ----------------------------------------------------- |
| 네트워크 요청     | 페이지 이동마다 서버에 전체 문서 요청                 |
| 상태 유지         | JavaScript 상태, 스크롤 위치, 입력값 모두 초기화      |
| 렌더링 비용       | HTML 전체 재파싱 + CSS 재계산 + 레이아웃 재구성       |
| **화면 깜빡임**   | 기존 화면이 사라지고 새 화면이 그려지면서 깜빡임 발생 |
| 브라우저 히스토리 | 자동으로 히스토리 스택에 URL 추가됨                   |

---

## History API: pushState와 popstate

### History API란?

브라우저의 `window.history` 객체를 통해 **페이지를 새로 로드하지 않고도
URL과 히스토리 스택을 조작**할 수 있는 API

👉 SPA(Single Page Application) 라우팅의 핵심 기반

---

### pushState

#### 정의

```jsx
history.pushState(state, title, url);
```

| 파라미터            | 타입   | 설명                                                                 |
| ------------------- | ------ | -------------------------------------------------------------------- |
| `state`             | object | 이 히스토리 항목에 연결할 임의의 데이터 (popstate 이벤트에서 복원됨) |
| `title`             | string | 현재 대부분의 브라우저에서 무시됨.                                   |
| 빈 문자열 `""` 권장 |
| `url`               | string | 변경할 URL (반드시 동일 출처여야 함)                                 |

#### 동작 방식

```jsx
// 현재 URL: https://example.com/home

history.pushState({ page: "about" }, "", "/about");

// 결과:
// 1. 브라우저 URL 표시줄 → https://example.com/about 로 변경
// 2. 히스토리 스택에 새 항목 추가
// 3. 페이지 리로드 없음 (서버 요청 없음)
// 4. DOM, JavaScript 상태 그대로 유지
```

#### 히스토리 스택 변화

```jsx
pushState 전:    [home]
                   ↑ (현재 위치)

pushState 후:    [home] → [about]
                             ↑ (현재 위치)
```

#### 주의사항

- 서버에 요청을 보내지 않기 때문에, 사용자가 `/about`을 **직접 입력하거나 새로고침하면 서버가 해당 경로를 처리**할 수 있어야 한다.
- 동일 출처(Same-Origin) 정책을 따른다. 다른 도메인의 URL로는 변경 불가.

---

### replaceState

`pushState`와 유사하지만, 새 항목을 추가하는 대신 **현재 항목을 교체**한다.

```jsx
history.replaceState(state, "", "/new-url");
// 뒤로 가기 시 이전 URL이 아닌, 그 전 URL로 이동
```

| 메서드         | 히스토리 스택 변화  |
| -------------- | ------------------- |
| `pushState`    | 스택에 새 항목 추가 |
| `replaceState` | 현재 항목을 덮어씀  |

---

### popstate 이벤트

#### 발생 시점

- 사용자가 브라우저의 **뒤로 가기 / 앞으로 가기** 버튼을 누를 때
- `history.back()`, `history.forward()`, `history.go(n)` 호출 시에도 발생
- ⚠️ `pushState` 또는 `replaceState`를 호출할 때는 `popstate` 발생 ❌

#### 이벤트 객체

```jsx
window.addEventListener("popstate", (event) => {
  console.log(event.state); // pushState 시 저장한 state 객체
  console.log(location.pathname); // 이동한 URL의 경로
});
```

---

## 전체 리로드 vs. pushState/popstate 비교

| 비교 항목   | 전체 리로드              | pushState + popstate            |
| ----------- | ------------------------ | ------------------------------- |
| 서버 요청   | 매번 새 HTTP 요청        | 없음 (최초 로드 1회만)          |
| DOM 처리    | 전체 파괴 후 재생성      | 변경 부분만 업데이트            |
| 상태 유지   | 모든 JS 상태 초기화      | 상태 유지 가능                  |
| 화면 깜빡임 | 발생                     | 없음                            |
| 속도        | 느림 (네트워크 + 렌더링) | 빠름                            |
| URL 변경    | 자동                     | `pushState` 직접 호출 필요      |
| 히스토리    | 자동 관리                | 직접 관리 필요                  |
| 새로고침 시 | 정상 동작                | 서버 설정 필요                  |
| 검색엔진    | 용이                     | SSR/Prerendering 필요할 수 있음 |

---

<br>
<br>

# 전체 리로드 방식과 SPA 라우팅 방식의 가장 큰 차이는 무엇일까? 🍠

## 핵심 차이

> **전체 리로드 방식**: 페이지 이동마다 서버에서 새 HTML 문서를 받아 브라우저가 전체를 다시 그린다.
>
> **SPA 라우팅 방식**: 최초 한 번만 HTML을 받고, 이후 페이지 전환은 JavaScript가 DOM을 직접 교체한다.

---

## 1️⃣ 전체 리로드(MPA, Multi-Page Application) 방식

### 동작 흐름

```jsx
[사용자] 링크 클릭
    ↓
[브라우저] 서버에 GET /about HTTP 요청
    ↓
[서버] /about에 해당하는 완전한 HTML 파일 응답
    ↓
[브라우저] 기존 DOM 전체 파괴
    ↓
[브라우저] 새 HTML 파싱 → CSS 재적용 → JS 재실행 → 렌더링
    ↓
[사용자] 새 페이지 표시 (화면 깜빡임 동반)
```

### 요청/응답 구조

```jsx
GET /home    → 서버가 home.html 전체 반환
GET /about   → 서버가 about.html 전체 반환
GET /contact → 서버가 contact.html 전체 반환
```

👉 페이지마다 `<html>`, `<head>`, `<body>`, 공통 헤더/푸터, CSS, JS 파일 등이 **매번 반복하여 전송**된다.

### ✔️ 장점

- 서버가 각 URL에 대해 완전한 HTML을 응답하므로 **검색엔진(SEO) 색인에 유리**하다.
- 초기 로딩 시 JavaScript 없이도 콘텐츠가 표시되므로 **접근성이 좋다.**
- 브라우저가 네이티브로 히스토리와 뒤로 가기를 처리하므로 **구현이 단순하다.**
- 페이지 간 상태가 격리되어 **메모리 누수 위험이 적다.**

### ✔️ 단점

- 페이지 이동마다 전체 화면이 깜빡이는 **UX 저하** 발생
- 공통 레이아웃(헤더, 네비게이션 등)도 매번 다시 렌더링하는 **비효율**
- 서버 부하가 높고 **네트워크 비용이 크다**
- 클라이언트 상태(입력값, 스크롤 위치, 모달 상태 등)가 **페이지 이동 시 초기화**된다.

---

## 2️⃣ SPA 라우팅(Single Page Application) 방식

### 동작 흐름

```jsx
[사용자] 최초 접근
    ↓
[브라우저] 서버에 GET / 요청 → index.html + JS 번들 수신
    ↓
[브라우저] React/Vue 앱 초기화, 라우터 설정 완료
    ↓
[사용자] 링크 클릭
    ↓
[JavaScript] e.preventDefault() → 브라우저 기본 동작 차단
    ↓
[React Router] history.pushState() → URL만 변경 (서버 요청 없음)
    ↓
[React Router] URL에 매칭되는 컴포넌트만 DOM에서 교체
    ↓
[사용자] 페이지 전환 완료 (깜빡임 없음)
```

### 요청/응답 구조

```jsx
GET /          → index.html + app.js 수신 (최초 1회)
이후 라우팅    → 네트워크 요청 없음 (또는 API 데이터만 요청)

API 호출 예:
GET /api/about → JSON 데이터만 수신 → 컴포넌트에서 렌더링
```

### ✔️ 장점

- 페이지 전환 시 화면이 깜빡이지 않아 **앱과 유사한 부드러운 UX** 제공
- 공통 레이아웃은 유지하고 **변경된 컴포넌트만 교체**하므로 렌더링 효율이 높다.
- 클라이언트 상태(전역 상태, 캐시 등)를 **페이지 간에도 유지**할 수 있다.
- API 서버와 분리되어 **프론트엔드와 백엔드를 독립적으로 개발·배포** 가능

### ✔️ 단점

- 최초 JS 번들 로딩 시간이 길 수 있음 (**초기 로딩 느림**, Code Splitting으로 완화 가능)
- JavaScript가 비활성화된 환경에서는 **콘텐츠가 보이지 않는다.**
- 검색엔진이 JS를 제대로 실행하지 못하면 **SEO 불리** (SSR, Prerendering으로 해결)
- 새로고침/직접 URL 접근 시 서버가 `index.html`을 응답하도록 **서버 설정 필요**

---

## 렌더링의 책임 주체

| 항목                         | 전체 리로드(MPA)    | SPA 라우팅             |
| ---------------------------- | ------------------- | ---------------------- |
| **렌더링 책임**              | 서버                | 클라이언트(JavaScript) |
| **페이지 이동 시 서버 요청** | 매번 발생           | 발생하지 않음          |
| **DOM 처리**                 | 전체 파괴 후 재생성 | 변경 컴포넌트만 교체   |
| **화면 깜빡임**              | 있음                | 없음                   |
| **초기 로딩**                | 빠름                | 느릴 수 있음           |
| **이후 네비게이션 속도**     | 느림                | 빠름                   |
| **상태 유지**                | 불가                | 가능                   |
| **SEO**                      | 유리                | 추가 설정 필요         |
| **서버 부하**                | 높음                | 낮음 (정적 파일 제공)  |

---

## 예제

### 전체 리로드 방식 (전통적인 서버 렌더링)

```html
<a href="/about">소개 페이지</a>
<!-- 클릭 시: 서버에 GET /about 요청 → 새 HTML 수신 → 전체 렌더링 -->
```

### SPA 라우팅 방식 (React Router)

```jsx
import { Link, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <nav>
        {/* 클릭 시: pushState('/about') → 서버 요청 없이 URL 변경 */}
        <Link to="/about">소개 페이지</Link>
      </nav>
      <Routes>
        {/* URL에 따라 컴포넌트만 교체, 나머지 DOM 유지 */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
```

---

## 하이브리드 접근: SSR + SPA (Next.js 등)

현대적인 프레임워크는 두 방식의 장점을 결합한다.

```jsx
최초 접근:    서버가 완전한 HTML 렌더링 → 빠른 초기 로딩 + SEO 유리
이후 이동:    클라이언트에서 SPA 방식으로 처리 → 부드러운 UX
```

👉 이를 **Hydration(하이드레이션)** 이라고 부른다

- 서버에서 보낸 정적 HTML에 JavaScript가 붙어서 인터랙티브하게 만드는 과정.
  ***
  <br>
  <br>

# preventDefault()와 stopPropagation()의 차이와 역할은 무엇인가? 🍠

## 핵심 차이

| 메서드              | 무엇을 막는가                              | 이벤트 전파는?     |
| ------------------- | ------------------------------------------ | ------------------ |
| `preventDefault()`  | **브라우저의 기본 동작**을 막는다          | 전파는 계속됨      |
| `stopPropagation()` | **이벤트의 전파(버블링/캡처링)** 를 막는다 | 기본 동작은 계속됨 |

---

## preventDefault()

브라우저는 특정 이벤트에 대해 **기본적으로 정해진 동작**을 수행한다.
👉 `preventDefault()`는 이 기본 동작을 취소한다.

### 브라우저 기본 동작 예시

| 이벤트                         | 기본 동작                              |
| ------------------------------ | -------------------------------------- |
| `<a>` 클릭                     | 해당 href로 페이지 이동                |
| `<form>` submit                | 폼 데이터를 서버로 전송 후 페이지 이동 |
| `<input type="checkbox">` 클릭 | 체크 상태 토글                         |
| 마우스 우클릭                  | 컨텍스트 메뉴 표시                     |
| 스페이스바 누르기              | 페이지 스크롤                          |
| 드래그                         | 텍스트 선택 또는 파일 드래그           |

### 주의사항

```jsx
// preventDefault()를 호출해도 이벤트 전파는 멈추지 않는다
element.addEventListener("click", (e) => {
  e.preventDefault();
  // 이 이벤트는 여전히 부모 요소로 버블링됨
});
```

### 예시

#### 1️⃣ SPA 라우팅에서의 링크 처리

```jsx
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // 페이지 이동(리로드)을 막음

    const path = e.target.getAttribute("href");
    history.pushState({}, "", path); // URL만 변경
    render(path); // 컴포넌트 교체
  });
});
```

#### 2️⃣ 폼 기본 제출 방지

```jsx
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault(); // 서버로의 폼 전송 + 페이지 이동 방지

  const data = new FormData(e.target);
  fetch("/api/submit", { method: "POST", body: data }); // 직접 비동기 처리
});
```

---

## stopPropagation()

### 이벤트 전파(Event Propagation)

DOM 이벤트는 발생 후 세 단계로 전파된다.

```jsx
캡처링 단계 (위에서 아래로):
document → html → body → div → button

타겟 단계:
button (이벤트 발생)

버블링 단계 (아래에서 위로):
button → div → body → html → document
```

```html
<div id="outer">
  <div id="inner">
    <button id="btn">클릭</button>
  </div>
</div>
```

```jsx
document.getElementById("outer").addEventListener("click", () => {
  console.log("outer 클릭됨");
});

document.getElementById("inner").addEventListener("click", () => {
  console.log("inner 클릭됨");
});

document.getElementById("btn").addEventListener("click", () => {
  console.log("button 클릭됨");
});

// btn 클릭 시 출력:
// "button 클릭됨"
// "inner 클릭됨"
// "outer 클릭됨"  ← 버블링으로 부모까지 이벤트 전달됨
```

### stopPropagation() 사용

```jsx
document.getElementById("btn").addEventListener("click", (e) => {
  e.stopPropagation(); // 버블링 차단
  console.log("button 클릭됨");
});

// btn 클릭 시 출력:
// "button 클릭됨"
// (inner, outer의 핸들러는 실행되지 않음)
```

### 예시

#### 1️⃣ 모달 닫기 방지

```jsx
// 배경 클릭 시 모달 닫기
document.getElementById("backdrop").addEventListener("click", () => {
  closeModal();
});

// 모달 내부 클릭 시 닫히지 않도록
document.getElementById("modal").addEventListener("click", (e) => {
  e.stopPropagation(); // backdrop으로 이벤트 버블링 방지
});
```

#### 2️⃣ 중첩된 클릭 이벤트 분리

```jsx
// 카드 컴포넌트 전체 클릭 → 상세 페이지 이동
card.addEventListener("click", () => {
  navigate("/detail");
});

// 카드 내부의 좋아요 버튼 클릭 → 좋아요 토글만 (카드 이동 X)
likeButton.addEventListener("click", (e) => {
  e.stopPropagation(); // 카드의 클릭 이벤트 차단
  toggleLike();
});
```

---

## stopImmediatePropagation()

`stopPropagation()`의 강화 버전으로, **같은 요소에 등록된 다른 핸들러도 실행하지 않는다.**

```jsx
button.addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  console.log("첫 번째 핸들러");
});

button.addEventListener("click", () => {
  // stopImmediatePropagation() 때문에 실행되지 않음
  console.log("두 번째 핸들러");
});
```

| 메서드                       | 같은 요소의 다른 핸들러 | 부모 요소 핸들러 |
| ---------------------------- | ----------------------- | ---------------- |
| `stopPropagation()`          | 실행됨                  | 실행 안 됨       |
| `stopImmediatePropagation()` | 실행 안 됨              | 실행 안 됨       |

---

## 두 메서드 동시에 사용하기

두 메서드는 **서로 독립적**이므로 동시에 사용할 수 있다.

```jsx
form.addEventListener("submit", (e) => {
  e.preventDefault(); // 폼 기본 제출 방지
  e.stopPropagation(); // 부모의 submit 핸들러로 전파 방지

  handleSubmit();
});
```

---

## event.cancelable 확인하기

모든 이벤트가 `preventDefault()`를 지원하는 것은 아니다.

```jsx
element.addEventListener("scroll", (e) => {
  console.log(e.cancelable); // false → preventDefault() 효과 없음
  e.preventDefault(); // 이미 발생한 스크롤은 취소 불가
});

// passive 이벤트 리스너와의 충돌 주의
element.addEventListener("touchmove", handler, { passive: true });
// passive: true로 등록된 경우 preventDefault() 호출 시 경고 발생
```

---

<br><br>

# 선언적 라우팅(Route, Routes) 구조가 가지는 장점은 무엇일까? 🍠

## 선언적(Declarative) 프로그래밍이란?

프로그래밍 패러다임:

| 패러다임                | 핵심 질문                | 특징             |
| ----------------------- | ------------------------ | ---------------- |
| **명령형(Imperative)**  | "어떻게 할 것인가(How)?" | 절차를 직접 기술 |
| **선언형(Declarative)** | "무엇을 원하는가(What)?" | 결과 상태를 기술 |

선언형의 대표적인 예:

- SQL: `SELECT * FROM users WHERE age > 20` → 어떻게 찾을지가 아닌 "무엇을 원하는지"만 기술
- HTML: `<button>클릭</button>` → 버튼을 어떻게 그릴지가 아닌 버튼이 있다는 것만 기술
- React JSX: UI의 최종 상태를 선언하면 React가 DOM을 처리

---

## 명령형 라우팅 vs 선언적 라우팅 비교

### 1️⃣ 명령형 라우팅 (Vanilla JS)

```jsx
// "어떻게" 라우팅을 처리할지 직접 기술
function handleRoute(path) {
  const app = document.getElementById("app");

  if (path === "/") {
    app.innerHTML = "<div>홈 페이지</div>";
  } else if (path === "/about") {
    app.innerHTML = "<div>소개 페이지</div>";
  } else if (path === "/users") {
    app.innerHTML = "<div>사용자 목록</div>";
  } else if (path.startsWith("/users/")) {
    const id = path.split("/")[2];
    app.innerHTML = `<div>사용자 ${id} 상세</div>`;
  } else {
    app.innerHTML = "<div>404 Not Found</div>";
  }
}

window.addEventListener("popstate", () => handleRoute(location.pathname));
document.addEventListener("DOMContentLoaded", () =>
  handleRoute(location.pathname),
);
```

**✔️ 문제점:**

- URL 패턴이 늘어날수록 if-else 분기가 끝없이 증가한다.
- 중첩 라우트(레이아웃 공유 등)를 표현하기 매우 어렵다.
- 라우팅 구조를 한눈에 파악하기 어렵다.
- 파라미터 추출, 쿼리스트링 파싱 등을 직접 구현해야 한다.

### 2️⃣ 선언적 라우팅 (React Router v6)

```jsx
// "무엇이 있는지"를 JSX로 선언
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

👉 라우팅 구조가 **시각적으로 명확**하고, URL과 컴포넌트의 매핑이 한눈에 보인다.

---

## 선언적 라우팅의 장점

### 1️⃣ 가독성과 구조 파악의 용이성

라우팅 설정이 JSX 트리로 표현되므로, **앱의 전체 URL 구조를 한눈에 파악**할 수 있다.

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="settings" element={<Settings />} />

    <Route path="users">
      <Route index element={<UserList />} />
      <Route path=":id" element={<UserDetail />} />
      <Route path=":id/edit" element={<UserEdit />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>
```

이 코드만 보고도 앱의 URL 계층 구조 전체를 즉시 이해할 수 있다:

- `/` → Layout + Home
- `/dashboard` → Layout + Dashboard
- `/users` → Layout + UserList
- `/users/:id` → Layout + UserDetail
- 그 외 → Layout + NotFound

---

### 2️⃣ 중첩 라우팅(Nested Routing)과 레이아웃 공유

공통 레이아웃(헤더, 사이드바 등)을 **중복 없이 공유**할 수 있다.

```jsx
// Layout 컴포넌트
function Layout() {
  return (
    <div>
      <Header /> {/* 모든 페이지에서 공유 */}
      <Sidebar /> {/* 모든 페이지에서 공유 */}
      <main>
        <Outlet /> {/* 자식 Route의 컴포넌트가 여기 렌더링됨 */}
      </main>
      <Footer />
    </div>
  );
}

// 라우팅 설정
<Route path="/" element={<Layout />}>
  {/* Layout은 유지된 채 Outlet 위치만 교체됨 */}
  <Route path="home" element={<Home />} />
  <Route path="about" element={<About />} />
</Route>;
```

> 명령형 방식으로는 레이아웃 공유를 위해 매 페이지마다 헤더/사이드바 렌더링 코드를 반복해야 했거나,
> 복잡한 템플릿 시스템이 필요했다.

---

### 3️⃣ URL 파라미터와 쿼리스트링 자동 처리

```jsx
// 선언
<Route path="/users/:id" element={<UserDetail />} />;

// 컴포넌트에서 자동으로 파라미터 접근
function UserDetail() {
  const { id } = useParams(); // ':id' 자동 파싱
  return <div>사용자 ID: {id}</div>;
}
```

```jsx
// 쿼리스트링 처리
function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // ?q=react 자동 파싱
  return <div>검색어: {query}</div>;
}
```

> 명령형으로는 `location.pathname.split('/')`, `URLSearchParams` 등을 직접 파싱해야 한다.

---

### 4️⃣ React 컴포넌트 모델과의 자연스러운 통합

선언적 라우팅은 **React의 컴포넌트 합성(Composition) 철학**과 일치한다.
👉 라우트 자체가 컴포넌트이므로, React의 모든 기능을 그대로 활용할 수 있다.

```jsx
// 인증 보호 라우트를 컴포넌트로 추상화
function PrivateRoute({ element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
}

// 사용 시 자연스럽게 조합
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
  <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
</Routes>;
```

---

### 5️⃣ 유지보수와 확장성

라우트를 추가하거나 변경할 때 **JSX 트리에 한 줄만 추가**하면 된다.

```jsx
// 기존 코드
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>

// 새 페이지 추가 → 한 줄 추가
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/blog" element={<Blog />} />  {/* 추가 */}
</Routes>
```

> 명령형 방식에서는 새 분기를 찾아서 삽입하고, 순서와 우선순위를 고려해야 한다.

---

### 6️⃣ Code Splitting과의 쉬운 통합

선언적 라우팅은 React의 `lazy()`와 `Suspense`와 자연스럽게 결합된다.

```jsx
import { lazy, Suspense } from "react";

// 각 페이지를 지연 로딩 → 초기 번들 크기 감소
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

👉 각 Route에 해당하는 컴포넌트가 실제로 필요할 때만 JS 번들을 로드하므로,
**앱 초기 로딩 성능이 크게 향상**된다.

---

### 7️⃣ 테스트 용이성

선언적 라우팅은 라우팅 구조를 컴포넌트 트리로 표현하므로, **라우팅 로직을 단위 테스트하기 쉽다.**

```jsx
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

test("about 경로에서 About 컴포넌트가 렌더링됨", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/about"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(getByText("소개 페이지")).toBeInTheDocument();
});
```

---

<br><br>

# fetch

## `fetch`란?

**👉 브라우저에서 서버로 HTTP 요청을 보내고 응답을 받는 함수**

쉽게 말하면:

- 데이터 조회하기
- 데이터 등록하기
- 수정하기
- 삭제하기

이런 서버 통신을 할 때 사용한다.

리액트에서는 주로:

- 게시글 목록 불러오기
- 유저 정보 가져오기
- 로그인 요청 보내기
- 폼 제출하기

같은 작업에 많이 쓴다.

---

## 기본 문법

```jsx
fetch("<https://jsonplaceholder.typicode.com/posts>")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
```

### ✔️ 흐름

1. `fetch(url)` → 서버에 요청 보냄
2. `response` 받음
3. `response.json()` → JSON 데이터를 JS 객체로 변환
4. 실제 데이터 사용

---

## fetch는 Promise를 반환한다.

`fetch`는 비동기 함수다.

👉 결과를 바로 주는 게 아니라 **나중에 응답이 오면 Promise로 결과를 준다.**

```jsx
const result = fetch("/api/posts");
console.log(result); // Promise
```

그래서 보통 아래 두 방식 중 하나로 처리한다.

- `.then()`
- `async / await`

---

## async / await 방식

```jsx
async function getPosts() {
  const response = await fetch("/api/posts");
  const data = await response.json();
  console.log(data);
}
```

- `await fetch(...)` → 서버 응답 기다림
- `await response.json()` → JSON 파싱 기다림

---

## Response 객체

👉 `fetch`가 바로 데이터를 주는 게 아니라, 먼저 **Response 객체**를 준다.

```jsx
const response = await fetch("/api/posts");
console.log(response);
```

### 자주 쓰는 속성

#### 1️⃣ `response.status`

HTTP 상태 코드

```jsx
console.log(response.status);
```

예시:

- `200` 성공
- `201` 생성 성공
- `400` 잘못된 요청
- `401` 인증 필요
- `404` 없음
- `500` 서버 에러

#### 2️⃣ `response.ok`

성공 여부 (`200 ~ 299`)

```jsx
console.log(response.ok);
```

---

## `response.json()`이 필요한 이유

서버가 보낸 응답은 바로 JS 객체가 아니라 **JSON 형식의 데이터**일 수 있다.

👉 JS에서 쓰기 위해 파싱해야 한다.

```jsx
const response = await fetch("/api/posts");
const data = await response.json();
```

- ⚠️ 주의: `response.json()`도 비동기라서 `await` 필요함.

---

## 요청 메서드 종류

### 1️⃣ GET

데이터 조회

```jsx
fetch("/api/posts");
```

- 기본값이 GET이라 `method` 생략 가능.

---

### 2️⃣ POST

데이터 생성

```jsx
fetch("/api/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "제목",
    content: "내용",
  }),
});
```

- **`JSON.stringify()`를 쓰는 이유?**

  👉 자바스크립트 객체를 **JSON 문자열로 변환해서** 보내기 위해서이다.

---

### 3️⃣ PUT / PATCH

데이터 수정

```jsx
fetch("/api/posts/1", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "수정된 제목",
  }),
});
```

- `PUT` : 전체 수정 느낌
- `PATCH` : 일부 수정 느낌

---

### 4️⃣ DELETE

데이터 삭제

```jsx
fetch("/api/posts/1", {
  method: "DELETE",
});
```

---

## fetch 옵션 객체

**형태**

```jsx
fetch(url, options);
```

자주 쓰는 옵션:

- `method`
- `headers`
- `body`

**예시**

```jsx
fetch("/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "test@test.com",
    password: "1234",
  }),
});
```

---

## 에러 처리

fetch는 **HTTP 에러를 자동으로 catch하지 않는다.**

예를 들어 `404`, `500`이 와도 요청 자체는 끝났기 때문에 `catch`로 안 갈 수 있다.

👉 직접 확인 필요!!

```jsx
async function getData() {
  try {
    const response = await fetch("/api/posts");

    if (!response.ok) {
      throw new Error(`에러 발생: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

- 네트워크 자체 실패 → `catch`
- `404`, `500` 같은 HTTP 실패 → `response.ok`로 직접 확인

---

## React에서의 fetch 사용

- **`useEffect`** : 처음 화면이 열릴 때 데이터 불러오기
- **이벤트 핸들러**: 버튼 클릭, 폼 제출 등

### useEffect에서 fetch

```tsx
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
};

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
      );

      if (!response.ok) {
        throw new Error("게시글 요청 실패");
      }

      const data = await response.json();
      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default PostList;
```

- **`useEffect` 안에서 쓰는 이유?**

  👉 컴포넌트 함수 본문에서 바로 fetch를 하면 렌더링될 때마다
  요청이 다시 실행될 수 있기 때문

</aside>

---

## 로딩 / 에러 / 데이터 상태 관리

보통 3개를 같이 관리한다.

- `loading`
- `error`
- `data`

**예시**

```tsx
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
};

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
        );

        if (!response.ok) {
          throw new Error("유저 목록 불러오기 실패");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 자주 하는 실수, 주의할 점

### 1️⃣ `response.json()` 안 쓰기

```jsx
const response = await fetch("/api/posts");
console.log(response); // 실제 데이터 아님
```

👉 `response`는 Response 객체라서 실제 데이터는 `await response.json()`으로 꺼내야 한다.

---

### 2️⃣ `response.ok` 확인 안 하기

```jsx
const response = await fetch("/api/posts");
const data = await response.json();
```

👉 실패 응답을 그냥 지나갈 수 있다.

---

### 3️⃣ 컴포넌트 본문에서 바로 fetch 호출하기

```tsx
function App() {
  fetch("/api/posts"); // 위험
  return <div>hello</div>;
}
```

👉 렌더링될 때마다 요청될 수 있다.

---

## AbortController로 요청 취소하기

컴포넌트가 사라졌는데 응답이 늦게 오면 불필요한 상태 업데이트가 생길 수 있다.

이때 요청을 취소할 수 있다.

**예시**

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const response = await fetch("/api/posts", {
        signal: controller.signal,
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  fetchData();

  return () => {
    controller.abort();
  };
}, []);
```

---

<br><br>

# axios

## axios란?

👉 `axios`는 **브라우저와 Node.js에서 HTTP 요청을 보내기 위한 Promise 기반 라이브러리**

---

## 사용하는 이유

- 문법이 비교적 직관적임
- `response.data`로 실제 데이터를 꺼내기 편함
- 공통 `baseURL` 설정 가능
- 인터셉터로 토큰 처리, 공통 에러 처리 가능
- 요청 취소 기능 지원

이런 점들 때문이다. 응답 객체에는 `data`, `status`, `headers`, `config` 등이 포함된다.

---

## 가장 기본 형태

```tsx
import axios from "axios";

async function getPosts() {
  const response = await axios.get("/api/posts");
  console.log(response);
  console.log(response.data);
}
```

- Axios는 `axios(config)` 형태로 쓸 수 있다.
- `axios(url[, config])`, `axios.get(url[, config])` 같은 별칭 메서드를 제공한다.
- 실제 데이터는 보통 `response.data`에서 꺼낸다.

---

## 응답 객체 구조

```tsx
const response = await axios.get("/api/posts");

console.log(response.data);
console.log(response.status);
console.log(response.headers);
console.log(response.config);
```

Axios 응답 객체에는

- 서버가 보낸 데이터(`data`)
- 상태 코드(`status`)
- 헤더(`headers`)
- 요청 설정(`config`)

등이 들어 있다.

---

## GET 요청

👉 데이터 조회

- `get`은 `axios.get(url[, config])` 형태로 사용한다.

```tsx
const response = await axios.get("/api/posts");
const posts = response.data;
```

---

## POST 요청

👉 데이터 등록

- Axios는 `post(url[, data[, config]])` 형태를 제공한다.

```tsx
const response = await axios.post("/api/posts", {
  title: "제목",
  content: "내용",
});

console.log(response.data);
```

---

## PUT / PATCH / DELETE

- Axios는 수정/삭제용 별칭 메서드를 제공한다.

```tsx
await axios.put("/api/posts/1", {
  title: "전체 수정",
});

await axios.patch("/api/posts/1", {
  title: "일부 수정",
});

await axios.delete("/api/posts/1");
```

---

## params와 data 차이

### 1️⃣ params

URL 쿼리스트링으로 들어가는 값

```tsx
await axios.get("/api/posts", {
  params: {
    page: 1,
    limit: 10,
  },
});
```

### 2️⃣ data

POST, PUT, PATCH 같은 요청 본문에 들어가는 값

```tsx
await axios.post("/api/posts", {
  title: "제목",
  content: "내용",
});
```

- 공식 문서에서 `params`는 URL 파라미터, `data`는 요청 본문으로 설명한다.

- `params`는 일반 객체나 `URLSearchParams`를 사용할 수 있다.

---

## config 객체에서 자주 쓰는 것들

👉 `url`만 필수이며, `method`를 지정하지 않으면 기본은 `GET`이다.

**자주 사용하는 것들**:

- `baseURL`, `timeout`, `headers`, `params`, `withCredentials`, `signal` 등

```tsx
await axios.get("/api/posts", {
  baseURL: "http://localhost:3000",
  timeout: 3000,
  headers: {
    Authorization: "Bearer token값",
  },
  params: {
    page: 1,
  },
});
```

---

## 에러 처리

```tsx
try {
  const response = await axios.get("/api/posts");
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

- `error.response` : 서버가 응답은 했지만 상태 코드가 실패 범위인 경우
- `error.request` : 요청은 갔지만 응답을 못 받은 경우
- 그 외: 요청 설정 과정 등에서 생긴 에러

---

## `validateStatus`

Axios는 `200 ~ 299`를 성공으로 본다.

👉 이 기준을 바꾸고 싶으면 `validateStatus`를 설정할 수 있다.

```tsx
const response = await axios.get("/api/posts", {
  validateStatus: (status) => status < 500,
});
```

- `500` 미만 상태 코드는 reject하지 않도록 바꾼다.

---

## axios 인스턴스

👉 Axios는 `axios.create([config])`로 커스텀 설정이 들어간 인스턴스를 만들 수 있고,
이후 `instance.get`, `instance.post`처럼 재사용할 수 있다.

**예시**

```tsx
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 3000,
});
```

---

## 인스턴스를 만드는 이유

인스턴스를 만들면:

- 매번 `baseURL` 안 써도 됨
- 공통 헤더 설정 가능
- 토큰 주입 로직 재사용 가능
- 공통 에러 처리 붙이기 쉬움

👉 프로젝트 규모가 커질수록 `axios.get()`만 쓰는 것보다 인스턴스 방식이 관리하기 편하다.

- 인스턴스 설정은 개별 요청 설정과 병합되어 동작

---

## 인터셉터

👉 요청이나 응답이 `then` / `catch`로 가기 전에 중간에서 가로채는 기능

- 토큰 넣기, 공통 로그 처리, 401 에러 처리 등에 자주 사용된다.

### 1️⃣ 요청 인터셉터

```tsx
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
```

### 2️⃣ 응답 인터셉터

```tsx
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("인증 만료");
    }
    return Promise.reject(error);
  },
);
```

---

## 요청 취소

👉Axios는 `AbortController`의 `signal`을 이용한 요청 취소를 지원한다.

- 공식 문서에서는 `CancelToken`도 소개하지만, 이 API는 **deprecated**라서 새 프로젝트에서는 `signal` 방식이 권장된다.

**예시**

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function fetchPosts() {
    try {
      const response = await axios.get("/api/posts", {
        signal: controller.signal,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  fetchPosts();

  return () => {
    controller.abort();
  };
}, []);
```

---

## 자주 하는 실수, 주의할 점

### 1️⃣ `response`를 바로 데이터라고 생각하기

```tsx
const response = await axios.get("/api/posts");
console.log(response); // 전체 응답 객체
console.log(response.data); // 실제 데이터
```

👉 Axios는 전체 응답 객체를 반환하므로, 실제 서버 데이터는 `response.data`에서 꺼내야 한다.

### 2️⃣ 공통 URL을 매번 직접 쓰기

👉 인스턴스를 만들면 훨씬 편하다.

- `axios.create()`로 공통 설정을 묶을 수 있다.

### 3️⃣ 새 코드에서 `CancelToken` 쓰기

👉 새 코드에서는 `AbortController` + `signal` 사용하기

---

<br><br>

# fetch와 axios의 차이

## 1️⃣ 같은 요청 비교

### fetch

```tsx
const response = await fetch("/api/posts");

if (!response.ok) {
  throw new Error(`요청 실패: ${response.status}`);
}

const data = await response.json();
console.log(data);
```

`fetch()`는 응답이 와도 바로 실제 데이터가 아니라 `Response` 객체를 주기 때문에, `response.json()` 같은 메서드로 본문을 다시 읽어야 한다. 또 HTTP 에러는 자동 reject가 아니라서 직접 체크가 필요하다.

### axios

```tsx
import axios from "axios";

const response = await axios.get("/api/posts");
console.log(response.data);
```

Axios 응답 객체에는 `data`, `status`, `headers`, `config` 등이 들어 있고, 실무에서는 보통 `response.data`만 바로 꺼내 쓴다.

---

## 2️⃣ 에러 처리 차이

### fetch의 에러 처리

```tsx
try {
  const response = await fetch("/api/posts");

  if (!response.ok) {
    throw new Error(`HTTP 에러: ${response.status}`);
  }

  const data = await response.json();
} catch (error) {
  console.error(error);
}
```

`fetch`는 **네트워크 에러**일 때만 reject되는 구조라, `404`나 `500`은 `catch`로 바로 안 들어간다.

👉  `response.ok` 확인이 거의 필수다

### axios의 에러 처리

```tsx
try {
  const response = await axios.get("/api/posts");
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

Axios는 기본적으로 `2xx`가 아니면 reject되며, 에러 객체 안에서 `error.response`, `error.request`, `error.message`, `error.config` 같은 정보로 상황을 나눠 볼 수 있다.

---

## 3️⃣ 공통 설정 관리

### fetch

기본 내장 API라서, 프로젝트에서 공통 설정을 쓰려면 보통 직접 래퍼 함수를 만든다.

```tsx
async function request(url: string, options?: RequestInit) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`에러: ${response.status}`);
  }

  return response.json();
}
```

- `fetch(resource, options)` 형태로 옵션을 넘길 수는 있지만, Axios처럼 인스턴스 개념이 내장되어 있지는 않다.

### axios

인스턴스를 따로 만들어서 재사용할 수 있다.

```tsx
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 3000,
});
```

- Axios 문서상 `axios.create([config])`로 인스턴스를 만들 수 있고, 인스턴스 설정과 개별 요청 설정은 병합된다.

---

## 4️⃣ 인터셉터 차이

### fetch

인터셉터 기능이 따로 없다.

토큰 자동 주입, 공통 에러 처리 같은 건 직접 함수로 감싸서 구현해야 한다.

### axios

요청/응답 인터셉터를 공식 지원한다.

```tsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

- Axios는 `then`이나 `catch`로 가기 전에 요청/응답을 가로채 처리할 수 있다.

---

## 5️⃣ 취소 기능

- `fetch`는 `AbortController`로 취소할 수 있다. MDN은 요청이 abort되면 `AbortError`가 발생한다고 설명한다.
- `axios`도 `signal`을 지원하고, 문서상 `cancelToken`은 **deprecated**다.

👉 최신 방식 기준으로는 둘 다 `AbortController` 계열 흐름으로 생각하면 된다.

---

## 비교 정리

| 항목                 | fetch                 | axios                   |
| -------------------- | --------------------- | ----------------------- |
| 정체                 | 브라우저 내장 Web API | 외부 라이브러리         |
| 설치                 | 필요 없음             | 필요함                  |
| 실제 데이터 꺼내기   | `response.json()`     | `response.data`         |
| HTTP 에러 처리       | 직접 `ok/status` 확인 | 기본적으로 reject       |
| 공통 설정            | 직접 래핑 필요        | 인스턴스로 편하게 관리  |
| 인터셉터             | 없음                  | 있음                    |
| 브라우저/Node 공용성 | 브라우저 중심         | 브라우저 + Node.js 지원 |
