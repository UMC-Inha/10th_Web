useState는 `const [state, setState] = useState(initialValue);` 형태로 사용함

- 보통 단순한 값(숫자, 불리언, 문자열)을 관리하기에 효과적
- 여러 상태가 서로 의존성을 가질때 유지보수가 어렵다
- 상태 변경 함수가 흩어져 있을 때 상태의 변경을 추적하기 어려움

useReducer는 `const [state, dispatch] = useReducer(reducer, initialState);` 형태로 사용하며 미리 작성한 reducer(함수)를 통해 특정 행동을 취하여 새로운 state를 반환하며 dispatch를 통해 reducer로 state를 전달함

- 한번의 행동으로 여러 개의 상태를 업데이트 하기에 유리함
- 상태를 변경하는 로직이 reducer에 모여있어 유지 보수가 쉬움
- 여러 값이 얽힌 상태를 관리할때 데이터의 무결성을 유지하기 쉽다
- 순수 함수이기에 입력과 명령에 따른 결과 예측과 버그를 발견하기 쉽다