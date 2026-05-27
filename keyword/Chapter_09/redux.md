- Provider
    
    ## Provider란?
    
    `Provider`는 Redux Store를 React 애플리케이션 전체에 전달(공급)해주는 컴포넌트입니다.
    
    쉽게 말하면:
    
    ```
    "Redux Store를 React 전체에서 사용할 수 있게 연결해주는 역할"
    ```
    
    을 합니다.
    
    `react-redux` 라이브러리에서 제공됩니다.
    
    ---
    
    # 왜 필요한가?
    
    Redux Store를 만들었다고 해서 React 컴포넌트가 자동으로 사용할 수 있는 것은 아닙니다.
    
    React 컴포넌트가:
    
    - `useSelector`
    - `useDispatch`
    
    같은 Redux 기능을 사용하려면 Store를 React에 연결해야 합니다.
    
    그 역할을 하는 것이 `Provider`
    
    ---
    
    # 사용 위치
    
    보통 가장 최상단에서 감쌉니다.
    
    대부분:
    
    - `main.jsx`
    - `index.jsx`
    
    에서 사용
    
    ---
    
    # 기본 코드
    
    ```jsx
    import ReactDOM from 'react-dom/client'
    import App from './App'
    
    import { Provider } from 'react-redux'
    import { store } from './app/store'
    
    ReactDOM.createRoot(document.getElementById('root')).render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    ```
    
    ---
    
    # 코드 해석
    
    ## 1.
    
    ```jsx
    import { Provider } from 'react-redux'
    ```
    
    Redux와 React를 연결하기 위한 Provider import
    
    ---
    
    ## 2.
    
    ```jsx
    <Provider store={store}>
    ```
    
    Redux Store를 Provider에 전달
    
    여기서 전달된 Store를 하위 모든 컴포넌트가 사용할 수 있게 됨
    
    ---
    
    ## 3.
    
    ```jsx
    <App/>
    ```
    
    Provider 내부에 있는 컴포넌트들은 모두 Redux 사용 가능
    
    즉:
    
    ```jsx
    useSelector()
    useDispatch()
    ```
    
    사용 가능해짐
    
    ---
    
    # Provider 내부 동작 원리
    
    Provider는 내부적으로 React Context API를 사용합니다.
    
    ```
    Store 생성
       ↓
    Provider가 Context에 저장
       ↓
    하위 컴포넌트가 Context에서 Store 사용
    ```
    
    그래서 어디서든:
    
    - 상태 조회
    - dispatch 실행
    
    가능
    
    ---
    
    # Provider가 없으면?
    
    예시:
    
    ```jsx
    function Counter() {
      const count = useSelector((state) => state.counter.value)
    
      return <div>{count}</div>
    }
    ```
    
    이 상태에서 Provider 없이 실행하면 에러 발생
    
    대표 에러:
    
    ```
    could not find react-redux context value
    ```
    
    이유:
    
    - Redux Store를 React가 전달받지 못했기 때문
    
    ---
    
    # Provider의 핵심 역할
    
    ## 1. Store 공급
    
    ```
    Redux Store를 React 전체에 공급
    ```
    
    ---
    
    ## 2. 전역 상태 공유
    
    어떤 컴포넌트든 동일한 상태 사용 가능
    
    ```
    A 컴포넌트
    B 컴포넌트
    C 컴포넌트
    ```
    
    모두 같은 Store 사용
    
    ---
    
    ## 3. 상태 변경 감지 가능
    
    Store가 변경되면:
    
    - useSelector 감지
    - 컴포넌트 리렌더링
    
    가능해짐
    
    ---
    
    # Provider를 쓰는 이유
    
    만약 Provider가 없다면:
    
    ```jsx
    <Component store={store} />
    ```
    
    처럼 props로 계속 전달해야 함
    
    즉:
    
    ```
    props drilling 문제 발생
    ```
    
    Provider는 이를 해결
    
