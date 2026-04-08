- **React Router**란?
    
    <aside>
    🍠
    
    **React Router 설명 이전에 아래의 내용을 먼저 학습하면 이해가 빨라져요!**
    
    </aside>
    
    - Routing (라우팅)
        
        # Routing (라우팅)
        
        `Routing`(라우팅)은 사용자가 웹 브라우저의 주소창에 **URL을 입력**했을 때,
        
        그 URL에 맞는 **페이지나 데이터를 찾아 사용자에게 보여주는 과정**이에요.
        
        ---
        
        ## Routing의 동작 원리
        
        1. 사용자가 특정 **URL**을 입력하거나, 링크를 클릭해 새로운 페이지를 요청해요.
        2. 요청된 **URL**에 해당하는 데이터를 서버가 찾아 응답해요.
        3. 서버는 해당 URL과 매핑된 **HTML, CSS, JavaScript 파일**을 클라이언트(사용자 브라우저)로 전달해요.
        4. 브라우저는 받은 데이터를 **렌더링**하여 화면에 페이지를 표시해요.
        5. 이 과정에서 **전체 페이지가 새로고침**되며, 새로운 HTML이 다시 로드돼요.
        
        ---
        
        ## Routing의 예시
        
        - 사용자가 `https://matthew.com/home`을 입력하면,
            
            서버는 `home.html` 파일을 찾아서 반환하고 브라우저가 화면에 띄워줘요.
            
        - 사용자가 `https://matthew.com/about`을 입력하면,
            
            서버는 `about.html` 파일을 반환하고 새로운 페이지가 로드돼요.
            
        
        즉, **URL마다 다른 페이지**가 로드되는 게 바로 "라우팅"이에요.
        
    - CSR (Client Side Rendering)
        
        ## CSR (Client-Side Routing)
        
        **Client-Side Rendering, 클라이언트 사이드 라우팅**은 React, Vue, Angular 같은 SPA(Single Page Application)에서 사용하는 방식이에요.
        
        ---
        
        ### 동작 방식
        
        1. 사용자가 처음 웹사이트에 접속하면, 서버는 **index.html (하나의 파일)**과 관련된 JS/CSS만 내려줘요.
        2. 이후 사용자가 `https://matthew.com/about` 같은 새로운 경로로 이동하면,
            
            서버에 새로운 HTML을 요청하는 것이 아니라,
            
            **앱 내부에서 필요한 데이터만 불러와 기존 화면 일부만 업데이트**해요.
            
        3. Navbar, Sidebar 같은 공통 UI는 유지되고,
            
            메인 콘텐츠(main body)만 바뀌어요.
            
        
        즉, **페이지 전체 새로고침이 일어나지 않아요.**
        
        ---
        
        ### 특징
        
        - 장점
            - 페이지 이동이 훨씬 빠르고, 앱처럼 부드럽게 동작해요.
            - 서버 요청이 줄어들어 네트워크 비용이 줄어들 수 있어요.
            - 공통 UI(헤더, 푸터, 사이드바 등)를 유지하면서 필요한 부분만 바꿀 수 있어요.
        - 단점
            - 초기 로딩 속도가 SSR보다 느릴 수 있어요 (처음에 JS를 많이 받아야 하기 때문).
            - SEO에 불리할 수 있어요 (검색 엔진이 JS 실행 전에는 내용을 못 읽음 → Next.js 같은 프레임워크가 이를 보완).
        
        ---
        
        ### 예시
        
        - React로 만든 SPA 앱.
        - Vue로 만든 SPA 앱.
        - Angular로 만든 SPA 앱.
    - SSR (Server Side Rendering)
        
        ## SSR (Server-Side Routing)
        
        **Server-Side Rendering, 서버 사이드 라우팅**은 전통적인 웹사이트에서 사용되는 방식이에요.
        
        ---
        
        ### 동작 방식
        
        1. 사용자가 주소창에 `https://matthew.com/about`을 입력해요.
        2. 브라우저는 **서버에 새로운 페이지를 요청**해요.
        3. 서버는 해당 요청에 맞는 **HTML, CSS, JS** 파일을 찾아서 다시 보내줘요.
        4. 브라우저는 받은 파일을 새로 그려요.
        
        즉, **페이지를 이동할 때마다 전체 새로고침**이 발생해요.
        
        ---
        
        ### 특징
        
        - 장점
            - 초기 로딩 속도가 빠른 편이에요 (바로 HTML을 받아오기 때문).
            - 검색 엔진(SEO)에 유리해요. (Google, Naver 같은 검색 엔진이 HTML 내용을 쉽게 읽을 수 있어요).
        - 단점
            - 페이지 이동 시마다 새로고침이 발생해서 UX가 부드럽지 않아요.
            - 서버 부하가 커질 수 있어요 (페이지마다 매번 서버에서 새 HTML을 만들어줘야 해요).
        
        ---
        
        ### 예시
        
        - 전통적인 PHP, JSP, ASP 기반 웹사이트.
        - 최신 프레임워크 기반 SSR:
            - **Next.js** (React 기반 SSR & SSG 지원)
            - **Nuxt.js** (Vue 기반 SSR & SSG 지원)
            - **Astro** (멀티 프레임워크 지원, 기본적으로 SSR/SSG 가능)
        
        <aside>
        🍠
        
        **TMI**
        
        여러분들이 보시는 저의 블로그인 [YOLOG](https://www.yolog.co.kr/)도 Astro라는 프레임워크로 제작되었어요!
        
        </aside>
        
    
    ### React Router란?
    
    React Router는 **CSR(Client-Side Routing)**을 가능하게 해주는 대표적인 라이브러리에요.
    
    한마디로, **페이지 전체를 새로 불러오지 않고 URL 경로에 맞는 컴포넌트만 보여주거나 숨기는 방식**이에요.
    
    이렇게 하면 **SPA(Single Page Application)**의 장점을 유지하면서, 마치 여러 페이지가 있는 것처럼 사용할 수 있어요.
    
    ---
    
    ### React Router의 장점
    
    1. **URL 경로 활용 가능**
        - `https://matthew.com/about`처럼 경로가 달라지면, 브라우저의 `Web History API`를 활용할 수 있어요.
        - 앞으로/뒤로 가기 버튼도 자연스럽게 동작해요.
    2. **주소 복사 및 공유 가능**
        - 사용자가 특정 페이지(예: `/about`)에 머무를 때, 해당 URL을 복사해서 다른 사람에게 공유하면, 그 사람도 바로 `/about` 페이지를 볼 수 있어요.
        - 만약 라우팅 처리를 하지 않으면, 보통 SPA에서는 무조건 초기 화면(Home)으로만 리디렉트되는 문제가 생겨요.
    3. **성능 최적화**
        - 전체 페이지를 다시 불러오지 않고, 필요한 부분만 업데이트하기 때문에 불필요한 네트워크 요청을 줄일 수 있어요.
        - 사용자 입장에서는 **더 빠른 화면 전환**을 경험할 수 있어요.
    4. **부드러운 네비게이션**
        - 서버 렌더링 방식처럼 페이지가 깜빡이거나 새로고침되는 현상이 없어요.
        - 마치 앱(App)처럼 부드럽게 화면이 바뀌기 때문에, UX가 좋아져요.
    
    ---
    
    **React Router**는 SPA를 유지하면서도, **멀티 페이지 앱처럼 보이도록 만들어주는 핵심 도구**에요.
    
    덕분에 주소 공유, 성능, 부드러운 화면 전환까지 챙길 수 있죠.
    
- **React Router**를 사용하지 않고, **Single Page Application** 만들어보기 🍠🍠🍠
    
    <aside>
    💡
    
    **React Router**를 사용하지 않고, **History API만으로 Single Page Application(SPA)을 직접 구현**해보는 시간을 가져보세요.
    
    이 과정에서 중요한 것은 단순히 SPA를 완벽하게 구축하는 것이 아니라, **SPA가 무엇이고 왜 필요한지, 그리고 React Router 같은 라이브러리가 어떤 배경에서 등장했는지 이해하는 것**입니다.
    
    라이브러리를 무조건 가져다 쓰기보다는,
    
    - **왜 이런 라이브러리가 나왔는지**
    - **직접 구현하면 어떤 불편함이 있는지**
    - **라이브러리가 제공하는 편의성이 무엇인지 등**
    
    이 점들을 스스로 경험해 보는 것이 학습의 핵심입니다.
    
    따라서 이번 목표는 **“SPA의 원리와 필요성을 이해하는 것**”에 중점을 두고 블로그를 읽어보시길 권장합니다.
    
    </aside>
    
    ### 📚 블로그
    
    [개발자 매튜 | React Router — History API를 활용한 SPA 라우팅 구현](https://www.yolog.co.kr/post/react-spa)
    
    ---
    
    - `pushState`, `popstate` 이벤트, 전체 리로드와의 차이 🍠
        
        **1️⃣ pushState**
        
        - **역할** : 브라우저의 히스토리 스택에 새로운 상태를 추가한다
        - **특징:** 페이지를 새로고침하지 않고 URL만 변경한다. 서버에 새로운 요청을 보내지 않기 때문에 SPA의 부드러운 화면 전환이 가능하다.
        - **데이터 보존:** 첫 번째 인자인 `state` 객체를 통해 페이지 이동 시 필요한 데이터를 넘길 수 있다.
        
        **2️⃣ popstate**
        
        - **발생 시점 :** 사용자가 브라우저의 뒤로가기 / 앞으로 가기 버튼을 클릭 할 때 발생한다.
        - **특징** : 개발자가 코드로 `pushState()`를 실행하면 발생하지 않는다. 오직 사용자의 **브라우저 조작**이나 `history.back()`, `history.forward()` 호출 시에만 트리거 된다.
        
        **3️⃣ 전체 리로드 VS SPA 차이점**
        
        | 구분 | 전체 리로드 | SPA |
        | --- | --- | --- |
        | 작동 방식 | 주소 변경 시 서버에 새로운 HTML 요청 | pushState로 주소만 변경함 (서버에 요청 안함) |
        | 사용자 경험 | 화면에 깜빡하며 모든 자원이 재로드됨 | 깜빡임 없이 필요한 부분만 교체됨 |
        | 데이터 상태 | 기존 메모리/변수가 모두 초기화됨 | 페이지가 유지되므로 기존 상태(state) 보존 가능함 |
        
        **✅ 정리**
        
        1. **클릭 시** : `history.pushState()`로 주소만 바꾸고 서버에 요청하지 않는다
        2. **뒤로가기** **시** : 브라우저가 `popstate` 이벤트를 던져준다. 
        3. **새로고침 시** : 서버에 요청이 간다. 서버 설정이 안되어 있으면 `404 Not Found`가 뜰 수 있으므로 모든 경로를 `index.html`로 보내주는 설정이 필요하다.
        
        ⇒ `pushState`: **기록 쌓기** ,`popstate` : **기록 이동 감지**
        
    - 전체 리로드 방식과 SPA 라우팅 방식의 가장 큰 차이는 무엇일까? 🍠
        
        **1️⃣ 데이터의 연속성**
        
        - **전체 리로드** : 새로고침하면 브라우저 메모리에 있던 모든 자바스크립트 변수, 상태(state), 입력 중이던 데이터가 **모두 초기화** 된다.
        - **SPA 라우팅** : 주소만 바뀔 뿐 페이지 자체가 유지되므로 이전에 불러온 데이터나 state가 그대로 **유지**된다.
        
        **2️⃣ 주도권의 위치**
        
        - **전체 리로드** : **서버**에 주도권이 있다. 브라우저가 주소를 요구하면 서버가 그에 맞는 HTML 전체를 새로 그려서 보내준다.
        - **SPA 라우팅** : **브라우저/JS**에 주도권이 있다. 서버에는 처음에만 요청하고 그 이후의 페이지 전환은 JS가 `popState`로 주소만 바꾼 뒤 화면을 그린다.
        
        **3️⃣ 서버 부하, 체감 속도**
        
        - **전체 리로드** : 이동할 때마다 중복적인 요소인 로고, 네이게이션 바, 푸터 등 매번 새롭게 다운로드해야해서 서버 자원 낭비가 있다. 또한 화면의 깜빡임이 발생한다.
        - **SPA 라우팅** : 이미 로드된 공통 요소는 그대로 두고 컨텐츠만 바꾸기 때문에 훨씬 빠르고 앱 같은 부드러운 경험을 준다.
    - `preventDefault()`와 `stopPropagation()`의 차이와 역할은 무엇인가? 🍠
        
        **1️⃣ `preventDefault()`**
        
        - **역할** : 브라우저가 해당 태그에 대해 기본적으로 수행하는 동작을 취소한다.
        - **상황** :  `<a>` 태그를 클릭했는데 링크로 이동하지 않게 할 때, `<form>` 내부의 전송 버튼을 눌렀는데 페이지가 새로 고침 되지 않게 할 때 사용한다.
        
        → 클릭은 했지만 원래 하던 행위는 못하게 할 때 사용
        
        **2️⃣`stopPropagation()`**
        
        - **역할** : 이벤트가 부모 요소로 전달 되는 것 (버블링)을 막는다.
            - **이벤트 버블링?**
                
                특정 화면 요소에서 이벤트가 발생 했을 때, 해당 이벤트가 **더 상위의 부모 요소들로 전달** 되어 나가는 특성이다.
                
                1. **발생** : 사용자가 트리 구조의 가장 깊숙한 곳에 있는 요소 `<button>`를 클릭한다
                2. **전파** : 클릭 이벤트가 버튼에서 끝나지 않고 그 위를 감싸고 있는 `<div>` , `<body>` … `document`객체까지 차례대로 전달된다.
                3. **결과** : 부모 요소에 클릭 핸들러가 있다면 부모의 클릭 이벤트까지 줄줄이 실행된다.
        - **상황** : 자식 버튼을 눌렀을때, 부모 영역에 걸려 있는 클릭 이벤트 까지 실행되는 것을 방지하고 싶을 때 사용한다.
        
        ```tsx
        import React, { FC, useCallback, MouseEvent } from 'react';
        
        const App: FC = (): JSX.Element => {
          const onChildClick = useCallback((e: MouseEvent<HTMLButtonElement>): void => {
            e.stopPropagation();
            alert("자식에서만 실행됩니다.");
          }, []);
          
          return (
            <div onClick={() => alert("부모에서 실행되었습니다")}>
        
              <button onClick={onChildClick}>클릭!!</button>
        
            </div>
          );
        };
        
        export default App;
        ```
        
        **✅ 정리**
        
        | 구분 | `preventDefault()` | `stopPropagation()` |
        | --- | --- | --- |
        | 대상 | 부모 요소 (이벤트 전달) | 브라우저 (기본 행동) |
        | 목적 | 이벤트 버블링 차단 | 특정 태그의 고유 기능 정지 |
        | 영향 | 다른 요소의 핸들로 실행을 막음 | 해당 요소의 기본 기능만 막음 |
    - 선언적 라우팅(`Route`, `Routes`) 구조가 가지는 장점은 무엇일까? 🍠
        
        **1️⃣ 직관적인 코드**
        
        코드를 보는 순간 어떤 주소에 어떤 컴포넌트가 매칭되는지 한눈에 파악 할 수 있어 가독성이 뛰어나다.
        
        **2️⃣ 컴포넌트 중심의 설계**
        
        라우팅 로직 자체가 리액트 컴포넌트 형태 `<Route />` 로 존재하기에 컴포넌트처럼 다룰 수 있다. 
        
        **3️⃣ 중첩 라우팅 (Nested Routing)의 편리함**
        
        상위 라우팅 안에 하위 라우트를 넣는 구조를 만들기 쉽다
        
        - **예**: `/mypage` 안에 `/profile`, `/setting` 이 있는 경우
    
    ---
    
    ### 🍠 직접 만든 Single Page Application 제출
    
    - 깃허브 주소
    - 실행 영상
        
        [practice00 - 개인 - Microsoft Edge 2026-04-01 02-46-42.mp4](attachment:27aca297-8371-42ab-98f4-6d8fc59e0f64:practice00_-_개인_-_Microsoft_Edge_2026-04-01_02-46-42.mp4)
        
    
- **React Router**의 기본 사용법 (**createBrowserRouter**, **RouterProvider**)
    
    ## React Router 실습
    
    리액트에서 **라우팅**을 위해 가장 많이 쓰이는 라이브러리는 `react-router-dom`이에요.
    
    먼저 라이브러리를 설치해줍니다.
    
    ```bash
    pnpm i react-router-dom
    ```
    
    ---
    
    ### 1. 기본 라우터 설정하기
    
    `App.tsx` 파일에 아래와 같이 작성해보세요.
    
    ```tsx
    import './App.css'
    
    // 1. React Router에서 필요한 함수/컴포넌트를 import
    import { createBrowserRouter, RouterProvider } from "react-router-dom";
    
    // 2. 경로(path)와 보여줄 화면(element)를 정의
    const router = createBrowserRouter([
      {
        path: '/',
        element: <h1>홈 페이지입니다.</h1>
      },
      {
        path: '/movies',
        element: <h1>영화 페이지 입니다.</h1>
      }
    ]);
    
    // 3. RouterProvider로 router 전달
    function App() {
      return <RouterProvider router={router} />
    }
    
    export default App;
    ```
    
    ---
    
    ### 2. 코드 설명
    
    1. **`createBrowserRouter`**
        - 우리가 원하는 경로(path)와, 해당 경로일 때 보여줄 컴포넌트(element)를 정의해요.
        - 예를 들어 `path: '/'` → 홈 화면, `path: '/movies'` → 영화 화면.
    2. **`RouterProvider`**
        - 우리가 만든 router를 실제 앱에 적용해주는 역할이에요.
        - `RouterProvider` 안에서만 라우팅이 동작합니다.
    3. **경로 확인**
        - `path: '/'` → 프로젝트 실행 시 처음 열리는 페이지 (`localhost:5173/`)
            
            ![1.png](attachment:f4fed9c6-a12d-43de-b45f-9e100ddab8fd:1.png)
            
        - `path: '/movies'` → `localhost:5173/movies` 경로로 접근했을 때 영화 페이지가 보여요.
            
            ![2.png](attachment:522b191e-37f4-46b9-957a-d008cd8b9448:2.png)
            
        
    
    ---
    
    ### 3. 실행 결과
    
    - `/` → **홈 페이지입니다.**
    - `/movies` → **영화 페이지 입니다.**
    
- **React Router** 지정하지 않은 경로 접근 처리 (**errorElement**)
    
    ### React Router: 지정하지 않은 경로 접근 처리
    
    위 실습에서는 `/`와 `/movies` 두 경로만 설정했어요.
    
    ```tsx
    import './App.css'
    import { createBrowserRouter, RouterProvider } from 'react-router-dom';
    
    const router = createBrowserRouter([
      { path: '/', element: <h1>홈 페이지입니다.</h1> },
      { path: '/movies', element: <h1>영화 페이지 입니다.</h1> },
    ]);
    
    function App() {
      return <RouterProvider router={router} />;
    }
    
    export default App;
    ```
    
    그럼 사용자가 `http://localhost:5173/yaho` 처럼 **정의하지 않은 경로**로 들어오면 어떻게 될까요?
    
    ![1.png](attachment:3b44b91c-55f5-4c2f-a0e9-42bfaba02869:1.png)
    
    라우터가 해당 경로를 찾지 못해 **404 NOT FOUND**가 발생해요.
    
    이 상태는 기능적으로는 맞지만, **UX 관점**에선 친절하지 않죠. React Router는 이를 개선하도록 `errorElement`를 제공해요.
    
    ---
    
    ### 방법 1: `errorElement`로 루트 에러 화면 지정
    
    루트 라우트에 `errorElement`를 지정하면, **정의되지 않은 경로**로 접근했을 때 이 컴포넌트를 보여줄 수 있어요.
    
    ```tsx
    import './App.css'
    import { createBrowserRouter, RouterProvider } from 'react-router-dom';
    
    const router = createBrowserRouter([
      {
        path: '/',
        element: <h1>홈 페이지입니다.</h1>,
        // 매칭 실패/라우트 에러 시 보여줄 UI
        errorElement: <h1>너는 없는 경로에 들어왔다 ^ㅁ^ 야호~!</h1>,
      },
      {
        path: '/movies',
        element: <h1>영화 페이지 입니다.</h1>,
      },
    ]);
    
    function App() {
      return <RouterProvider router={router} />;
    }
    
    export default App;
    ```
    
    ![2.png](attachment:b055d38c-2006-4824-ab94-f81bd2a0c267:2.png)
    
    > 참고: 데이터 라우터(`createBrowserRouter`)에서는 매칭 실패 시 **가장 가까운 상위 라우트의 `errorElement`가 렌더링**돼요. 루트에 넣어두면 대부분의 “없는 경로”를 커버할 수 있어요.
    > 
    
    ---
    
    ### 방법 2: 와일드카드(`*`) 경로로 NotFound 라우트 만들기
    
    UX를 더 세밀하게 다루고 싶다면, **전용 404 페이지**를 컴포넌트로 만들어 `path: '*'`에 매핑하는 방법도 좋아요.
    
    ```tsx
    const NotFound = () => (
      <main style={{ padding: 24 }}>
        <h1>페이지를 찾을 수 없어요 (404)</h1>
        <p>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
        <a href="/">홈으로</a>
      </main>
    );
    
    const router = createBrowserRouter([
      { path: '/', element: <h1>홈 페이지입니다.</h1> },
      { path: '/movies', element: <h1>영화 페이지 입니다.</h1> },
      { path: '*', element: <NotFound /> }, // 가장 마지막에 배치
    ]);
    ```
    
    두 방법은 함께 써도 돼요.
    
    - **일반적인 404**는 `'*'` 라우트에서 처리하고,
    - **라우트 로딩/액션 중 발생한 에러**는 `errorElement`로 처리하는 식으로 역할을 나누면 깔끔해요.
    
    ---
    
    ### 다음에 시도해보면 좋은 것들
    
    1. **홈으로 이동 버튼 제공**: 404 화면에 “홈으로” 버튼을 넣어 빠르게 복구할 수 있게 해요.
    2. **페이지별 다른 에러 처리**: 각 라우트에 개별 `errorElement`를 지정해 문맥에 맞는 에러 메시지를 보여줘요.
    3. **Error Boundary 구성**: 컴포넌트 렌더링 중 발생하는 예외를 잡아 사용자에게 안정적인 화면을 제공해요.
    
    ---
    
    프론트엔드 개발은 화면만 만드는 게 아니에요. **로딩/에러/복구 흐름**까지 설계해 주면 사용자 경험이 훨씬 좋아져요.
    
- **React Router**의 **Outlet** 사용법 **Link** 태그를 활용한 페이지 이동.
    
    ### **React Router**의 **Outlet** 사용법 **Link** 태그를 활용한 페이지 이동.
    
    우리는 지금까지 `src/components` 폴더에 컴포넌트를 두고 관리했어요. 이번에는 **페이지 단위 파일을 `src/pages` 폴더에서 관리**해볼게요.
    
    ![1.png](attachment:14bfbb98-23ed-4ebb-932a-2b0a0dae99b4:1.png)
    
    총 3개의 페이지를 만듭니다.
    
    ---
    
    ### 1. **홈 페이지**
    
    ```tsx
    // src/pages/home.tsx
    const HomePage = () => {
      return <h1>Home Page 야호~!</h1>;
    };
    
    export default HomePage;
    ```
    
    ### **2. 영화 페이지**
    
    ```tsx
    // src/pages/movies.tsx
    const MoviesPage = () => {
      return <h1>Movies Page 야호~!</h1>;
    };
    
    export default MoviesPage;
    ```
    
    ### **3. 에러 페이지**
    
    ```tsx
    // src/pages/not-found.tsx
    const NotFound = () => {
      return <h1>너는 찾을 수 없는 페이지 야호~!</h1>;
    };
    
    export default NotFound;
    ```
    
    이제 라우터에서 **문자 리터럴로 직접 JSX를 넣던 방식**을 버리고, **만든 페이지 컴포넌트를 import**해서 연결해요.
    
    ```tsx
    import './App.css';
    import { createBrowserRouter, RouterProvider } from 'react-router-dom';
    
    // 1) 만든 페이지 import
    import HomePage from './pages/home';
    import NotFound from './pages/not-found';
    import Movies from './pages/movies';
    
    // 2) 라우터에 연결
    const router = createBrowserRouter([
      {
        path: '/',
        element: <HomePage />,
        errorElement: <NotFound />,
      },
      {
        path: '/movies',
        element: <Movies />,
      },
    ]);
    
    function App() {
      return <RouterProvider router={router} />;
    }
    
    export default App;
    ```
    
    아래와 같이 페이지가 바르게 보이면 정상이에요.
    
    ![1.png](attachment:aadd80dc-0e9f-44e1-88c1-c6dc32f71ed4:1.png)
    
    ![2.png](attachment:8efc7c83-ef2c-4fc0-9974-90f7db3d4bdb:2.png)
    
    ![3.png](attachment:4ca0a602-470a-4344-be53-a33e426f8b49:3.png)
    
    ---
    
    ### 2. Outlet 적용 방법
    
    이번엔 **`'/'로 시작하는 모든 경로에서 공유되는 레이아웃`**을 만들어 볼게요. 즉, `navbar`는 고정으로 유지하고, **아래 컨텐츠 영역만 라우트에 따라 바뀌도록** 하려는 거예요.
    
    `src/layout/root-layout.tsx` 파일을 만들고, `Outlet`을 준비합니다.
    
    ![1.png](attachment:39a16249-7118-4356-b269-d7f4d4a8a112:1.png)
    
    ```tsx
    // src/layout/root-layout.tsx
    import { Outlet } from 'react-router-dom';
    
    const RootLayout = () => {
      return (
        <>
          <Outlet />
        </>
      );
    };
    
    export default RootLayout;
    ```
    
    실제로 아래 영상을 보면, `navbar`는 고정으로 유지하고, **아래 컨텐츠 영역만 라우트에 따라 바뀌고 있어요!**
    
    [화면 기록 2025-09-17 오전 11.01.30.mov](attachment:9e0c2b21-e505-410f-b288-4448c421a832:화면_기록_2025-09-17_오전_11.01.30.mov)
    
    [개발자 매튜](https://www.yolog.co.kr/)
    
    그리고 **`navbar`** 컴포넌트를 만들어 링크로 이동해 볼게요.
    
    ```tsx
    // src/components/navbar.tsx
    import { Link } from 'react-router-dom';
    
    const Navbar = () => {
      return (
        <nav>
          <Link to="/">홈 페이지로 이동</Link>
          <Link to="/movies">영화 목록 페이지로 이동</Link>
        </nav>
      );
    };
    
    export default Navbar;
    ```
    
    `RootLayout`에 `Navbar`를 포함시킵니다.
    
    ```tsx
    // src/layout/root-layout.tsx
    import { Outlet } from 'react-router-dom';
    import Navbar from '../components/navbar';
    
    const RootLayout = () => {
      return (
        <>
          <Navbar />
          <Outlet />
        </>
      );
    };
    
    export default RootLayout;
    ```
    
    이제 라우터와 연결해요. 처음엔 이렇게만 바꾸면 **navbar만 나오고 페이지가 바뀌지 않는 것처럼 보일 수 있어요.** (정상이에요)
    
    ```tsx
    import './App.css';
    import { createBrowserRouter, RouterProvider } from 'react-router-dom';
    
    import HomePage from './pages/home';
    import NotFound from './pages/not-found';
    import Movies from './pages/movies';
    import RootLayout from './layout/root-layout';
    
    const router = createBrowserRouter([
      {
        path: '/',
        // element: <HomePage />,
        element: <RootLayout />,
        errorElement: <NotFound />,
      },
      {
        path: '/movies',
        element: <Movies />,
      },
    ]);
    
    function App() {
      return <RouterProvider router={router} />;
    }
    
    export default App;
    ```
    
    [1.mov](attachment:84e830a2-e6b9-4a70-b8b4-b667797a4ec0:1.mov)
    
    원하는 동작(위에 `navbar` 고정, 아래 컨텐츠만 변경)을 만들려면, 자**식 라우트(`children`)로 페이지**들을 넣어 **`Outlet`에 렌더링**되도록 해야 해요.
    
    ```tsx
    import './App.css';
    import { createBrowserRouter, RouterProvider } from 'react-router-dom';
    
    import HomePage from './pages/home';
    import NotFound from './pages/not-found';
    import Movies from './pages/movies';
    import RootLayout from './layout/root-layout';
    
    const router = createBrowserRouter([
      {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        // 1) Navbar 아래에 표시할 자식 라우트
        children: [
          {
            // 2) index: true → 부모의 기본 경로('/')일 때 렌더
            index: true,
            element: <HomePage />,
          },
          {
            // 3) 부모가 '/'이므로, 'movies'만 써도 '/movies'로 매칭
            path: 'movies',
            element: <Movies />,
          },
        ],
      },
    ]);
    
    function App() {
      return <RouterProvider router={router} />;
    }
    
    export default App;
    ```
    
    [2.mov](attachment:86c71617-22fa-4508-9a2b-910e38d3d7c0:2.mov)
    
    위와 같이 **Navbar는 유지**되고, **컨텐츠만 경로에 맞게 바뀌면 성공**이에요!
    
- **React Router**를 활용하여 **Dynamic Routing**을 구현해보자. (**useParams**)
    
    ### Dynamic Routing (동적 라우팅)
    
    동적 라우팅은 **URL의 일부를 변수처럼 받아** 같은 페이지 구조로 **서로 다른 콘텐츠**를 보여주는 방식이에요.
    
    쿠팡 상품 상세처럼 “UI는 같지만 내용만 다른” 화면을 만들 때 아주 잘 맞아요.
    
    예를 들어, 이런 형태의 URL을 보면:
    
    ![1.png](attachment:fba70fe6-3eb3-4da1-8c2a-6e60db122c67:1.png)
    
    ![2.png](attachment:66307fa9-be2c-4ad9-85b1-00277074c99e:2.png)
    
    ```
    coupang.com/vp/products/여기부분이-매번-다른-숫자
    ```
    
    앞부분은 같고 **`products/` 뒤의 값만 달라요**. 이 숫자(또는 문자열)를 **동적 파라미터**로 받아서 적절한 데이터를 불러오면 됩니다.
    
    ---
    
    ### 1) 라우트 정의하기
    
    `react-router-dom`에서는 `/:파라미터이름` 형태로 경로를 정의해요.
    
    ```tsx
    import './App.css';
    import { createBrowserRouter, RouterProvider } from 'react-router-dom';
    
    import HomePage from './pages/home';
    import NotFound from './pages/not-found';
    import Movies from './pages/movies';
    import RootLayout from './layout/root-layout';
    
    const router = createBrowserRouter([
      {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            // /movies/뒤에 오는 값을 movieId라는 이름으로 받겠다는 뜻
            path: 'movies/:movieId',
            element: <Movies />,
          },
        ],
      },
    ]);
    
    function App() {
      return <RouterProvider router={router} />;
    }
    
    export default App;
    ```
    
    [1.mov](attachment:6a230914-214d-4653-b1a7-5911b0805217:1.mov)
    
    - `/movies/1`
    - `/movies/123`
    - `/movies/matthew`
    
    위 세 URL은 모두 같은 컴포넌트(`Movies`)를 렌더링하지만, 내부에서 받는 **`movieId` 값만 달라요**. 이 값을 이용해 서버에서 해당 리소스를 가져오면 돼요.
    
    **ex) 조금 이해가 어렵다면, 쿠팡 상품 상세페이지를 생각해보시면 됩니다!**
    
    ---
    
    ### 2) `useParams`로 파라미터 읽기
    
    동적 경로에서 넘겨받은 값을 읽으려면 `useParams`를 사용해요.
    
    ```tsx
    // src/pages/movies.tsx
    import { useParams } from 'react-router-dom';
    
    const MoviesPage = () => {
      const params = useParams(); // { movieId?: string }
    
      console.log(params); // 예: { movieId: "123" }
    
      return <h1>{params.movieId}번의 Movies Page 야호~!</h1>;
    };
    
    export default MoviesPage;
    ```
    
    ### 왜 객체로 반환될까요?
    
    - 이유는 **여러 개의 파라미터**를 동시에 받을 수 있기 때문이에요.
        
        예: `path: 'users/:userId/posts/:postId'` → `useParams()`는 `{ userId, postId }` 형태로 돌려줘요.
        
    
    ### 파라미터 이름은 어디서 오나요?
    
    - **라우트 정의에서 쓴 이름 그대로** 와요.
        
        `path: 'movies/:movieId'` → `params.movieId`
        만약 `path: 'movies/:matthew'`라고 썼다면 → `params.matthew`
        
    
    ```tsx
    const router = createBrowserRouter([
      {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'movies/:movieId', element: <Movies /> },
        ],
      },
    ]);
    ```
    
    ![1.png](attachment:a7e47f4b-eeca-4b1e-a10b-55d43da5d32c:1.png)

    - 위의 영상을 보고 학습한 내용을 정리해주세요!
    
    **1️⃣ 부수 효과 (Side Effect)**
    
    화면을 그리는 것과 **직접적인 상관이 없는 작업**을 부수 효과라고 한다. components가 렌더링 되는 것과 별개로 연산, 렌더 트리에 영향을 주는 작업을 하는 것
    
    예 ) `addEventListener`로 브라우저 이벤트 등록하기, 타이머 (`setTimeOut`) 설정하기, 직접적인 DOM 조작
    
    **2️⃣ `useState`가 한 박자 느린 이유 (비동기)**
    
    ```tsx
    const handleIncrease = () : void => {
      setCount((prev) : number => prev + 1 ); // 나중에 1을 더하자고 기억하는 중
      console.log('setCount', count);         // 아직 숫자가 안 바뀌었는데 바로 출력함
    }
    ```
    
    따라서 버튼을 눌러도 콘솔에는 화면 보다 1 작은 숫자가 찍힌다.
    
    → `setCount`는 함수가 끝나고 리액트가 다시 화면을 렌더 할 때 비로소 값을 업데이트 하기 때문이다. 즉, `console.log`가 실행되는 시점에는 아직 **옛 값**을 가지고 있다.
    
    3️⃣**`useEffect`** 
    
    `useEffect`는 화면이 업데이트되고 난 후의 값을 받고 싶을 때 사용하는 도구
    
    ```tsx
    useEffect(() : void => {
      console.log(count); // 화면에 숫자가 바뀌고 나서 실행
    }, [count])
    ```
    
    `setCount`로 값이 바뀜 → `useEffect` 내부 코드가 실행됨 →`useEffect` 내부 코드가 실행 됨
    
    따라서, 화면에 보이는 숫자와 콘솔에 찍히는 숫자가 일치하게 된다.
    
    **4️⃣ 의존성 배열 (Dependency Array)**
    
    | 의존성 배열 형태 | 실행 시점 |
    | --- | --- |
    | [ ] (빈 배열) | 컴포넌트가 처음 **mount 될 때 1번** |
    | [count] | 처음 나타날 때 + count가 바뀔 때 마다 |
    | 생략 시 | 화면이 리렌더링 될때마다 |

    5️⃣ **클린업 함수**

클린업 함수 안에서`count`를 찍으면 바뀌기 전의 옛날 값이 찍힌다. → 과거의 내가 벌여놓은 일을 치우는 것

- **클린업 함수가 실행되는 타이밍**
    1. **다음 업데이트 직전** : `count` 가 바뀌어서 `useEffect`가 다시 실행 되기 바로 직전에 이전의 것을 치운다
    2. **언마운트 시** : 사용자가 다른 페이지로 이동해서 컴포넌트가 완전히 사라질 때 마지막으로 청소한다.

    **6️⃣ 컴포넌트의 mount와 unmount**

**❓ 질문 : `{visivle && <Child />}`의 의미? ( 조건부 렌더링 )**

1. **`visivle`이 `false` 일 때** : 리액트는 `<Child/>`라는 컴포넌트를 만들지않음, 화면에 그리지도 않는다. (세상제 존재하지 않는 상태)
2. **`visivle` 이`true`일 때** : 리액트는 `Child`를 그려야 해서 새롭게 mount 된다.

❓ **질문 : “내부의 값이 실행된다” 의미**

```tsx
function Child() {
    useEffect(() => {
        console.log('Child rendered'); //내부의 값
    }, []);
    
    return <div>Child</div>
}
```

의존성 배열이`[]` 일 때, `useEffect`는 컴포넌트가 처음 mount 할 때만 실행 된다.

**과정** : ‘보이기’ 버튼을 클릭함 (`visible`이 `true`가 됨) → react가 화면에  `<div>Child</div>`를 그림 → 그 때 Child가 처음 나왔으므로 내부에 있는 `useEffect`가 작동 → `console.log`가 찍힘

❓ **질문 : ‘숨기기’를 눌렀다가 ‘보이기’를 누르면 왜 또 찍히는가?**

1. **숨기기 클릭:** `Child` 컴포넌트가 화면에서 완전히 사라집니다. (**파괴/Unmount**) 리액트의 메모리에서 `Child`에 대한 정보가 싹 지워진다
2. **보이기 클릭:** 다시 **새로운** `Child`가 만들어집니다. 리액트 입장에서는 아까 그 `Child`가 아니라 **완전히 새로운 Child** 가 생성된다.
3. **결과:** 새로운 Child의 `useEffect`가  다시 `'Child rendered'`를 찍는다.

**7️⃣ 의존성 배열의 역설**

`useEffect` 내부에서 수정하는 상태(state)를 의존성 배열에 넣는 것은 나를 계속 부르는 무한 굴레를 만드는 것과 같다. 상태 변경은 가급적 **이벤트 핸들러에서 처리**하는게 좋다




- **`fetch`** 정리
    
    브라우저에 **기본적으로 내장**된 함수이다. 별도의 설치 없이 바로 사용할 수 있다는 게 가장 큰 장점이다
    
    - **특징:** 브라우저 표준 내장 API라 가볍다
    - **단점:**  `json()`으로 변환하는 과정을 거쳐야 한다.
        - 네트워크 에러가 아닌 404, 500 에러를 '성공'으로 간주해서 따로 에러 처리를 해줘야 한다
        - 오래된 브라우저(IE 등) 지원이 약한다
- **`axios`** 정리
    
    **외부 라이브러리**로, `pnpm install axios`처럼 따로 설치해서 사용해야 한다. 하지만 그만큼 편리한 기능을 많이 제공한다
    
    - **특징:** 응답 데이터를 자동으로 JSON으로 변환해준다 (`data` 속성에 바로 담김).
        - 상태 코드가 2xx 범위를 벗어나면 자동으로 에러를 발생시켜 `catch`문으로 보내준다
        - **인터셉터(Interceptors)** 기능이 있어, 모든 요청에 토큰을 자동으로 붙이는 등의 작업이 가능하다
    - **단점:** 라이브러리를 설치해야 하므로 프로젝트 용량이 아주 미세하게 늘어난다.
- **`fetch`**와 **`axios`**의 차이
    
    
    | **비교 항목** | **Fetch API** | **Axios** |
    | --- | --- | --- |
    | **설치 여부** | 기본 내장 (설치 X) | 설치 필요 (`pnpm install axios`) |
    | **자동 JSON 변환** | X (`res.json()` 필요) | O (`res.data`에 바로 담김) |
    | **에러 핸들링** | 404, 500도 `then`으로 감 | 404, 500은 바로 `catch`로 보냄 |
    | **요청 취소/타임아웃** | 구현이 복잡함 | 설정 하나로 쉽게 가능 |
    | **브라우저 지원** | 최신 브라우저 위주 | 모든 브라우저(범용성 높음) |