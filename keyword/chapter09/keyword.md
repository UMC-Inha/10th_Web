# useReducer 학습 회고
#### 💡 이해한 점

- **상태 업데이트 로직의 분리**: `useState`는 컴포넌트 내부에서 상태를 직접 변경하지만, `useReducer`를 사용하면 상태 변경 로직(`reducer` 함수)을 컴포넌트 외부로 완전히 격리할 수 있어 코드가 훨씬 깔끔해진다는 점을 이해했다
- **Dispatch와 Action의 흐름**: 컴포넌트단에서는 `dispatch` 함수를 통해 어떻게 상태를 바꿀지 의도가 담긴 `action` 객체(타입과 데이터)를 주면 상태 가공은 `reducer`가 한다는 흐름을 이해했다
- **참조 무결성과 불변성**: 리액트는 주소값이 바뀌어야 리렌더링을 감지하므로, 상태를 반환할 때 원본을 직접 수정하지 않고 스프레드 연산자(`...state`)를 사용해  새로운 복사본을 만들어 반환해야 안전하다는 규칙을 이해했다

#### 어려운 점 (개선 방법)

- **어려운 점**: `useState`에 비해 구조상 작성해야 하는 코드(Interface, Reducer, Action Type 등)가 많아 초기 설정이 다소 복잡하게 느꼈다.
    - **개선 방법**: 단순한 형태의 카운터 실습(`UseReducerPage`)을 통해 `switch-case`문의 기본 흐름을 깨닫고 회사 관리 컴포넌트에 적용하며 이해해나갔다. 액션 객체에 데이터(`payload`)를 실어 나르는 정석 패턴을 실습하면서 복잡한 로직도 안전하게 제어할 수 있게 되었다.

#### 회고

- 단순히 상태 하나를 늘리고 줄이는 것을 넘어, 복잡한 비즈니스 규칙이 결합된 상태를 관리할 때 `useReducer`를 왜 사용하는지 알게 되었다. 상태 로직이 컴포넌트 뷰 영역과 완벽히 분리되니 유지보수성과 가독성이 올라간 것 같다.
- 규모가 큰 프로젝트를 진행할 때, 여러 개의 `useState`가 얽혀 서로 복잡하게 영향을 주거나 상태 업데이트 정책을 엄격하게 통제해야 하는 화면이 있다면 `useReducer` 구조를 우선적으로 도입하여 상태 관리를 할 것 같다.

---