- configureStore
    
    ## configureStore란?
    
    Redux Store를 생성하는 함수
    
    Redux Toolkit에서 제공하는 공식 Store 생성 방식입니다.
    
    기존 Redux의:
    
    ```
    createStore()
    ```
    
    를 대체합니다.
    
    ---
    
    # Store란?
    
    Store는 Redux 상태(state)를 저장하는 중앙 저장소입니다.
    
    쉽게 말하면:
    
    ```
    "전역 상태를 저장하는 공간"
    ```
    
    ---
    
    # configureStore 기본 코드
    
    ```jsx
    import { configureStore } from '@reduxjs/toolkit'
    import counterReducer from '../features/counter/counterSlice'
    
    export const store = configureStore({
      reducer: {
        counter: counterReducer,
      },
    })
    ```
    
    ---
    
    # configureStore 역할
    
    ## 1. Redux Store 생성
    
    ```jsx
    const store = configureStore(...)
    ```
    
    Store 생성
    
    ---
    
    ## 2. reducer 등록
    
    ```jsx
    reducer: {
      counter: counterReducer
    }
    ```
    
    Redux 상태 변경 로직 연결
    
    ---
    
    ## 3. middleware 자동 설정
    
    자동으로:
    
    - thunk middleware
    - 개발용 middleware
    
    추가
    
    ---
    
    ## 4. Redux DevTools 자동 연결
    
    브라우저 Redux DevTools와 자동 연결됨
    
    추가 설정 필요 없음
    
    ---
    
    # reducer 옵션 설명
    
    ```jsx
    reducer: {
      counter: counterReducer
    }
    ```
    
    여기서:
    
    ## key
    
    ```
    counter
    ```
    
    Redux state 이름
    
    ---
    
    ## value
    
    ```
    counter Reducer
    ```
    
    실제 상태 변경 로직
    
    ---
    
    # 실제 state 구조
    
    위 코드 기준:
    
    ```
    state= {
      counter: {
        value:0
      }
    }
    ```
    
    따라서:
    
    ```
    state.counter.value
    ```
    
    로 접근
    
    ---
    
    # 여러 reducer 등록
    
    ```
    configureStore({
      reducer: {
        auth:authReducer,
        user:userReducer,
        todo:todoReducer,
      },
    })
    ```
    
    state 구조:
    
    ```
    state.auth
    state.user
    state.todo
    ```
    
    ---
    
    # 기존 Redux와 차이
    
    기존 Redux:
    
    ```jsx
    import { createStore, combineReducers } from 'redux'
    
    const rootReducer = combineReducers({
      counter: counterReducer,
    })
    
    const store = createStore(rootReducer)
    ```
    
    RTK:
    
    ```jsx
    configureStore({
      reducer: {
        counter: counterReducer
      }
    })
    ```
    
    훨씬 간단
    
    ---
    
    # configureStore 내부에서 자동으로 해주는 것
    
    ## 1. combineReducers 자동 처리
    
    원래 직접:
    
    ```
    combineReducers()
    ```
    
    해야 했음
    
    RTK가 자동 처리
    
    ---
    
    ## 2. Redux DevTools 연결
    
    자동 연결
    
    ---
    
    ## 3. thunk middleware 추가
    
    비동기 처리 가능
    
    예:
    
    - API 요청
    - 로그인
    - fetch
    
    ---
    
    ## 4. 개발용 체크 기능
    
    실수 감지:
    
    - state 직접 수정
    - serializable 문제
    
    등을 자동 체크
    
    ---
    
    # Store가 하는 일
    
    ## 상태 저장
    
    ```
    현재 Redux 상태 저장
    ```
    
    ---
    
    ## dispatch 처리
    
    ```
    dispatch(action)
    ```
    
    실행 가능
    
    ---
    
    ## reducer 실행
    
    action 발생 시 reducer 실행
    
    ---
    
    ## 상태 변경 알림
    
    useSelector에게 상태 변경 통보
    
    ---
    
    # 실제 데이터 흐름
    
    ```
    dispatch(action)
       ↓
    Store가 reducer 실행
       ↓
    새 state 생성
       ↓
    Store에 저장
       ↓
    useSelector 감지
       ↓
    컴포넌트 리렌더링
    ```
    
    ---
    
    # configureStore와 createSlice 관계
    
    ```
    createSlice
       ↓
    reducer 생성
       ↓
    configureStore에 등록
    ```
    
    즉:
    
    ```
    createSlice는 reducer 생성
    configureStore는 reducer 관리
    ```
    
    ---
    
    # 실무 구조 예시
    
    ## store.js
    
    ```jsx
    import { configureStore } from '@reduxjs/toolkit'
    
    import authReducer from '../features/auth/authSlice'
    import userReducer from '../features/user/userSlice'
    import todoReducer from '../features/todo/todoSlice'
    
    export const store = configureStore({
      reducer: {
        auth: authReducer,
        user: userReducer,
        todo: todoReducer,
      },
    })
    ```
    
    ---
    
    # 자주 하는 실수
    
    ## reducer 등록 안 함
    
    ```jsx
    configureStore({
      reducer: {}
    })
    ```
    
    slice 만들었어도 등록 안 하면 사용 불가
    
    ---
    
    ## state 경로 헷갈림
    
    ```jsx
    reducer: {
      counter: counterReducer
    }
    ```
    
    이면:
    
    ```
    state.counter
    ```
    
    로 접근해야 함
    
    ---
    
    # 핵심 요약
    
    ## configureStore
    
    ```
    Redux Store를 생성하는 함수
    ```
    
    ---
    
    ## 주요 역할
    
    - Store 생성
    - reducer 등록
    - middleware 자동 설정
    - DevTools 자동 연결
    
    ---
    
    ## state 구조 결정
    
    ```jsx
    reducer: {
      counter: counterReducer
    }
    ```
    
    ↓
    
    ```
    state.counter
    ```
    
