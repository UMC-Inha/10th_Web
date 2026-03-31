# useReducer vs useState
`useState`은 상태가 단순할 떄, `useReducer`은 상태가 여러 개 얽혀있고, 한 번의 액션으로 여러 상태를 같이 바꿔야 할 때 사용   
즉, `useState`는 간단한 상태 관리에 적합하고, `useRefucer`은 복잡한 상태 변화 로직 관리에 더 적합함

## useState는 언제 쓸까
- 상태 개수가 적음
- 로직이 짧음
- 컴포넌트가 단순함
- 상태끼리 크게 안 얽힘
- 한 상태를 독립적으로 바꾸는 경우가 많음

예를 들면
```
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [isOpen, setIsOpen] = useState(false);
```
같은 것들은 `useState`가 가장 직관적임

### useState의 장점
- 문법이 단순함
- 배우기 쉬움
- 작은 컴포넌트에서 빠르게 적용할 수 있음

## useReducer은 언제 쓸까
- 상태가 여러 개임
- 한 액션이 여러 상태를 동시에 바꿈
- 규칙이 많음
- 상태 변경 흐름을 한 곳에서 보고 싶음
- 상태 업데이트 로직이 복잡해짐
- 이전 상태를 바탕으로 다음 상태를 계산하는 경우가 많음

예를 들면
- 장바구니
- 폼 검증
- 단계형 입력 UI
- 필터, 정렬, 검색이 섞인 상태

### useReducer의 장점
- 상태 변경 규칙을 한 곳에 모아 관리할 수 있음
- 로직이 흩어지지 않아 유지보수가 쉬움
- 복잡한 상태 변화를 예측하기 쉬워짐