# Redux Toolkit 사용법
- Provider
    - **전역 상태 공급망 구축**: 생성한 reduce store를 리액트 컴포넌트 트리 전체에 주입하는 역할이다.
    - 최상단 컴포넌트(`app.tsx` 또는 `main.tsx`)를 `<Provider store={store}>`로 감싸주면, 하위의 컴포넌트나 Prop Drilling 없이 전역 상태에 다이렉트로 접근 할 수 있다.
    - 내부 구현은 `React Context API`: `<Provider>`는 내부적으로 리액트의 기술인 `Context API`를 사용하여 구현되어 있다. 리덕스 스토어의 주소(인스턴스)를 Context의 `value`에 담아 하위 트리에 공유하는 방식이다.
    - **순수 Context API와의 결정적 차이 (성능 최적화)**:
        - 순수 Context API는 값이 조금만 바뀌어도 그 Context를 구독하는 하위 컴포넌트가 전부 리렌더링되는 성능 위험이 있다.
        - `<Provider>`는 상태 데이터 전체를 전달하는 게 아니라 Store의 주소값 하나만 고정으로 공유한다.
        - 데이터를 꺼내 쓰는 컴포넌트가 `useSelector` 훅을 사용해 선택한 특정 데이터가 바뀔 때만 정밀하게 격리 리렌더링되도록 해준다.

        - configureStore
    - **스토어 생성 자동화**: 기존 리덕스의 `createStore`를 한 단계 감싸서 한 번의 함수 호출만으로 완벽하게 세팅된 전역 저장소(`store`)를 만들어준다.
    - **설정의 단일화**: 여러 개의 Reducer들을 하나로 묶어주는 로직을 내부적으로 알아서 수행하므로 객체 형태로 슬라이스 리듀서들을 전달하기만 하면 된다.
    
    `configureStore`를 호출하는 순간 이 함수가 백그라운드에서 자동으로 셋업해 주는 3가지 핵심 기능이 있다
    
    **1️⃣ Redux DevTools 프로그램 자동 연동**
    
    - **기존의 리덕스** : 브라우저에서 리덕스 상태 변화를 시각적으로 추적하려면 `window.__REDUX_DEVTOOLS_EXTENSION__` 와 같은 긴 코드로 수동 연결 했어야 한다.
    - **configureStore** : 설정하지 않아도 Redux DevTools와 연결되므로 개발자 경험이 극대화 된다.
    
    **2️⃣ Middleware (`redux-thunk`)**
    
    - 리덕스는 동기적으로 작동하기에 백엔드 API 통신 같은 비동기 처리를 하려면 middleware가 필수적이다
    - `configureStore`는 자바스크립트 비동기 액션을 처리하는 표준 middleware인 `redux-thunk`를 기본값(default)으로 내장하여 제공하므로 middleware의 설치 과정을 생략할 수 있게 해준다
    
    **3️⃣ 상태 변경 가드 기능 자동 활성화**
    
    개발 환경 한정으로 미드웨어 가드가 자동으로 켜진다.
    
    - **불변성 검사 (Immutability Check)** : 리듀서 외부에 있는 컴포넌트단에서 전역 상태를 직접 수정(`mutation`)하려고 하면 콘솔에 에러를 띄워 버그를 예방한다.
    - **직렬화 가능 검사 (Serializable Check)** : 순수 자바스크립트 객체만 들어가야 한다. 함수나 클래스 인스턴스, Promise 등을 넣는다면 이 데이터는 리덕스에 넣으면 안 된다고 경고해 준다.

    - createSlice
    - **slice 단위 상태 관리** : 애플리케이션의 도메인(예: `auth`, `counter`, `todo` 등)별로 상태 구조를 모듈화하여 쪼개서 관리할 수 있게 해준다.
    - **액션과 리듀서의 통합 생성**: 슬라이스 이름(`name`), 초기 상태(`initialState`), 그리고 상태를 변경하는 함수들(`reducers`) 객체를 정의하면, 내부적으로 액션 타입(Action Type), 액션 생성자 함수(Action Creator), 리듀서(Reducer)를 한 번에 자동으로 빌드해준다.
    
    **1️⃣ Immer 라이브러리 내장**
    
    - `createSlice` 내부에는 불변성 관리 라이브러리인 `Immer`가 기본으로 내장 되어 있다
    - `…state`를 사용하지 않고 자바스크린트 내장 메서드인 `.push()`나 `state.value = 1`같은 직접 수정 (`Mutative`) 코드를 적어도 `Immer`가 알아서 안전하게 복사본 `Immutable` 구조로 변환해준다.
    - 코드가 직관적이고 짧아진다
    
    **2️⃣ 액션 생성자 (Action Creator) 자동화**
    
    - **기존 리덕스** : 액션을 작성하려면 `const INCREASE = 'COUNTER/INCREASE'`라고 타입을 적고 `const increase = () => ({ type: INCREASE })`라는 함수를 일일이 작성했다.
    - **createSlice**: `reducers` 객체 안에 `increase(state) { ... }`라고 함수 명만 적어두면, 외부에서 꺼내 쓸 수 있는 `counterSlice.actions.increase`라는 액션 생성자 함수가 백그라운드에서 자동으로 나온다. 개발자는 타입 명을 매핑할 필요가 사라진다
    - **예시 코드**
        
        ```tsx
        import { createSlice } from '@reduxjs/toolkit';
        
        const counterSlice = createSlice({
          name: 'counter',
          initialState: { counter: 0, error: null },
          reducers: {
            INCREASE: (state) => {
              state.counter += 1; 
            },
            DECREASE: (state) => {
              state.counter -= 1;
            },
            RESET_TO_ZERO: (state) => {
              state.counter = 0;
            }
          }
        });
        export const { INCREASE, DECREASE, RESET_TO_ZERO } = counterSlice.actions;
        export default counterSlice.reducer;
        ```

        - useSelector
    - **전역 상태 추출** : 리덕스 스토어에 저장된 거대한 전역 상태 객체(`state`) 중에서 현재 컴포넌트에 필요한 특정 데이터 조각만 선택(Select)해서 가져오는 역할을 한다.
    - **상태 구독(Subscription)**: 값을 꺼내오는 것에 그치지 않고 스토어를 자동으로 구독한다. 리덕스 스토어의 값이 바뀌면 `useSelector`가 이를 감지하여 컴포넌트에 최신 값을 동기화해준다.
    
    `useSelector` 내부에는 리액트의 성능을 최적화하기 위한 엄격한 비교 메커니즘이 내장되어 있다.
    
    **1️⃣ 염격한 값 비교**
    
    - 리덕스 스토어 내부의 많은 slice 중에 어떤 것이든 데이터가 변경되면 리덕스는 리렌더링을 할지 말지 검사하기 위해 `useSelector`들을 전부 실행해본다.
    - `useSelector`는 리턴한 값(`selector` 함수의 반환값)이 이전 렌더링 때랑 비교해서 주소나 값이 바뀌었는지를 검사한다.
    - 다른 슬라이스가 바뀌었더라도 꺼내 쓰고 있는 데이터가 그대로라면 `useSelector`가 리렌더링을 취소해준다
    
    **2️⃣ 객체 통째로 반환할 때의 문제점**
    
    ```tsx
    // 매번 새로운 객체 주소 {}가 생성됨
    const { name, email } = useSelector((state) => state.auth);
    ```
    
    - 참조(주소값) 비교를 한다. 예시 코드처럼 `state.auth` 객체 통째를 바라보거나 새로운 객체 형태로 반환하면 실제 내부 값(`name`, `email`)이 바뀌지 않았어도 리덕스는 주소가 바뀌었다고 착각하여 컴포넌트를 불필요하게 리렌더링시킨다.
    - **예시 코드**
        
        ```tsx
        // 원시 값 단위로 쪼개면 정확히 값이 바뀔 때만 리렌더링됨
        const name = useSelector((state) => state.auth.name);
        const email = useSelector((state) => state.auth.email);
        ```

        - useDispatch
    - **액션 전달자**: 리덕스 스토어의 `dispatch` 함수에 접근할 수 있게 해주는 훅이다
    - **상태 변경의 통로**: 리덕스에서 상태를 바꾸는 유일한 방법은 `store.dispatch(action)`를 호출하는 것뿐이다. 컴포넌트단에서는 `useDispatch`로 꺼내온 `dispatch` 함수에 `createSlice`가 만들어 준 액션 함수를 호출한다.
    
    **1️⃣ 고정된 참조 주소**
    
    - 리액트 컴포넌트는 상태가 바뀌면 함수 전체가 새로 실행되면서 내부의 함수들도 주소값(참조)이 새로 바뀐다.
    - 하지만 `useDispatch`가 반환하는 `dispatch` 함수는 절대로 주소값이 바뀌지 않는 고정값(Stable Reference)이다.
    - 즉, 컴포넌트가 수백 번 리렌더링되어도 `dispatch` 함수의 정체성은 그대로 유지되기에  `useEffect`나 `useCallback`의 의존성 배열(`deps`)에 넣어도 불필요한 요청을 유발하지 않는다
        
        ```tsx
        const dispatch = useDispatch();
        
        // dispatch는 절대 주소가 바뀌지 않으므로 useEffect는 최초 1회만 안전하게 실행됨
        useEffect(() => {
          dispatch(INITIALIZE_USER());
        }, [dispatch]);
        ```
        
    
    **2️⃣ 비동기 액션 (Thunk)와의 케미스트리**
    
    - `useDispatch`는  백엔드 API와 통신하는 비동기 액션 함수(`createAsyncThunk`)도 스토어로 밀어 넣어주는 엔진 역할을 수행한다.
    - 미들웨어가 중간에서 이 `dispatch`된 비동기 액션을 가로채서 처리한 뒤 성공/실패 여부에 따라  일반 액션으로 가공해 주는 역할을 해준다

    - 기타 **`Redux Toolkit`** 사용 방법을 상세하게 정리해 보세요
    - **`Lifecycle Actions`**
        
        비동기 요청을 생성하면 RTK는 내부적으로 프로미스(Promise)의 상태 생명주기에 맞춰 3가지 액션을 자동으로 만들어 낸다.
        
        1️⃣ **`pending`**: 비동기 요청이 막 시작된 상태 (화면에 로딩 스피너나 스켈레톤을 띄울 때 사용)
        
        2️⃣ **`fulfilled`**: 백엔드로부터 데이터를 성공적으로 받아온 상태 (상태에 결과값 반영)
        
        3️⃣ **`rejected`**: 통신 실패, 서버 에러 등이 발생한 상태 (화면에 에러 메시지 반영)
        
    - **`extraReducers`**
        
        `createAsyncThunk`로 만든 비동기 액션은 `createSlice` 내부의 `reducers`가 아니라 외부 액션을 받아 처리하는 **`extraReducers`** 구역에서 셋업한다.
        
        ```tsx
        export const fetchLps = createAsyncThunk('lps/fetchLps', async () => {
          const response = await axios.get('/api/lps');
          return response.data; 
        });
        
        const lpSlice = createSlice({
          name: 'lps',
          initialState: { data: [], loading: false, error: null },
          reducers: {},
          // 외부 비동기 흐름을 감시하는 extraReducers
          extraReducers: (builder) => {
            builder
              .addCase(fetchLps.pending, (state) => {
                state.loading = true; 
              })
              .addCase(fetchLps.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
              })
              .addCase(fetchLps.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // 에러 핸들링
              });
          },
        });
        ```
        
    
    - **`getDefaultMiddleware`**
        
        ```tsx
        const store = configureStore({
          reducer: rootReducer,
          middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
              serializableCheck: false,
            }).concat(loggerMiddleware),
        });
        ```

