# useEffect

## useEffect란?

- `useEffect`는 React 함수 컴포넌트에서 <strong>부수 효과(Side Effect)</strong>를 처리하기 위한 훅임
- 렌더링 자체와 직접 관련 없는 작업(데이터 요청, 이벤트 등록, 타이머, 수동 DOM 조작 등)을 안전하게 관리할 때 사용함
- 특히 <strong>컴포넌트 마운트 시 한 번 실행</strong>, <strong>특정 값 변경 시 실행</strong>, <strong>리렌더링마다 실행</strong> 같은 제어가 가능함

<aside>

`useEffect`는 "화면을 그리는 일"이 아니라,  
화면이 그려진 뒤 필요한 <strong>추가 동작</strong>을 처리하는 도구라고 이해하면 쉬워요.

</aside>

---

## useEffect 기본 문법

```tsx
import { useEffect } from 'react';

useEffect(() => {
  // 실행할 부수 효과 코드
}, []);
```

- 첫 번째 인자: <strong>실행할 로직(콜백 함수)</strong>
- 두 번째 인자: <strong>의존성 배열(Dependency Array)</strong>

### 의존성 배열 규칙

- `[]` (빈 배열): 마운트 시 한 번 실행
- `[value]`: `value`가 변경될 때마다 실행
- 생략: 컴포넌트가 리렌더링될 때마다 실행

---

## 실행 타이밍 요약

### 1) 마운트 시 한 번 실행

```tsx
useEffect(() => {
  console.log('처음 한 번 실행');
}, []);
```

### 2) 특정 상태/props 변경 시 실행

```tsx
useEffect(() => {
  console.log('count가 바뀔 때 실행');
}, [count]);
```

### 3) 매 렌더링마다 실행

```tsx
useEffect(() => {
  console.log('렌더링마다 실행');
});
```

---

## 데이터 호출 패턴 (API 요청)

### 핵심 흐름

1. `useState`로 데이터를 저장할 상태를 선언함
2. `useEffect`에서 API를 호출함
3. 응답 데이터를 state에 저장함
4. state를 화면에 렌더링함

```tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

type Movie = { id: number; title: string };
type MovieResponse = { results: Movie[] };

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization: `Bearer 토큰값`,
          },
        }
      );

      setMovies(data.results);
    };

    fetchMovies();
  }, []);

  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  );
};
```

### 왜 `useEffect(async () => {})`를 직접 쓰지 않을까?

- `useEffect` 콜백은 동기 함수여야 함
- `async` 함수는 `Promise`를 반환하므로, <strong>effect 내부에 async 함수를 따로 만들고 호출</strong>하는 패턴을 사용함

---

## Optional Chaining과 초기 렌더링

- 초기 렌더링 시점에는 데이터가 아직 없을 수 있음
- 중첩 데이터 접근 시 `undefined` 에러를 피하려면 Optional Chaining(`?.`)을 활용하면 안전함

```tsx
{movies?.map((movie) => (
  <li key={movie.id}>{movie.title}</li>
))}
```

---

## Clean Up Function (정리 함수)

### 클린업 함수란?

- `useEffect`에서 등록한 이벤트/타이머/구독 등을 <strong>정리</strong>하는 함수임
- effect 콜백에서 `return () => { ... }` 형태로 작성함

```tsx
useEffect(() => {
  const onClick = () => console.log('clicked');
  window.addEventListener('click', onClick);

  return () => {
    window.removeEventListener('click', onClick);
  };
}, []);
```

### 언제 실행되나?

1. 다음 effect가 실행되기 <strong>직전</strong> (의존성 값이 바뀌어 재실행될 때)
2. 컴포넌트가 <strong>언마운트</strong>될 때

### 왜 중요한가?

- 이벤트 중복 등록 방지
- 타이머/구독 누수 방지
- 메모리 누수(memory leak) 예방

---

## useEffect 실무 체크리스트

- effect 안의 로직이 정말 "부수 효과"인지 먼저 구분하기
- 의존성 배열을 의도에 맞게 정확히 작성하기
- API 호출 시 로딩/에러 상태도 함께 설계하기
- 이벤트/타이머/구독은 반드시 클린업으로 정리하기
- 복잡해지면 커스텀 훅으로 분리해 재사용성 높이기

---

## 한 줄 정리

- `useEffect`는 React에서 <strong>렌더링 외부의 동작</strong>을 제어하는 핵심 훅이며,  
  실무에서는 <strong>의존성 배열 + 클린업 함수</strong>를 정확히 다루는 것이 가장 중요함.

