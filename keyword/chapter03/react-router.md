# React Router

## React Router란?

- React Router는 React 앱에서 <strong>라우팅(Routing)</strong>을 담당하는 대표적인 라이브러리임
- <strong>CSR(Client-Side Routing)</strong> 방식을 사용하여, 페이지 전체를 새로고침하지 않고 URL 경로에 따라 컴포넌트를 전환함
- 덕분에 <strong>SPA(Single Page Application)</strong> 구조를 유지하면서도, 여러 페이지가 있는 것처럼 자연스러운 네비게이션을 구현할 수 있음

---

## 웹에서의 Routing 기본 개념

### Routing(라우팅)이란?

- `Routing`(라우팅)은 사용자가 웹 브라우저의 주소창에 <strong>URL을 입력</strong>하거나 링크를 클릭했을 때,  
  그 URL에 맞는 <strong>페이지나 데이터를 찾아 사용자에게 보여주는 과정</strong>을 의미함

### 전통적인 라우팅 동작 방식

1. 사용자가 특정 <strong>URL</strong>을 입력하거나, 링크를 클릭해 새로운 페이지를 요청함
2. 서버가 해당 <strong>URL</strong>에 매핑된 자원을 찾아 응답함
3. 서버는 해당 URL과 매핑된 <strong>HTML, CSS, JavaScript 파일</strong>을 클라이언트(브라우저)로 전달함
4. 브라우저는 받은 데이터를 <strong>렌더링</strong>하여 화면에 페이지를 표시함
5. 이 과정에서 <strong>전체 페이지가 새로고침</strong>되며, 새로운 HTML이 다시 로드됨

### 라우팅 예시

- 사용자가 `https://matthew.com/home`을 입력하면
  - 서버는 `home.html` 파일을 찾아서 반환하고, 브라우저가 화면에 띄움
- 사용자가 `https://matthew.com/about`을 입력하면
  - 서버는 `about.html` 파일을 반환하고, 새로운 페이지가 로드됨

- 즉, <strong>URL마다 다른 페이지</strong>가 로드되는 것이 전통적인 라우팅 방식임

---

## CSR (Client-Side Rendering)

### CSR 개념

- <strong>Client-Side Rendering</strong>은 React, Vue, Angular 같은 SPA(Single Page Application)에서 사용하는 렌더링/라우팅 방식임
- 초기 로딩 시 하나의 HTML(`index.html`)과 번들된 JS/CSS를 내려받고, 이후에는 <strong>클라이언트(브라우저)에서 라우팅과 화면 전환을 처리</strong>함

### CSR 동작 방식

1. 사용자가 처음 웹사이트에 접속하면, 서버는 <strong>index.html (하나의 파일)</strong>과 관련 JS/CSS만 내려줌
2. 이후 사용자가 `https://matthew.com/about` 같은 새로운 경로로 이동하면
   - 서버에 새로운 HTML을 요청하는 것이 아니라
   - <strong>앱 내부에서 필요한 데이터만 불러와 기존 화면 일부만 업데이트</strong>함
3. Navbar, Sidebar 같은 공통 UI는 그대로 유지되고,
   - 메인 콘텐츠 영역만 바뀜

- 따라서 <strong>페이지 전체 새로고침이 일어나지 않음</strong>

### CSR 특징

- 장점
  - 페이지 이동이 훨씬 빠르고, 앱(App)처럼 부드럽게 동작함
  - 서버 요청 횟수가 줄어들어 네트워크 비용이 절감될 수 있음
  - 공통 레이아웃(헤더, 푸터, 사이드바 등)을 유지한 채 필요한 부분만 교체 가능
- 단점
  - 초기 로딩 시 내려받는 JS 번들이 커질 수 있어, SSR보다 첫 진입 속도가 느릴 수 있음
  - HTML이 비어 있는 상태에서 JS로 내용을 채우기 때문에, 검색 엔진(SEO)에 불리할 수 있음  
    → Next.js 같은 프레임워크가 이를 보완해 줌

### CSR 예시

- React로 만든 SPA 앱
- Vue로 만든 SPA 앱
- Angular로 만든 SPA 앱

---

## SSR (Server-Side Rendering)

### SSR 개념

- <strong>Server-Side Rendering</strong>은 전통적인 웹 사이트에서 사용되는 렌더링/라우팅 방식임
- 각 요청마다 서버에서 HTML을 생성(또는 찾아) 반환하고, 브라우저는 그 HTML을 그대로 렌더링함

### SSR 동작 방식

1. 사용자가 주소창에 `https://matthew.com/about`을 입력함
2. 브라우저가 해당 URL에 대해 <strong>서버에 새로운 페이지를 요청</strong>함
3. 서버는 요청에 맞는 <strong>HTML, CSS, JS</strong> 파일을 찾아서 다시 클라이언트로 전송함
4. 브라우저는 받은 파일을 새로 렌더링함

- 즉, <strong>페이지를 이동할 때마다 전체 새로고침</strong>이 발생함

### SSR 특징

- 장점
  - 서버에서 완성된 HTML을 바로 내려주므로, 초기 로딩 속도가 빠른 편임
  - 검색 엔진(SEO)에 유리함 (검색 엔진이 HTML 내용을 바로 읽을 수 있음)