- createSlice
    
    ## createSlice란?
    
    `createSlice`는 Redux Toolkit에서:
    
    - reducer
    - action creator
    - action type
    
    을 한 번에 자동 생성해주는 함수입니다.
    
    즉:
    
    ```
    Redux 상태 관리 코드를 한 곳에서 간단하게 작성할 수 있게 해주는 기능
    ```
    
    ---
    
    # 왜 사용하는가?
    
    기존 Redux에서는 직접:
    
    - action type 작성
    - action creator 작성
    - switch문 reducer 작성
    
    모두 해야 했습니다.
    
    기존 Redux 방식:
    
    ```jsx
    const INCREMENT = 'INCREMENT'
    
    const increment = () => {
      return {
        type: INCREMENT
      }
    }
    
    function counterReducer(state, action) {
      switch (action.type) {
        case INCREMENT:
          return {
            ...state,
            value: state.value + 1
          }
    
        default:
          return state
      }
    }
    ```
    
    코드가 길고 반복이 많음
    
    ---
    
    # createSlice 사용 시
    
    ```jsx
    constcounterSlice=createSlice({
      name:'counter',
    
      initialState: {
        value:0,
      },
    
      reducers: {
        increment: (state) => {
    state.value+=1
        },
      },
    })
    ```
    
    엄청 간단해짐
    
    ---
    
    # 기본 구조
    
    ```jsx
    import { createSlice } from '@reduxjs/toolkit'
    
    const counterSlice = createSlice({
      name: 'counter',
    
      initialState: {
        value: 0,
      },
    
      reducers: {
        increment: (state) => {
          state.value += 1
        },
    
        decrement: (state) => {
          state.value -= 1
        },
      },
    })
    
    export const {
      increment,
      decrement,
    } = counterSlice.actions
    
    export default counterSlice.reducer
    ```
    
    ---
    
    # createSlice 구성 요소
    
    # 1. name
    
    ```
    name:'counter'
    ```
    
    slice 이름
    
    자동으로 action type 생성 시 사용됨
    
    예:
    
    ```
    counter/increment
    counter/decrement
    ```
    
    형태로 자동 생성
    
    ---
    
    # 2. initialState
    
    ```jsx
    initialState: {
      value: 0
    }
    ```
    
    초기 상태값
    
    Redux state의 기본값
    
    ---
    
    # 3. reducers
    
    ```jsx
    reducers: {
      increment: (state) => {
        state.value += 1
      }
    }
    ```
    
    상태 변경 함수 작성
    
    ---
    
    # reducer 함수의 매개변수
    
    ```
    (state, action)
    ```
    
    ## state
    
    현재 상태
    
    ---
    
    ## action
    
    dispatch된 action 객체
    
    ```jsx
    {
      type: 'counter/addByAmount',
      payload: 5
    }
    ```
    
    ---
    
    # action 자동 생성
    
    ```jsx
    export const { increment } = counterSlice.actions
    ```
    
    자동 생성되는 함수:
    
    ```
    increment()
    ```
    
    실제 action:
    
    ```jsx
    {
      type: 'counter/increment'
    }
    ```
    
    ---
    
    # payload 사용
    
    ## reducer
    
    ```jsx
    addByAmount: (state, action) => {
      state.value += action.payload
    }
    ```
    
    ---
    
    ## dispatch
    
    ```jsx
    dispatch(addByAmount(5))
    ```
    
    ---
    
    ## action 객체
    
    ```jsx
    {
      type: 'counter/addByAmount',
      payload: 5
    }
    ```
    
    ---
    
    # Immer 기반 불변성 처리
    
    원래 Redux에서는 불변성을 위해:
    
    ```jsx
    return {
      ...state,
      value:state.value+1
    }
    ```
    
    처럼 새 객체를 만들어야 했음
    
    하지만 RTK는 내부적으로 Immer 사용
    
    그래서:
    
    ```jsx
    state.value += 1
    ```
    
    처럼 직접 수정하는 코드 가능
    
    실제로는 내부적으로 불변성을 유지하며 새 state 생성
    
    ---
    
    # createSlice 결과물
    
    ```jsx
    const counterSlice = createSlice(...)
    ```
    
    생성되는 것:
    
    ## 1. reducer
    
    ```jsx
    counterSlice.reducer
    ```
    
    ---
    
    ## 2. action creator
    
    ```
    counterSlice.actions
    ```
    
    ---
    
    # configureStore와 연결
    
    ```jsx
    configureStore({
      reducer: {
        counter:counterSlice.reducer
      }
    })
    ```
    
    ---
    
    # 실무 흐름
    
    ```
    createSlice 작성
       ↓
    reducer 생성
       ↓
    configureStore 등록
       ↓
    dispatch(action)
       ↓
    reducer 실행
       ↓
    state 변경
    ```
    
    ---
    
    # 핵심 요약
    
    ## createSlice
    
    ```
    reducer + action을 한 번에 생성하는 함수
    ```
    
    ---
    
    ## 주요 장점
    
    - 코드량 감소
    - action 자동 생성
    - switch문 제거
    - Immer 기반 불변성 자동 처리
    
    ---
    
    ## 가장 중요한 기능
    
    ```
    Redux 코드를 매우 간단하게 만들어준다
    ```
    
