# `pustState`, `popstate` 이벤트, 전체 리로드와의 차이
## 전체 리로드와의 차이

`pushState`, `popstate`는 페이지를 새로고침하지 않고도 URL과 화면 상태를 다룰 수 있는 방식이고, 

전체 리로드는 브라우저가 새 HTML 문서를 다시 받아와 페이지 전체를 다시 여는 방식

## `pushState`, `popstate` 방식

- 페이지 전체 새로고침이 일어나지 않음
- 서버에 새로운 HTML 문서를 다시 요청하지 않음
- 현재 실행 중인 JavaScript가 유지됨
- 필요한 화면만 다시 렌더링할 수 있음
- SPA(Single Page Application)에서 사용됨

## `pushState`

`history.pushState()`는 페이지를 새로고침하지 않고 주소만 바꾸면서 브라우저 히스토리에 기록을 추가하는 메서드

```jsx
history.pushState({ page: 'about' }, '', '/about');
```

- 주소창이 `/about`으로 바뀜
- 브라우저 히스토리에 새 기록이 쌓임

<aside>
💡

`history.pushState(state, unused, url);`

### 1. 첫 번째 인자 : `state`

```jsx
{ page: 'about' }
```

히스토리 기록에 함께 저장할 데이터

나중에 사용자가 뒤로가기 / 앞으로가기를 했을 때 `popstate` 이벤트에서 꺼내서 쓸 수 있음

### 2. 두 번째 인자 : `unused`

```jsx
' '
```

원래 title 용도로 만들었는데 실제로 크게 쓰이지 않아서 보통 빈 문자열을 넣음

### 3. 세 번째 인자 : `url`

```jsx
'/about'
```

주소창에 표시될 새로운 URL

이 코드 실행 후

- 주소창이 `/about`으로 바뀜
- 히스토리에 새 항목만 추가됨
- 새로고침은 안 됨
- 같은 origin 안에서만 가능함
</aside>

## `popstate`

`popstate`는 사용자가 뒤로가기 / 앞으로가기를 했을 때 발생하는 이벤트

```jsx
window.addEventListener('popstate', (event) => {
	console.log('이동');
	console.log(event.state);
});
```

- `pushState()`를 호출한다고 해서 바로 `popstate`가 실행되진 않음
- 사용자가 히스토리 이동을 해야 발생함
- 이 때 이전에 `pustState`로 넣어둔 `state`를 `event.state`로 받을 수 있음

# 전체 리로드 방식과 SPA 라우팅 방식의 차이
# 전체 리로드 방식과 SPA 라우팅 방식의 차이

- **전체 리로드 방식**은 페이지를 이동할 때마다 **문서 전체를 다시 불러오는 방식**
- **SPA 라우팅 방식**은 페이지를 새로 불러오지 않고 **현재 페이지에서 화면만 바꾸는 방식**

---

## 전체 리로드 방식

### 의미

사용자가 페이지를 이동할 때마다 브라우저가 서버에 새로운 HTML을 요청하고,

페이지 전체를 다시 렌더링하는 방식

### 특징

- 페이지 이동 시 **전체 새로고침**이 발생함
- 서버로부터 새로운 HTML 문서를 다시 받아옴
- 기존 JavaScript 상태가 초기화될 수 있음
- 전통적인 멀티 페이지 웹사이트 방식

### 예시

```html
<a href="/about">소개 페이지</a>
```

## SPA 라우팅 방식

### 의미

하나의 HTML 페이지 안에서 JavaScript가 URL만 변경하고,

필요한 화면 부분만 다시 렌더링하는 방식

### 특징

- **전체 새로고침이 없음**
- 화면 일부만 바뀌므로 더 부드럽게 이동함
- JavaScript 상태를 유지하기 쉬움
- React, Vue 같은 프레임워크에서 자주 사용됨

### 예시

```jsx
history.pushState({},'','/about');
```

이 코드는 페이지를 새로고침하지 않고 주소만 `/about`으로 바꾸고

JavaScript가 이에 맞는 화면을 다시 그려줌

# `preventDefault()`와 `stopPropagation()`의 차이와 역할
# preventDefault()와 stopPropagation()의 차이와 역할

## 한 줄 핵심