- 단점
  - 페이지 이동 시마다 새로고침이 발생해 UX가 부드럽지 않을 수 있음
  - 페이지마다 서버에서 HTML을 생성/조립해야 하므로, 서버 부하가 커질 수 있음

### SSR 예시

- 전통적인 PHP, JSP, ASP 기반 웹사이트
- 최신 프레임워크 기반 SSR
  - <strong>Next.js</strong> (React 기반 SSR & SSG 지원)
  - <strong>Nuxt.js</strong> (Vue 기반 SSR & SSG 지원)
  - <strong>Astro</strong> (멀티 프레임워크 지원, SSR/SSG 가능)

---

## React Router 요약

### React Router의 역할

- React Router는 React 애플리케이션에서 <strong>CSR 기반 라우팅</strong>을 구현하기 위한 핵심 라이브러리임
- <strong>URL 경로와 컴포넌트</strong>를 매핑하여, 경로에 따라 어떤 컴포넌트를 보여줄지 선언적으로 정의할 수 있음
- 실제로는 하나의 HTML 페이지(SPA)만 존재하지만, URL이 바뀔 때마다 해당 경로에 대응하는 컴포넌트만 교체되므로, 여러 페이지가 있는 것처럼 동작함

### React Router를 사용하는 이유

1. <strong>URL 경로 활용</strong>
   - `https://matthew.com/about`처럼 경로가 달라지면, 브라우저의 <strong>History API</strong>를 이용해 상태를 관리함
   - 앞으로 가기/뒤로 가기 버튼이 자연스럽게 동작함
2. <strong>주소 복사 및 공유</strong>
   - 사용자가 특정 경로(예: `/about`)에 있을 때, URL을 복사하여 공유하면 상대방도 동일한 화면을 바로 볼 수 있음
   - 별도 라우팅 처리를 하지 않으면, SPA는 새로고침 시 항상 초기 화면(Home)만 보이는 문제가 생김
3. <strong>성능 최적화</strong>
   - 전체 페이지를 다시 불러오지 않고, 필요한 부분만 변경하므로 불필요한 네트워크 요청을 줄일 수 있음
   - 사용자는 <strong>더 빠르고 자연스러운 화면 전환</strong>을 경험할 수 있음
4. <strong>좋은 UX</strong>
   - 서버 렌더링 방식처럼 페이지가 깜빡이거나 전체 새로고침되는 현상이 없음
   - 네이티브 앱에 가까운, 부드러운 네비게이션 경험을 제공할 수 있음

---

<strong>정리하자면</strong>, React Router는 SPA 구조를 유지하면서도 <strong>URL 기반 네비게이션, 주소 공유, 브라우저 기록 관리, 부드러운 화면 전환</strong>까지 한 번에 해결해 주는 라우팅 라이브러리임

---

## React Router 실습 요약

### 1. 기본 라우터 설정 (`createBrowserRouter`, `RouterProvider`)

- `createBrowserRouter`로 <strong>경로(path)와 화면(element)</strong>을 선언함
- `RouterProvider`에 router를 전달해야 실제 앱에서 라우팅이 동작함
- 예: `/`는 홈, `/movies`는 영화 페이지처럼 매핑 가능

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <h1>홈 페이지입니다.</h1> },
  { path: '/movies', element: <h1>영화 페이지 입니다.</h1> },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### 2. 지정하지 않은 경로 처리 (`errorElement`, `*`)

- 정의되지 않은 경로로 접근하면 기본적으로 404가 발생함
- `errorElement`를 사용하면 라우트 에러/매칭 실패 시 보여줄 UI를 지정할 수 있음
- `path: '*'` 라우트를 두면 전용 NotFound 페이지를 만들 수 있음
- 보통은 <strong>`*`는 일반 404 처리</strong>, <strong>`errorElement`는 라우트 에러 처리</strong>처럼 역할을 나누면 깔끔함

### 3. 레이아웃 공유 (`Outlet`)와 이동 (`Link`)

- 공통 레이아웃(예: Navbar)을 유지하려면 부모 라우트에 레이아웃 컴포넌트를 두고 `children`을 사용함
- 레이아웃 컴포넌트 내부의 `Outlet` 위치에 자식 라우트가 렌더링됨
- 페이지 이동은 `<a>` 대신 `Link`를 사용해 SPA 방식으로 처리함

```tsx
// layout
import { Outlet } from 'react-router-dom';

const RootLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);
```

### 4. 동적 라우팅 (`useParams`)

- `path: 'movies/:movieId'`처럼 `:파라미터` 형태로 동적 경로를 정의할 수 있음
- `useParams()`로 URL 파라미터를 읽어 상세 페이지 데이터를 조회할 수 있음
- 예: `/movies/1`, `/movies/123`, `/movies/abc`는 같은 컴포넌트를 렌더링하고 `movieId` 값만 달라짐

```tsx
import { useParams } from 'react-router-dom';

const MoviesPage = () => {
  const { movieId } = useParams();
  return <h1>{movieId}번의 Movies Page</h1>;
};
```

### 한 줄 정리

- React Router 실습의 핵심은 <strong>라우트 선언</strong> → <strong>에러/404 처리</strong> → <strong>레이아웃 중첩</strong> → <strong>동적 파라미터 처리</strong> 순서로 이해하는 것임