- useSelector
    
    ## useSelector란?
    
    Redux Store의 state를 조회하는 React Hook
    
    즉:
    
    ```
    Redux 상태를 읽어오는 기능
    ```
    
    ---
    
    # 왜 필요한가?
    
    Redux state는 Store 안에 저장됨
    
    ```
    Store
     └── state
    ```
    
    컴포넌트에서 이 값을 사용하려면:
    
    - state 읽기 필요
    
    그 역할을 하는 것이 `useSelector`
    
    ---
    
    # 기본 사용법
    
    ```jsx
    const count = useSelector(
      (state) => state.counter.value
    )
    ```
    
    ---
    
    # 코드 해석
    
    ## state
    
    Redux 전체 state
    
    예:
    
    ```jsx
    state= {
      counter: {
        value:10
      }
    }
    ```
    
    ---
    
    ## selector 함수
    
    ```jsx
    (state) => state.counter.value
    ```
    
    필요한 값만 선택해서 반환
    
    ---
    
    # useSelector 동작 원리
    
    ```
    Redux state 변경
       ↓
    useSelector 감지
       ↓
    선택한 값 변경 여부 확인
       ↓
    컴포넌트 리렌더링
    ```
    
    ---
    
    # 예시
    
    ## store state
    
    ```
    state = {
      counter: {
        value: 5
      }
    }
    ```
    
    ---
    
    ## 컴포넌트
    
    ```jsx
    function Counter() {
      const count = useSelector(
        (state) => state.counter.value
      )
    
      return <h1>{count}</h1>
    }
    ```
    
    ---
    
    # 상태 변경 시
    
    ```
    dispatch(increment())
    ```
    
    ↓
    
    ```
    state.counter.value증가
    ```
    
    ↓
    
    ```
    useSelector 감지
    ```
    
    ↓
    
    ```
    컴포넌트 리렌더링
    ```
    
    ---
    
    # 여러 값 가져오기
    
    ```jsx
    const user = useSelector(
      (state) => state.user
    )
    
    const todos = useSelector(
      (state) => state.todo.todos
    )
    ```
    
    ---
    
    # useSelector 특징
    
    ## 자동 구독(subscription)
    
    Redux state 변화를 자동 감지
    
    ---
    
    ## 필요한 값만 선택
    
    ```
    state.counter.value
    ```
    
    처럼 일부만 선택 가능
    
    ---
    
    ## 값이 바뀔 때만 리렌더링
    
    성능 최적화 가능
    
    ---
    
    # 자주 하는 실수
    
    ## state 경로 실수
    
    ```
    state.counter.value
    ```
    
    여기서 `counter`는:
    
    ```jsx
    configureStore({
      reducer: {
        counter:counterReducer
      }
    })
    ```
    
    의 key 이름
    
    ---
    
    # 핵심 요약
    
    ## useSelector
    
    ```
    Redux state를 조회하는 Hook
    ```
    
    ---
    
    ## 역할
    
    - state 읽기
    - state 구독
    - state 변경 시 리렌더링
    
    ---
    
    ## 가장 중요한 점
    
    ```
    Redux 상태를 화면에 보여줄 때 사용
    ```
    