- `preventDefault()`는 **원래 하려던 기본 동작을 막는 것**
- `stopPropagation()`은 **이벤트가 부모 요소로 퍼지는 것을 막는 것**

---

## preventDefault()

### 의미

브라우저가 요소에 대해 기본적으로 수행하려던 동작을 막음

### 역할

사용자가 어떤 요소를 조작했을 때, 브라우저가 자동으로 수행하는 기본 행동을 제어하기 위해 사용

### 예시

- 링크 클릭 시 페이지 이동
- form 제출 시 새로고침
- 체크박스 클릭 시 체크 상태 변경

### 코드 예시

```jsx
const link = document.querySelector('a');

link.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('링크 이동 막음');
});
```

## stopPropagation()

### 의미

이벤트가 현재 요소에서 끝나고,

부모 요소로 더 이상 전달되지 않도록 막음

### 역할

이벤트가 상위 요소까지 전파되어 원하지 않는 동작이 함께 실행되는 것을 막기 위해 사용

### 코드 예시

```jsx
constparent=document.querySelector('.parent');
constchild=document.querySelector('.child');

parent.addEventListener('click', () => {
console.log('부모 클릭');
});

child.addEventListener('click', (e) => {
e.stopPropagation();
console.log('자식 클릭');
});
```

### 결과

자식 요소를 클릭하면 원래는 부모의 클릭 이벤트도 같이 실행될 수 있는데,

`stopPropagation()`을 쓰면 부모까지 이벤트가 올라가지 않음

### 차이 정리

### `preventDefault()`

- 행동 차단
- 사용자의 기본 행동을 막음

### `stopPropagation()`

- 이벤트 전달 차단
- 부모 요소로 이벤트가 전달되는 것을 막음

# 선언적 라우팅 (Route, Routes) 구조의 장점
## 한 줄 핵심

선언적 라우팅은 **"어떤 경로에서 어떤 화면을 보여줄지"를 구조적으로 적어둘 수 있어서**,

코드가 더 **읽기 쉽고, 관리하기 쉽고, 확장하기 쉬운 것**이 가장 큰 장점

---

## 선언적 라우팅이란?

React Router에서 `Route`, `Routes`를 사용해

경로와 컴포넌트의 관계를 **미리 선언해두는 방식**

### 예시

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/mypage" element={<MyPage />} />
</Routes>
```

이 코드는

- `/` → `Home`
- `/about` → `About`
- `/mypage` → `MyPage`

## 장점

### 1) 구조를 한눈에 파악하기 쉽다

어떤 URL에서 어떤 페이지가 렌더링되는지 `Routes` 안에 모아두기 때문에 흐름을 파악하기 쉬움

즉, 라우팅 규칙이 여러 곳에 흩어져 있지 않고 한 곳에 정리되어 보여서 가독성이 좋음

---

### 2) 코드가 직관적이다

명령형 방식처럼 "이 조건이면 이동하고, 저 조건이면 다른 컴포넌트를 띄우고..." 이런 식으로 직접 제어하지 않아도 됨

그냥 **"이 경로면 이 컴포넌트"** 라고 적으면 되기 때문에 훨씬 이해하기 쉬움

<aside>
💡

명령형 방식

```jsx
if (isLoggedIn) {
	navigate('/mypage');
} else {
	navigate('/login');
}
```

</aside>

---

### 3) 유지보수가 쉽다

새 페이지를 추가하거나 수정할 때 라우트 설정만 보면 되니까 관리가 편함

예를 들어 `/settings` 페이지를 추가하고 싶으면

```jsx
<Route path="/settings" element={<Settings/>}/>
```

이렇게 한 줄 추가하면 됨

---

### 4) 중첩 라우팅이 편하다

부모 페이지 안에 자식 페이지를 넣는 구조를 만들기 쉬움

예

```jsx
<Route path="/mypage" element={<MyPageLayout/>}>
<Route path="profile" element={<Profile/>}/>
<Route path="like" element={<LikePage/>}/>
</Route>
```

이렇게 하면

`/mypage/profile`, `/mypage/like` 같은 구조를

깔끔하게 표현할 수 있음

즉, 레이아웃과 하위 페이지를 체계적으로 나누기 좋음

---

### 5) 컴포넌트 기반 개발과 잘 맞는다

React는 원래 UI를 컴포넌트 단위로 나누는 방식인데, 선언적 라우팅도 각 경로에 컴포넌트를 연결하는 구조라서 React 방식과 잘 어울림

---

### 6) 조건부 처리도 비교적 깔끔하다

로그인 여부에 따라 접근을 제한하는 것도

선언적으로 표현하기 쉬움

예:

```jsx
<Route
	path="/mypage"
	element={
	isLoggedIn? <MyPage/>:<Navigate to="/login" replace/>
  }
