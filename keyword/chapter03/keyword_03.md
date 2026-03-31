- `pushState`, `popstate` 이벤트, 전체 리로드와의 차이 🍠
  - `pushState` : 새 페이지를 스택에 추가
    - 동작 방법: `history.pushState(state, title, url)`
      1. `state` : 페이지에서 메모해두고 싶은 데이터로 뒤로 가기로 돌아왔을 때 꺼내 쓸 수 있음
         예시) `history.pushState({ userId: 42 }, '', '/profile/42')` → 이 페이지는 사용자 ID 42번의 프로필이라고 메모한 것 2. `title` — 원래는 페이지 제목을 바꾸려고 만든 값 3. `url` — 주소창에 표시할 경로
    - 브라우저의 `히스토리 스택`에 새로운 상태를 쌓는 동작으로 주소창은 바뀌지만, 네트워크 요청은 발생하지 않아요!

      ```jsx
      사용 예시: history.pushState({}, ‘’, ‘/about’)

      // 1. 주소창이 /about으로 바뀜
      // 2. 히스토리 스택에 /about 추가

      ### 핵심 특징 정리
      pushState 전:   [/home] [/about]
                                    ↑ 현재

      pushState('/contact') 실행 후:

      [/home] [/about] [/contact]
                            ↑ 현재 (새로 추가됨)

      → 뒤로가기 버튼 누르면? /about 으로 이동 가능!
      ```

  - `popState 이벤트` : 뒤로가기/앞으로가기 감지
    - 발생하는 경우:
      - JS에서 `history.back()` 또는 `history.forward()` 호출
      - 사용자가 브라우저의 → 앞으로가기 버튼 클릭
      - 사용자가 브라우저의 ← 뒤로가기 버튼 클릭
    - 발생하지 않는 경우:
      - `history.pushState()` 를 직접 호출할 때
      - 페이지를 처음 로드할 때
    - 사용 방법

      ```jsx
      // "뒤로가기가 일어나면 이 함수를 실행해!" 라고 등록
      window.addEventListener('popstate', (event) => {
        // event.state 에는 pushState 할 때 저장한 데이터가 들어있음
        console.log('이동한 페이지:', window.location.pathname);
        console.log('저장된 데이터:', event.state);

        // 이동한 URL에 맞는 화면을 다시 그려줌
        router();
      });
      ```

  - 전체 리로드 : 완전히 새로 시작
    - 발생하는 경우
    - 사용자가 주소창에 URL을 직접 입력 후 엔터
    - F5 키 또는 새로고침 버튼 클릭
    - `<a href=”/about”>`을 JS로 가로채지 않고 그냥 클릭할 때
    - `location.href = ‘/about’` 코드 실행 시
    - `location.reload()` 실행 시

- 전체 리로드 방식과 SPA 라우팅 방식의 가장 큰 차이는 무엇일까? 🍠
  - 차이점 1 - 서버와의 통신
  - 전체 리로드: 페이지 이동할 때마다 HTML, CSS, JS, 이미지 파일을 서버에서 매번 다시 내려 받음
  - SPA: 파일들을 처음 한 번만 받고 이후 이동은 JS가 화면만 바꿔줌
  - 차이점2 - JS 상태의 운명
  * 코딩에서의 상태 = 변수에 저장된 값 -예시: 장바구니에 담긴 상품 수 등

    ```jsx
    let cartCount = 5; // 장바구니 5개
    let username = '홍길동'; // 로그인된 사용자
    let writingComment = '정말 좋은..'; // 작성 중인 댓글
    ```

    전체 리로드가 발생하면 이 모든 변수가 완전히 사라지고 `0`, `undefined`, `""` 같은 초기값으로 돌아가요. JS 파일 자체가 처음부터 다시 실행되기 때문이에요. SPA는 JS가 계속 살아있으니까 이 값들이 그대로 유지됩니다.

    ```
    전체 리로드 방식:
    페이지 이동
      → JS 종료
      → JS 재시작
      → cartCount = 0  ← 5개 담았는데 0이 됨!
      → username = undefined
      → writingComment = ""

    SPA 라우팅 방식:
    페이지 이동
      → JS 계속 실행 중
      → cartCount = 5  ← 그대로!
      → username = "홍길동"
      → writingComment = "정말 좋은.."
    ```
  - 차이점 3 - 사용자가 느끼는 속도와 경험
  - 전체 리로드는 인터넷을 통해 서버까지 갔다가 와야 함
  - SPA는 이미 받아둔 JS가 컴퓨터 안에서만 동작함
  - 전체 리로드를 하면 화면 전체가 하얗게 깜빡이는 순간이 생김
  - SPA는 JS가 해당 영역만 바꾸니 깜빡임이 없음
    ![image.png](attachment:c4f47e93-631c-433e-89d2-058f0f58d296:image.png)
  - 차이점 4 - 동작 방식

  ```jsx
  <!-- 두 방식 모두 HTML에 이렇게 링크가 있어요 -->
  <a href="/about">소개 페이지</a>
  ```

  전체 리로드 방식에서 이 링크를 클릭하면:

  ```
  1. 브라우저: "서버야! /about 페이지 파일 줘!"
  2. 서버:     "잠깐만... 파일 찾는 중..."
  3. 서버:     "여기 about.html 이야"
  4. 브라우저: "고마워, 처음부터 다시 그릴게"
     → 현재 화면 완전히 지움
     → about.html 처음부터 다시 그림
     → CSS 다시 적용
     → JS 다시 실행

  SPA 방식에서 이 링크를 클릭하면:
  // JS가 클릭을 가로채고 이 코드를 실행해요
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    e.preventDefault();  // 브라우저 기본 동작(리로드) 완전히 막음!

    // URL만 바꿈 — 서버 요청 없음!
    history.pushState({}, '', '/about');

    // JS가 직접 화면의 일부만 바꿔치기
    document.getElementById('app').innerHTML = `
      <h1>소개 페이지</h1>
      <p>내용...</p>
    `;
    // 끝! 서버와 한마디도 안 했어요
  });
  ```