- useDispatch
    
    ## useDispatch란?
    
    Redux action을 실행(dispatch)하는 Hook
    
    즉:
    
    ```
    Redux state를 변경 요청하는 기능
    ```
    
    ---
    
    # 왜 필요한가?
    
    Redux state는 직접 수정 불가능
    
    반드시:
    
    ```
    dispatch(action)
    ```
    
    방식으로 변경해야 함
    
    ---
    
    # 기본 사용법
    
    ```
    constdispatch=useDispatch()
    ```
    
    ---
    
    # action 실행
    
    ```
    dispatch(increment())
    ```
    
    ---
    
    # 전체 예시
    
    ```jsx
    import { useDispatch } from 'react-redux'
    import { increment } from './counterSlice'
    
    function Counter() {
      const dispatch = useDispatch()
    
      return (
        <button
          onClick={() => dispatch(increment())}
        >
          증가
        </button>
      )
    }
    ```
    
    ---
    
    # dispatch 동작 원리
    
    ```
    dispatch(action)
       ↓
    Store가 reducer 실행
       ↓
    state 변경
       ↓
    useSelector 감지
       ↓
    컴포넌트 리렌더링
    ```
    
    ---
    
    # payload 전달
    
    ## reducer
    
    ```jsx
    addByAmount: (state, action) => {
      state.value += action.payload
    }
    ```
    
    ---
    
    ## dispatch
    
    ```jsx
    dispatch(addByAmount(10))
    ```
    
    ---
    
    # 실제 action 객체
    
    ```jsx
    {
      type: 'counter/addByAmount',
      payload: 10
    }
    ```
    
    ---
    
    # useDispatch 특징
    
    ## action 실행 전용
    
    state 조회는 못 함
    
    조회는:
    
    - `useSelector`
    
    사용
    
    ---
    
    ## reducer 직접 호출 아님
    
    ```
    dispatch
       ↓
    store
       ↓
    reducer 실행
    ```
    
    ---
    
    # useDispatch와 useSelector 차이
    
    | Hook | 역할 |
    | --- | --- |
    | useSelector | state 읽기 |
    | useDispatch | state 변경 요청 |
    
    ---
    
    # 실무 흐름
    
    ```
    버튼 클릭
       ↓
    dispatch(action)
       ↓
    reducer 실행
       ↓
    state 변경
       ↓
    useSelector 감지
       ↓
    UI 업데이트
    ```
    
    ---
    
    # 핵심 요약
    
    ## useDispatch
    
    ```
    Redux action을 실행하는 Hook
    ```
    
    ---
    
    ## 역할
    
    - action dispatch
    - state 변경 요청
    
    ---
    
    ## 가장 중요한 점
    
    ```
    Redux 상태를 변경할 때 사용
    ```
    