---
# Zustand
- **Zustand**란 무엇인가요? 🍠
    
    # **Zustand**란 무엇인가요?
    
    ---
    
    **1️⃣ Zustand 개요**
    
    Zusatnd란 작고(Small), 빠르면(Fast), 확장 가능한(Scalable) 불필요한게 없는 상태 관리 라이브러리이다.
    
    - 상태 관리 아키텍처(단방향 데이터 흐름 사상, Context API의 간결함)의 장점만 하이브리드로 추출했다.
    - 무거운 초기 세팅을 완전히 걷어내고 단순한 리액트 커스텀 훅 형태로 전역 상태를 제어하는 것을 지향한다.
    
    **2️⃣ 차별점**
    
    1. **Context APU 성능 문제 해결 (`No Providers`)**
        - **기존 문제** : 순수 `Context API`는 상태가 조그만 바뀌어도 Context를 구독하는 하위 트리의 모든 컴포넌트가 무조건 리렌더링 되는 성능 저하 위험이 있고 항상 최상단을 `<Provider>`로 감싸야 했다.
        - **해결** : 컴포넌트 트리를 굳이  `<Provider>`로 감쌀 필요가 없으며 상태가 변경되었을 때 상태를 정확히 선택한 특정 컴포넌트만 정밀 타격하여 리렌더링 시킨다.
    2. **`Less Boilerplate`**
        - **기존 문제** : 스토어를 생성하고 도메인별 슬라이스를 나누고 액션과 리듀서를 설계하여 병합하는 등 초기 코드량이 많다.
        - **해결** : 하나의 자바스크립트 함수(`create`) 안에서 초기 상태(state)와 상태를 변경하는 함수(Action)를 단일 객체로 동시에 정의하므로 코드가 직관적이고 얇아진다.
    3. **불변성 관리의 단순함**
        - 리액트는 불변성을 철처히 보호하되 사용자가 복잡한 데이터 구조를 복사하는 훅을 호출하는 형태만으로 상태를 가볍게 동기화할 수 있도록 설계되었다.
    
    **3️⃣ 예시 코드**
    
    ```tsx
    import { create } from 'zustand'
    
    // 전역 상태 저장소(Store) 생성
    // create 함수 안에서 상태와 액션(increasePopulation, removeAllBears)을 한 번에 정의
    const useBearStore = create((set) => ({
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    }))
    
    // 컴포넌트에서 사용하기
    function BearCounter(){
      // useSelector처럼 필요한 상태만 구독
      const bears = useBearStore((state) => state.bears)
      return <h1>{bears} around here...</h1>
    }
    
    function Controls(){
      // 상태를 변경하는 액션 함수도 다이렉트로 추출하여 실행 가능
      const increasePopulation = useBearStore((state) => state.increasePopulation)
      return <button onClick={increasePopulation}>one up</button>
    }
    ```
    
    **4️⃣ Provider 없이 전역 상태를 유지하는 방법은?**
    
    - **클로저(Closure)와 Pub/Sub 패턴**
        - Zustand의 store는 리액트 컴포넌트 내부가 아니라 리액트 메모리 스코프 외부에 전역 변수 객체 형태로 존재한다
        - create 함수를 실행하는 순간 자바스크립트의 클로저 메커니즘 덕분에 외부 변수인 상태 객체에 안전하게 접근할 수 있는 컴포넌트 생명주기와 무관하게 유지된다
        - 리액트 컴포넌트는 외부에 있는 자바스크립트 전역 객체를 구독(Subscribe)하고 있다가 값이 변경되면 내부적으로  `useSyncExternalStore`를 통해 컴포넌트에 직접 리렌더링 신호를 보내 동기화한다.
    
    **5️⃣ RTK vs Zustand 차이**
    
    | **비교 항목** | **Redux Toolkit (RTK)** | **Zustand** |
    | --- | --- | --- |
    | store 구조 | 하나의 거대한 **단일 스토어** (Single Store) | 필요에 따라 얼마든지 쪼개서 생성하는 **다중 스토어** |
    | **패키지 크기** | 무거움 (수많은 보일러플레이트 코드 및 의존성 패키지) | **초경량** (번들 사이즈가 단 몇 KB 수준으로 오버헤드 제로) |
    | **리액트 의존성** | 리액트 없이 단독 실행 불가능 (`react-redux` 결합 필수) | **리액트 독립적** (순수 바닐라 JS, Node.js 환경에서도 구동 가능) |

    **6️⃣ 특징**

    1. **리렌더링 없는 초고속 상태 변경**
        - 마우스 드래그 좌표 추적, 스크롤, 실시간 텍스트 입력처럼 1초에 여러번 바뀌는 상태를 리액트 전역 상태에 넣으면 FPS가 떨어지는 렌더링 지연이 발생한다.
        - Zustand는 컴포넌트를 리렌더링시키지 않고 값만 메모리 상에서 변경한 뒤, 필요한 순간에만 리스너를 통해 수동으로 UI를 업데이트 할 수 있는 비동기 시스템 (`subscribe`)을 지원하여 극한의 최적화를 가능하게 해준다.
    2. **플러그인 (Middleware) 조합**
        - **`persist`**: 전역 상태를 `localStorage`나 `sessionStorage`에 자동으로 동기화 및 직렬화하여 저장한다. 브라우저를 새로고침하거나 창을 껐다 켜도 데이터가 유지된다.
        - **`devtools`**: 개발자들의 크롬 Redux DevTools 확장 프로그램을 Zustand 스토어와 그대로 매핑시켜준다.

    