- `preventDefault()`와 `stopPropagation()`의 차이와 역할은 무엇인가? 🍠
  - `preventDefault()` : 기본 동작만 막고 이벤트가 위로 올라가는 버블링은 막지 않음

  ```jsx
  특정 HTML 요소들에 대해 기본으로 정해진 동작 있음

  링크 <a href="...">  → 클릭하면 해당 주소로 이동
  폼 <form>의 submit  → 클릭하면 페이지 새로고침하며 데이터 전송
  체크박스 <input type="checkbox"> → 클릭하면 체크/해제
  마우스 우클릭       → 오른쪽 메뉴(컨텍스트 메뉴) 열림
  텍스트 드래그       → 텍스트 선택됨

  => 이러한 기본 동작만 막음

  /*코드로 보기*/
  // 예시 1 — 링크 클릭 막기 (SPA에서 제일 많이 씀!)
  document.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();  // "브라우저야, 링크로 이동하지 마!"
    // 이제 우리가 직접 원하는 동작을 처리
    console.log('링크 이동 막고 SPA 라우터 실행!');
  });

  // 예시 2 — 폼 제출 막기
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();  // "브라우저야, 페이지 새로고침하지 마!"
    // 이제 우리가 직접 서버에 데이터 보내기 (Ajax)
    console.log('폼 새로고침 막고 직접 처리!');
  });

  // 예시 3 — 우클릭 메뉴 막기
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();  // "브라우저야, 오른쪽 메뉴 열지 마!"
    // 나만의 커스텀 메뉴를 띄울 수 있음
  });

  그러나 버블링은 계속됩니다!

  document.getElementById('outer').addEventListener('click', () => {
    console.log('outer도 클릭 감지함!');  // 이건 여전히 실행됨
  });

  document.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();  // 링크 이동만 막음
    // 이벤트는 계속 outer로 올라감!
  });
  // 링크 클릭 시:
  // 1. 링크 이벤트 실행 → e.preventDefault() → 이동 안 함
  // 2. 이벤트 outer로 올라감 → "outer도 클릭 감지함!" 출력됨
  ```

  - `stopPropagation()` : 이벤트가 위로 올라가는 버블링 자체를 막고 브라우저 기본 동작은 막지 않음
    document.getElementById('outer').addEventListener('click', () => {
    console.log('outer 감지!'); // 이건 실행 안 됨
    });

    document.getElementById('btn').addEventListener('click', (e) => {
    e.stopPropagation(); // "이벤트야, 여기서 멈춰! 위로 올라가지 마!"
    console.log('btn 실행!'); // 이건 실행됨
    });
    // 버튼 클릭 시:
    // "btn 실행!" 만 출력됨
    // "outer 감지!" 는 출력 안 됨 ← 버블링이 멈췄으니까!

