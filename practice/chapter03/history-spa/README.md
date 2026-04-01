# History SPA 실습해보기

React Router 없이 브라우저 History API와 React Context API만으로 SPA 라우터를 직접 구현한 실습 프로젝트

## 실습 내용

### 1. History API

| API                                    | 설명                                                                               |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `history.pushState(state, "", url)`    | 히스토리 스택에 새 항목 추가 (뒤로가기 가능)                                       |
| `history.replaceState(state, "", url)` | 현재 항목 교체 (뒤로가기 시 이전 페이지로 이동)                                    |
| `history.back()`                       | 한 단계 뒤로                                                                       |
| `history.forward()`                    | 한 단계 앞으로                                                                     |
| `history.go(n)`                        | n만큼 이동 (음수: 뒤로, 양수: 앞으로)                                              |
| `popstate` 이벤트                      | 뒤로/앞으로 가기 시 발생. pushState/replaceState는 발생 안 함 → 수동 dispatch 필요 |

### 2. state 전달

`pushState`의 첫 번째 인자로 데이터를 함께 전달할 수 있음

```ts
history.pushState({ username: "카사" }, "", "/user/1");
// 이동한 페이지에서 history.state로 접근 가능
```

### 3. 중첩 경로

`/about/first`, `/about/second` 같은 중첩 경로 구현  
구체적인 경로를 먼저 매칭해야 함 (`/about/first`가 `/about`보다 앞에 위치)

### 4. 커스텀 라우터 구조

```
router/
  RouterContext.tsx  - Context + Provider (currentPath, state 관리)
  useRouter.ts       - useRouter 훅
  Router.tsx         - 경로 매칭 및 컴포넌트 렌더링
  navigate.ts        - pushState/replaceState 래퍼 함수
```