/>
```

이처럼 "이 경로는 로그인한 사용자만 볼 수 있음" 같은 규칙도 코드상에서 바로 드러남

# useEffect에서 부수효과를 처리하는 방법
## 한 줄 핵심

`useEffect`는 화면을 그리는 것 말고 바깥에서 따로 해야 하는 작업을 처리할 때 쓰는 Hook

즉, React 컴포넌트가 화면만 그리는 게 아니라 네트워크, 브라우저 DOM, 타이머, 구독 같은 외부 작업도 해야 할 때 `useEffect`를 사용함

---

## 부수효과(side effect)란?

부수효과는 단순히 화면을 계산해서 그리는 일 외에 일어나는 작업

예시

- API 요청 보내기
- `document.title` 바꾸기
- 이벤트 리스너 등록하기
- 타이머 설정하기
- 외부 라이브러리와 연결하기

이런 건 화면 계산 자체가 아니라 React 바깥에 영향을 주는 작업이기 때문에 React 공식 문서는 이런 작업을 렌더링 중에 직접 하지 말고, `useEffect` 안에서 처리하라고 설명함

## 왜 `useEffect`를 쓰는가?

React 컴포넌트는 가능한 한 순수하게 렌더링되어야 함

즉, 렌더링 함수 안에서는 화면에 무엇을 보여줄지만 계산하고, 외부 시스템을 건드리는 작업은 따로 분리하는 것이 좋음

그치만 실제 웹에서는 화면만 그리는 게 아니라 데이터 요청도 해야 하고, 이벤트도 등록해야 하고, 타이머도 돌려야 하지만 이런 작업을 렌더링 코드 안에 섞어버리면 복잡해짐

그래서 `useEffect`를 써서 렌더링 끝난 후 따로 실행할 작업을 분리함

`useEffect`는 이런 부수효과를 렌더링이 끝난 뒤 실행하게 해주는 도구, React는 `useEffect`가 렌더 후 실행되며, 외부 시스템과 동기화하는 용도

## 의존성 배열의 의미

`useEffect`는 두 번째 인자인 의존성 배열에 따라 실행 시점이 달라짐

### 1. 의존성 배열이 없을 때

```jsx
useEffect(() => {
	console.log('렌더링마다 실행');
});
```

- 렌더링될 때마다 실행됨

### 2. 빈 배열일 때

```jsx
useEffect(() => {
console.log('처음 한 번 실행');
}, []);
```

- 처음 마운트될 때 한 번 실행됨

### 3. 특정 값이 들어 있을 때

```jsx
useEffect(() => {
console.log('count가 바뀔 때 실행');
}, [count]);
```

- `count`가 바뀔 때마다 다시 실행됨

## cleanup 함수가 필요한 이유

이벤트 리스너, 구독, 타이머처럼 어떤 작업은 시작만 하면 끝이 아니라 후에 정리도 해야 하는데,

**설정한 것을 나중에 정리해야 하는 작업**은 cleanup 함수가 필요함

예시

```jsx
useEffect(() => {
	constid=setInterval(() => {
	console.log('실행 중');
	  },1000);
	
	return () => {
		clearInterval(id);
  };
}, []);
```

타이머를 만들고 컴포넌트가 사라질 때 타이머를 정리하는 것

### cleanup이 필요한 대표 예시

- `addEventListener` 해제
- `setInterval`, `setTimeout` 정리
- 웹소켓/구독 해제
- 외부 라이브러리 연결 해제

### cleanup이 실행되는 경우

**예시 1. Effect가 다시 실행될 때**

```jsx
useEffect(() => {
  console.log('effect 실행:', count);

  return () => {
    console.log('cleanup 실행:', count);
  };
}, [count]);
```

`count`가 `1 → 2`로 바뀌면 순서는 이렇게 됨.

1. 이전 Effect의 cleanup 실행
2. 새로운 Effect 실행

즉,

- `count = 1`일 때 effect 실행
- `count = 2`가 되면
먼저 `count = 1`에 대한 cleanup 실행
- 그 다음 `count = 2`에 대한 effect 실행

왜 이렇게 하냐면,

이전 타이머, 이전 구독, 이전 이벤트 리스너가 남아 있으면 **중복 등록** 문제가 생길 수 있기 때문

**예시 2. 컴포넌트가 사라질 때**

컴포넌트가 화면에서 없어질 때도 cleanup이 실행됨.

예를 들어:

- 페이지 이동해서 컴포넌트가 사라짐
- 조건부 렌더링 때문에 컴포넌트가 없어짐

이럴 때 이전에 등록해둔

- 타이머
- 이벤트 리스너
- 웹소켓 연결

같은 걸 정리해야 함.

즉, cleanup은 쉽게 말해서

“이 컴포넌트가 남긴 흔적 치우기”임

- **예시 3. Strict Mode에서 setup + cleanup이 한 번 더 실행**
    
    이건 **개발 모드에서만** 일어나는 동작
    
    React Strict Mode에서는 개발자가 실수한 코드를 더 빨리 발견할 수 있게 하려고, Effect를 일부러 한 번 더 검사하듯 실행하기도 함
    
    예를 들어 원래는 이렇게 생각할 수 있음:
    
    1. effect 실행
    
    그런데 Strict Mode 개발 환경에서는 이렇게 보일 수 있음:
    
    1. effect 실행
    2. cleanup 실행
    3. effect 다시 실행
    
    즉, React가 일부러 한 번 더 돌려보면서
    
    - cleanup을 제대로 작성했는지
    - 중복 등록 문제가 없는지
    - effect가 안전하게 동작하는지
    
    확인해보는 것임.
    

---

## 왜 이런 걸 하냐?

예를 들어 이벤트 리스너를 등록만 하고 cleanup을 안 해두면,

Strict Mode에서 다시 실행될 때 이벤트가 **중복 등록**될 수 있음.

그러면 개발 중에 이상한 동작이 바로 보여서

“아 cleanup 안 했구나” 하고 빨리 알아차릴 수 있음.

즉, Strict Mode의 추가 실행은

**버그를 미리 발견하게 해주는 테스트 같은 동작**이라고 보면 됨.

---

## 무조건 `useEffect`를 쓰면 안 되는 이유

**외부 시스템과 동기화하는 일이 아니라면 Effect를 쓸 이유가 없음**

예를 들어,

- props나 state를 조합해서 값 계산하기
- 어떤 값이 바뀌었을 때 다른 값을 단순 계산하기

이런 경우는 `useEffect`보다 **렌더링 중 계산**하거나 **이벤트 핸들러에서 처리**하는 편이 더 자연스러움

 불필요한 Effect를 줄이면 코드가 더 단순하고, 빠르고, 덜 헷갈리게 됨

---

## 이 영상에서 얻어가면 좋은 포인트

### 1. `useEffect`는 “렌더 후 실행되는 코드”이다

렌더링 자체와 분리해서 생각해야 한다.

### 2. `useEffect`의 목적은 외부 시스템과의 동기화이다

단순 상태 계산용으로 남발하면 안 된다.

### 3. 의존성 배열에 따라 실행 타이밍이 달라진다

언제 다시 실행되는지 이해하는 것이 핵심이다.

### 4. cleanup은 setup만큼 중요하다

등록했으면 해제해야 메모리 누수와 중복 실행을 막을 수 있다.

---

## 정리

이 영상의 핵심은

**`useEffect`는 렌더링과 별개로, 외부 시스템과 동기화해야 하는 부수효과를 처리하기 위한 Hook이라는 점**

즉,

- 렌더링 중에는 화면 계산에 집중하고
- 외부 작업은 `useEffect`로 분리하며
- 의존성 배열로 실행 시점을 조절하고
- cleanup으로 정리까지 해주는 것