- 선언적 라우팅(`Route`, `Routes`) 구조가 가지는 장점은 무엇일까? 🍠 - 선언적 라우팅: 무엇을 보여줄지를 구조적으로 적는 방식
  //예시
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/login" element={<Login />} />
  </Routes>
  //주소가 /면 Home을 보여줘
  //주소가 /about이면 About 보여줘
  //주소가 /login이면 Login을 보여줘

      - 장점 1 - 코드를 읽기 쉬워짐
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
        // 어떤 페이지가 있는지
        // 주소가 어떻게 연결되는지
        // 어떤 컴포넌트가 렌더링되는지
        // 를 바로 알 수 있음
      - 장점 2 - 요지보수가 쉬워짐
        - 프로젝트를 하다 보면 페이지가 계속 늘어나는데 선언적 라우팅이면 Route를 추가하면 됨
        - 코드가 한 군데에 모여 있으니 수정하기 쉽고, 추가하기 쉽고, 삭제하기 쉬움
        ⇒ 페이지 구조가 바뀌어도 어디를 고쳐야 하는지 명확하다는 장점 존재
        - 예시

            ```jsx
            <Route path="/admin" element={<Admin />} />
            ```
      - 장점 3 - 실수를 줄일 수 있음
        → 선언적 라우팅은 이미 정해진 구조 안에서 Route만 추가하면 되므로 페이지를 만드는 상황에서의 실수를 줄여줌
      - 장점 4 - 페이지 구조를 한눈에 파악할 수 있음
        - 프로젝트의 흐름을 이해하기 좋음
        - 예시
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Routes>
        //Layout이 공통 틀이고 그 안에 홈, 소개, 상품 페이지가 들어감을 알 수 있음

**useEffect 정리**

1. 기본 동작 원리
   1. 컴포넌트 함수 실행 (렌더링)
   2. 화면에 UI 그려짐
   3. 그 후에 useEffect 실행
      ⇒ 핵심: useEffect는 화면이 그려진 이후에 실행
2. 의존성 배열 [ ]

- 두 번째 인자로 배열을 넘기면 언제 실행할지 제어할 수 있음
  // 1️⃣ 배열 없음 → 렌더링마다 매번 실행
  useEffect(() => {
  console.log("매번 실행!");
  });

  // 2️⃣ 빈 배열 → 최초 1번만 실행 (마운트)
  useEffect(() => {
  console.log("처음 한 번만!");
  }, []);

  // 3️⃣ 값이 있는 배열 → 해당 값이 바뀔 때마다 실행
  useEffect(() => {
  console.log("userId가 바뀔 때마다!");
  }, [userId]);

3. 클린업 함수 `return`

- useEffect 안에서 `return`으로 함수를 반환하면 정리 작업을 할 수 있음
  useEffect(() => {
  // 🟢 실행: 구독, 타이머, 이벤트 등록
  const timer = setInterval(() => {
  console.log("1초마다 실행!");
  }, 1000);

  // 🔴 클린업: 컴포넌트가 사라질 때 정리
  return () => {
  clearInterval(timer); // 타이머 제거
  console.log("정리됨!");
  };
  }, []);  
  클린업이 실행되는 시점은 두 가지예요.
  1. 컴포넌트가 화면에서 사라질 때 (언마운트)
  2. useEffect가 다시 실행되기 직전

추가 학습🍠

- **`fetch`** 정리
  - `fetch` : 인터넷에서 데이터를 가져오거나 보낼 때 사용
  ```jsx
  //예시

  fetch('https://api.example.com/user')
    .then((response) => response.json()) // 받은 데이터를 읽기 좋게 변환
    .then((data) => console.log(data)); // 데이터 사용!
  ```

  - 특징 2가지
    - `비동기` 여서 데이터가 올 때까지 기다려야 함
      → `await` 사용
    ```jsx
    //예시
    const response = await fetch('https://api.example.com/user');
    const data = await response.json();
    ```

    - 실패해도 에러를 알려주지 않음⚠️
      → 직접 확인해야 함
    ```jsx
    const response = await fetch('https://api.example.com/user');
    const data = await response.json();
    ```
- **`axios`** 정리
  - `axios` : 인터넷에서 데이터를 가져오거나 보낼 때 사용
  - 자동으로 변환하므로 코드가 간단해짐
  ```jsx
  const { data } = await axios.get(url);
  ```
- **`fetch`**와 **`axios`**의 차이
  - `fetch`
  - 내장 여부: 브라우저 / Node 내장
  - HTTP 에러 자동 throw: 자동으로 하지 않아 직접 처리해야 함
  - 요청 / 응답 인터셉터: 없음
  - 자동 JSON 변환: 없으므로 `.json()` 필요
  - 요청 취소: `AbortController`
  - 진행률 추적: 어려움
  - `axois`
  - 내장 여부: 없음 → 별도 설치 필요
  - HTTP 에러 자동 throw: 자동 처리
  - 요청 / 응답 인터셉터: 지원
  - 자동 JSON 변환: 자동
  - 요청 취소: `CancelToken`
  - 진행률 추적: 쉬움