- 기타 **`Redux Toolkit`** 사용 방법을 상세하게 정리해 보세요
    
     
    
    # createAsyncThunk
    
    ## createAsyncThunk란?
    
    Redux Toolkit에서 비동기 작업을 처리하기 위한 함수
    
    주로:
    
    - API 요청
    - 로그인
    - 데이터 fetch
    - 서버 통신
    
    등에 사용
    
    ---
    
    # 왜 필요한가?
    
    Redux는 기본적으로 동기 처리만 가능
    
    하지만 실제 서비스에서는:
    
    ```
    서버 요청
    로그인
    게시글 조회
    유저 정보 조회
    ```
    
    같은 비동기 작업이 매우 많음
    
    이를 쉽게 처리하기 위해 `createAsyncThunk` 사용
    
    ---
    
    # 기본 구조
    
    ```jsx
    import { createAsyncThunk } from '@reduxjs/toolkit'
    
    export const fetchUsers = createAsyncThunk(
      'users/fetchUsers',
    
      async () => {
        const response = await fetch('/users')
    
        return response.json()
      }
    )
    ```
    
    ---
    
    # 구성 요소 설명
    
    ## 첫 번째 인자
    
    ```
    'users/fetchUsers'
    ```
    
    action type 이름
    
    자동 생성되는 action:
    
    ```
    users/fetchUsers/pending
    users/fetchUsers/fulfilled
    users/fetchUsers/rejected
    ```
    
    ---
    
    ## 두 번째 인자
    
    ```
    async () => {}
    ```
    
    실제 비동기 함수
    
    ---
    
    # 자동 생성되는 상태
    
    # pending
    
    요청 중
    
    ```
    loading 상태
    ```
    
    ---
    
    # fulfilled
    
    요청 성공
    
    ```
    성공 데이터 저장
    ```
    
    ---
    
    # rejected
    
    요청 실패
    
    ```
    에러 처리
    ```
    
    ---
    
    # extraReducers
    
    ## extraReducers란?
    
    비동기 action 처리용 reducer
    
    주로:
    
    - createAsyncThunk
    - 외부 action
    
    처리에 사용
    
    ---
    
    # 예시
    
    ```jsx
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsers.pending, (state) => {
          state.loading = true
        })
    
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.loading = false
          state.users = action.payload
        })
    
        .addCase(fetchUsers.rejected, (state) => {
          state.loading = false
          state.error = true
        })
    }
    ```
    
    ---
    
    # 전체 흐름
    
    ```
    dispatch(fetchUsers())
       ↓
    pending
       ↓
    API 요청
       ↓
    fulfilled 또는 rejected
    ```
    
    ---
    
    # 실무 패턴
    
    ```jsx
    const initialState = {
      data: [],
      loading: false,
      error: null,
    }
    ```
    
    loading / error 상태를 같이 관리하는 경우 많음
    
    ---
    
    # middleware
    
    ## middleware란?
    
    Redux action이 reducer로 가기 전에 실행되는 중간 처리 기능
    
    ---
    
    # Redux Toolkit 기본 middleware
    
    RTK는 자동으로:
    
    - thunk middleware
    - serializable check
    - immutable check
    
    등을 추가해줌
    
    ---
    
    # thunk middleware
    
    비동기 함수 dispatch 가능하게 해줌
    
    예:
    
    ```
    dispatch(asyncFunction())
    ```
    
    가능
    
    ---
    
    # custom middleware 추가
    
    ```jsx
    configureStore({
      reducer,
      
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
    })
    ```
    
    ---
    
    # Redux DevTools
    
    ## Redux DevTools란?
    
    Redux 상태 변화를 추적하는 개발 도구
    
    확인 가능:
    
    - action
    - 이전 state
    - 다음 state
    - payload
    
    ---
    
    # Redux Toolkit 장점
    
    RTK는 Redux DevTools 자동 연결
    
    별도 설정 필요 없음
    
    ---
    
    # 상태 정규화(normalization)
    
    ## 왜 필요한가?
    
    데이터 중복 방지
    
    예:
    
    ```
    posts: [
      {
        id:1,
        user: {
          id:1,
          name:'Tom'
        }
      }
    ]
    ```
    
    같은 user 데이터가 여러 곳에 중복 가능
    
    ---
    
    # 좋은 구조
    
    ```jsx
    users: {
      1: {
        id: 1,
        name: 'Tom'
      }
    }
    ```
    
    ---
    
    # createEntityAdapter
    
    ## createEntityAdapter란?
    
    정규화된 state 관리를 쉽게 해주는 RTK 기능
    
    ---
    
    # 기본 예시
    
    ```jsx
    import { createEntityAdapter } from '@reduxjs/toolkit'
    
    const usersAdapter = createEntityAdapter()
    ```
    
    ---
    
    # 생성되는 기능
    
    자동 제공:
    
    - addOne
    - addMany
    - removeOne
    - updateOne
    
    등
    
    ---
    
    # 예시
    
    ```jsx
    usersAdapter.addOne(state,user)
    ```
    
    ---
    
    # selector 자동 생성
    
    ```jsx
    const selectors = usersAdapter.getSelectors(
      (state) => state.users
    )
    ```
    
    ---
    
    # combineReducers
    
    RTK에서는 보통 직접 안 씀
    
    왜냐면:
    
    ```jsx
    configureStore({
      reducer: {
        auth: authReducer,
        todo: todoReducer,
      }
    })
    ```
    
    형태로 자동 처리됨
    
    ---
    
    # RTK Query
    
    ## RTK Query란?
    
    Redux Toolkit 공식 데이터 fetching 라이브러리
    
    서버 상태 관리 전용
    
    ---
    
    # 해결해주는 문제
    
    자동 처리:
    
    - 캐싱
    - loading 상태
    - 에러 상태
    - refetch
    - 중복 요청 방지
    
    ---
    
    # 기본 구조
    
    ```jsx
    import { createApi, fetchBaseQuery }
    from '@reduxjs/toolkit/query/react'
    
    export const api = createApi({
      reducerPath: 'api',
    
      baseQuery: fetchBaseQuery({
        baseUrl: '/api',
      }),
    
      endpoints: (builder) => ({
        getUsers: builder.query({
          query: () => '/users',
        }),
      }),
    })
    ```
    
    ---
    
    # 자동 생성 Hook
    
    ```jsx
    const { data, isLoading }
      = useGetUsersQuery()
    ```
    
    ---
    
    # RTK Query 장점
    
    ## 자동 캐싱
    
    같은 요청 중복 방지
    
    ---
    
    ## loading 자동 관리
    
    ```
    isLoading
    ```
    
    자동 제공
    
    ---
    
    ## 에러 자동 관리
    
    ```
    error
    ```
    
    자동 제공
    
    ---
    
    ## refetch 자동화
    
    focus 시 자동 재요청 가능
    
    ---
    
    # slice 분리 패턴
    
    실무에서는 기능별로 slice 분리
    
    ---
    
    # 예시 구조
    
    ```
    features/
     ├── auth/
     ├── todo/
     ├── user/
     └── post/
    ```
    
    ---
    
    # custom hooks 패턴
    
    ## 왜 사용하는가?
    
    Redux 코드 재사용 및 가독성 향상
    
    ---
    
    # 예시
    
    ```jsx
    export const useAppSelector = useSelector.withTypes()
    
    export const useAppDispatch = useDispatch.withTypes()
    ```
    
    ---
    
    # selector 분리 패턴
    
    ## 왜 사용하는가?
    
    재사용성과 유지보수 향상
    
    ---
    
    # 나쁜 예시
    
    ```
    useSelector((state) =>state.user.profile.name)
    ```
    
    여러 곳에서 반복
    
    ---
    
    # 좋은 예시
    
    ```jsx
    export const selectUserName = (state) =>
      state.user.profile.name
    ```
    
    사용:
    
    ```
    useSelector(selectUserName)
    ```
    
    ---
    
    # immer 특징
    
    RTK는 내부적으로 Immer 사용
    
    따라서:
    
    ```
    state.value+=1
    ```
    
    가능
    
    하지만 실제로는:
    
    - 직접 수정 아님
    - immutable 유지
    
    ---
    
    # Redux Toolkit 실무 흐름
    
    ```
    1. createSlice 생성
    2. configureStore 등록
    3. Provider 연결
    4. useSelector로 조회
    5. useDispatch로 변경
    6. createAsyncThunk로 비동기 처리
    7. RTK Query로 서버 상태 관리
    ```
    
    ---
    
    # Redux Toolkit 사용 시 장점
    
    | 기능 | 장점 |
    | --- | --- |
    | createSlice | reducer/action 자동 생성 |
    | configureStore | store 설정 간소화 |
    | Immer | 불변성 자동 처리 |
    | thunk 기본 포함 | 비동기 처리 쉬움 |
    | DevTools 자동 연결 | 디버깅 편리 |
    | RTK Query | 서버 상태 관리 자동화 |
    
    ---
    
    # 실무에서 가장 중요한 개념
    
    # 1. client state vs server state 구분
    
    ## client state
    
    UI 상태
    
    예:
    
    - 모달 열림 여부
    - 다크모드
    - 탭 상태
    
    Redux 사용 가능
    
    ---
    
    ## server state
    
    서버 데이터
    
    예:
    
    - 유저 목록
    - 게시글
    - 댓글
    
    RTK Query/TanStack Query 사용 권장
    
    ---
    
    # 2. Redux에 모든 걸 넣지 않기
    
    실무에서는:
    
    ```
    "정말 전역으로 필요한 상태만 Redux에 저장"
    ```
    
    하는 것이 중요
    
    ---
    
    # 3. slice를 너무 크게 만들지 않기
    
    좋은 예:
    
    ```
    authSlice
    userSlice
    todoSlice
    ```
    
    안 좋은 예:
    
    ```
    appSlice 하나에 전부 저장
    ```
    
    ---
    
    # 핵심 요약
    
    ## createAsyncThunk
    
    ```
    비동기 처리 함수
    ```
    
    ---
    
    ## extraReducers
    
    ```
    비동기 상태 처리 reducer
    ```
    
    ---
    
    ## RTK Query
    
    ```
    서버 상태 관리 자동화
    ```
    
    ---
    
    ## createEntityAdapter
    
    ```
    정규화된 데이터 관리 도구
    ```
    
    ---
    
    ## Redux Toolkit 핵심 목표
    
    ```
    Redux를 쉽고 안전하게 사용하게 만드는 것
    ```