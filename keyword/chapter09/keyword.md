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

    ---
    - 왜 **Zustand**를 사용할까요? 🍠
    
    # 왜 Zustand를 사용할까요?
    
    ---
    
    **1️⃣ 생성성**
    
    - **기존**: RTK는 안전하지만 기능 하나를 만들려고 해도 `slice`정의, `Reducer` 작성, `Action`, `dispatch` 바인딩 등 여러군데 코드를 수정해야하는 번거로움이 있다.
    - **Zustand** : 자바스크립트 객체 하나에 모든 데이터와 액션을 때려 넣고 훅을 꺼내 쓰면 된다. 코드 작성량이 줄어들어 로직을 **빠르게 구현**할 수 있다.
    
    **2️⃣ 성능 최적화**
    
    - **기존** : `Context API`나 `Recoil`등에서 객체 통째로 상태를 가져왔다가 상관없는 값이 바뀔 때 컴포넌트가 같이 리렌더링되어 버벅거리는 현상이 있다.
    - **Zustand** : 설계부터 `useBearStore(state => state.bears)` 처럼 selector 패턴이 강제화되어 있다. 의도적으로 쪼개서 가져오기에 불필요한 리렌더링이 최소화되는 아키텍처를 유지할 수 있다.
    
    **3️⃣ 다중 스토어 지원**
    
    - **기존** : 전역에 하나의 거대한 스토어만 두는 것이 규칙이다. 이로 인해 상관없는 도메인도 하나의 스토어에 관리되어 복잡해졌다.
    - **Zustand** : 도메인이나 기능별로 독립된 전역 스토어를 쪼개서 만들 수 있다. 예를 들면 `useAuthStore`, `useThemeStore`, `useCartStore` 와 같이 분리할 수 있으므로 유지보수가 직관적이다.
    
    **4️⃣ 생태계의 트렌드 변화**
    
    - **기존** : Recoil은 몇 년째 업데이트가 끊겨 버그를 양산했고 많은 팀이 마이그레이션해야했다.
    - **Zustand** : 오픈소스 커뮤니티(Poimandres)의 전폭적인 지지를 받으며 메인스트림으로 안착했다.
    
    ### 💡요약
    
    > **Zustand를 선택하는 이유**
    > 
    > 1. Redux처럼 안전하고 명확한 **단방향 데이터 흐름**을 가지면서,
    > 2. Context API보다 코드가 간결하고 **Provider가 없으며**,
    > 3. Recoil보다 **가볍고 안정적인 생태계**를 제공하기 때문이다.

    ---
    
    # **Zustand** 기본 사용법
    
    ---
    
    ### 1) Store 만들기
    
    `create` 함수를 사용해 상태(State)와 상태를 변경하는 함수(Action)가 한 공간에 담긴 스토어를 만든다. 커스텀 훅처럼 사용할 수 있도록 이름 앞에 `use`를 붙여서 정의한다.
    
    ```tsx
    import { create } from 'zustand';
    
    // 스토어의 데이터와 함수 구조를 정의하는 인터페이스
    interface ICounterState {
      counter: number;
      error: string | null;
      increase: () => void;
      decrease: () => void;
      resetToZero: () => void;
    }
    
    // create 함수를 이용해 전역 상태 저장소 생성
    // set 함수는 상태를 업데이트하고 내부적으로 Immer처럼 불변성을 유지해준다
    const useCounterStore = create<ICounterState>((set) => ({
      // 상태(State) 초기값 설정
      counter: 0,
      error: null,
    
      // 상태를 변경하는 액션(Action) 정의
      increase: () => 
        set((state) => ({ 
          counter: state.counter + 1,
          error: null // 증가할 때는 에러 초기화
        })),
    
      decrease: () => 
        set((state) => {
          if (state.counter <= 0) {
            return { error: '0 미만으로는 감소할 수 없습니다.' };
          }
          return { counter: state.counter - 1, error: null };
        }),
    
      resetToZero: () => set({ counter: 0, error: null }),
    }));
    
    export default useCounterStore;
    ```
    
    ### 2) 컴포넌트에서 사용하기
    
    컴포넌트단에서는 최상단에 별도의 `<Provider>`를 감쌀 필요 없이 `useCounterStore` 훅을 임포트해서 필요한 상태나 액션을 꺼내 쓰면된다.
    
    ```tsx
    import useCounterStore from '../stores/useCounterStore';
    
    export default function ZustandPage() {
      // Selector 패턴을 사용하여 필요한 상태(State)만 조각내어 구독
      // 쪼개서 가져와야 다른 상태가 바뀔 때 불필요한 리렌더링이 발생하지 않음
      const counter = useCounterStore((state) => state.counter);
      const error = useCounterStore((state) => state.error);
    
      // 상태를 변경할 액션(Action) 함수들을 가져옴
      const { increase, decrease, resetToZero } = useCounterStore();
    
      return (
        <div className="flex flex-col items-center justify-center p-10 gap-6">
          <h2 className="text-3xl font-bold text-zinc-800">Zustand 실습 공간</h2>
          
          {/* 상태 출력 구역 */}
          <div className="p-6 bg-zinc-100 rounded-xl text-center w-[300px]">
            <p className="text-sm text-zinc-500 font-medium">현재 카운트</p>
            <h3 className="text-5xl font-black text-pink-600 mt-2">{counter}</h3>
          </div>
    
          {/* 에러 메시지 조건부 렌더링 */}
          {error && <p className="text-red-500 font-semibold text-sm animate-bounce">{error}</p>}
    
          {/* 버튼 액션 구역 */}
          <div className="flex gap-4">
            <button 
              onClick={increase}
              className="px-6 py-2 bg-zinc-900 text-white font-semibold rounded-md hover:bg-zinc-800 transition-colors"
            >
              증가
            </button>
            <button 
              onClick={decrease}
              className="px-6 py-2 bg-zinc-400 text-white font-semibold rounded-md hover:bg-zinc-500 transition-colors"
            >
              감소
            </button>
            <button 
              onClick={resetToZero}
              className="px-6 py-2 border border-zinc-300 text-zinc-600 font-semibold rounded-md hover:bg-zinc-50 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      );
    }
    ```
    
    #### **💡요약**
    
    > 
    > 
    > 1. **Store 정의** : `create((set) => ({ ... }))` 구조 안에서 전역 데이터와 수정 함수를 단일 객체로 동시 관리함
    > 2.  **컴포넌트 구독**: 별도의 Provider 없이 스토어 훅을 다이렉트로 임포트하여 사용함
    > 3.  **최적화**: `useCounterStore(state => state.counter)` 처럼 익명 함수 셀렉터로 상태를 개별 추출하여 불필요한 컴포넌트 리렌더링을 차단함
    ---

    - **Zustand**에서 중요한 개념 🍠
    
    # **Zustand**에서 중요한 개념
    
    ---
    
    ### 1) set 함수
    
    스토어 내부에서 상태(State)를 변경할 때 사용하는 안전한 통로이다.
    
    - **병합(Merge) 메커니즘**: `set` 함수는 기존 스토어 객체 전체를 새로 복사할 필요 없이 변경하고자 하는 상태 조각만 주면 기존 스토어와 Shallow Merge 수행한다
    - **불변성 관리 자동화**: `useState` 처럼 이전 상태를 기반으로 계산이 필요할 때는 함수형 업데이트(`set((state) => ({ ... }))`)를 지원한다
    
    ```tsx
    const useStore = create((set) => ({
      bears: 0,
      fish: 10,
      
      // 기존 fish: 10은 안전하게 유지되고 bears만 바뀜
      clearBears: () => set({ bears: 0 }), 
    
      // 이전 상태(state)가 필요할 때는 함수형 업데이트를 사용
      increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
    }));
    ```
    
    ### 2) get 함수
    
    `get` 함수는 `set` 함수 외부나 비동기 액션(Action) 함수 내부에서 현재 스토어의 최신 상태값을 실시간으로 읽어와야 할 때 사용한다.
    
    - **상태 스냅샷(Snapshot)**: `get()`을 호출하는 순간의 스토어 상태 전체를 객체 형태로 반환
    - **리렌더링 방지**: 메모리에 있는 값을 조회만 하므로 `get()`을 실행한다고 해서 컴포넌트가 불필요하게 리렌더링되지 않는다. 주로 복잡한 조건문 검사나 비동기 API 연동 시 활용된다.
    
    ```tsx
    const useStore = create((set, get) => ({
      maxLimit: 100,
      counter: 0,
      
      actionWithGet: () => {
        // get()을 통해 스토어에 쌓인 최신 maxLimit과 counter 값을 실시간 조회
        const currentCount = get().counter;
        const limit = get().maxLimit;
    
        if (currentCount < limit) {
          set({ counter: currentCount + 1 });
        }
      }
    }));
    ```
    
    ### 3) 선택적 구독 (selector)
    
    - **동작 원리**: 컴포넌트에서 스토어 훅을 호출할 때 `useCounterStore((state) => state.counter)` 처럼 익명 함수 형태로 필요한 상태 조각(Slice)만 정의하는 패턴을 의미
    - **왜 중요할까?**
        - 만약 스토어에 `counter` 상태와 `userInfo` 상태가 같이 들어있을 때, 셀렉터 없이 `const store = useCounterStore()` 처럼 통째로 가져오면 `userInfo`가 바뀔 때 아무 상관없는 카운터 컴포넌트까지 리렌더링된다
        - 하지만 셀렉터 패턴으로 쪼개서 가져오면, Zustand는 내부적으로 엄격한 값 비교(Strict Equality)를 수행하여 `counter` 값이 바뀔 때만 해당 컴포넌트를 정확히 리렌더링시킨다.
    
    ```tsx
    // ❌어떤 값이라도 바뀌면 해당 컴포넌트는 무조건 리렌더링함
    const state = useCounterStore(); 
    
    // 오직 counter 값이 변할 때만 이 컴포넌트가 리렌더링됨
    const counter = useCounterStore((state) => state.counter);
    const error = useCounterStore((state) => state.error);
    ```

    - **Zustand** 객체 상태 관리 예시 🍠
    
    # **Zustand** 객체 상태 관리 예시
    
    ---
    
    Zustand의 `set` 함수는 스토어의 최상위 레벨 데이터는 자동으로 병합해 주지만, 상태 내부에 있는 중첩된 객체(Nested Object)까지 자동으로 병합해 주지는 않는다.
    
    따라서 객체 상태를 업데이트할 때는 반드시 자바스크립트의 스프레드 연산자(`...`)를 사용해 기존 객체의 사본을 만들거나 `Immer` 미들웨어를 도입해야 안전하게 불변성을 지킬 수 있다.
    
    #### 1️⃣ 스프레드 연산자(`...`) 사용하기
    
    자바스크립트 내장 문법을 활용해 객체 내부의 특정 필드만 변경하는 구조이다.
    
    ```tsx
    import { create } from 'zustand';
    
    // 상태 구조 정의
    interface IUserProfile {
      nickname: string;
      age: number;
      location: string;
    }
    
    interface IUserState {
      user: IUserProfile;
      updateLocation: (newLocation: string) => void;
      incrementAge: () => void;
    }
    
    // 스토어 생성
    const useUserStore = create<IUserState>((set) => ({
      user: {
        nickname: '동동',
        age: 23,
        location: '인천',
      },
    
      // set({ user: { location: newLocation } }) 
      // ❌ 이렇게 짜면 nickname과 age 데이터가 싹 날아가고 location만 남음
    
      // 깊은 객체까지 스프레드 연산자(...state.user)로 덮어씌워 주기
      updateLocation: (newLocation) =>
        set((state) => ({
          user: {
            ...state.user, // 기존 user 객체의 nickname, age 복사본 유지
            location: newLocation, // location만 최신 값으로 업데이트
          },
        })),
    
      incrementAge: () =>
        set((state) => ({
          user: {
            ...state.user,
            age: state.user.age + 1,
          },
        })),
    }));
    
    export default useUserStore;
    ```
    
    #### 2️⃣ `Immer` 미들웨어 내장하기
    
    객체 구조가 깊어지면 스프레드 연산자(`...`)를 체이닝해야 해서 코드가 지저분해진다. 내부에 **`immer`** 미들웨어를 사용하면 사본 형태를 직접 안 만들고 원본을 직접 변경하듯이 코드를 짜도 불변성이 유지된다
    
    ```tsx
    import { create } from 'zustand';
    import { immer } from 'zustand/middleware/immer';
    
    interface IUserState {
      user: {
        nickname: string;
        metadata: {
          age: number;
          hobby: string;
        }
      };
      updateHobby: (newHobby: string) => void;
    }
    
    // create 함수를 immer로 감싸줌
    const useImmerUserStore = create<IUserState>()(
      immer((set) => ({
        user: {
          nickname: '동동',
          metadata: {
            age: 23,
            hobby: '음악 듣기',
          }
        },
    
        updateHobby: (newHobby) =>
          set((state) => {
            state.user.metadata.hobby = newHobby; 
          }),
      }))
    );
    
    export default useImmerUserStore;
    ```
    
    #### 3️⃣ 컴포넌트에서 객체 상태 정밀 구독하기
    
    Selector를 객체 상태에서 어떻게 적용하는지 보여주는 예시 코드이다
    
    ```tsx
    import useUserStore from '../stores/useUserStore';
    
    export default function UserProfile() {
      // ❌ const user = useUserStore((state) => state.user);
    
      // 필요한 '원시 값' 단위로 쪼개서
      const name = useUserStore((state) => state.user.name);
      const location = useUserStore((state) => state.user.location);
      
      // 액션 함수
      const updateLocation = useUserStore((state) => state.updateLocation);
    
      return (
        <div className="p-4 border rounded-lg shadow-sm">
          <h3>개발자: {name}</h3>
          <p>현재 거주지: {location}</p>
          
          <button 
            onClick={() => updateLocation('인하대학교')}
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md text-sm"
          >
            위치 변경
          </button>
        </div>
      );
    }
    ```

    ---
    - **Zustand** 비동기 로직 예시 🍠
    
    # **Zustand** 비동기 로직 예시
    
    ---
    
    **Zustand**에서는 비동기 API 호출도 간단하게 store 안에서 사용할 수 있어요.
    
    #### 1️⃣ 스토어 내부에서 비동기 액션 구현하기
    
    백엔드 API와 통신할 때는 **1) 로딩 스피너용 상태, 2) 실제 데이터 상태, 3) 에러 핸들링** 상태를 3종 세트로 묶어서 관리한다.
    
    ```tsx
    import { create } from 'zustand';
    import axios from 'axios';
    
    interface ILpItem {
      id: number;
      title: string;
      artist: string;
    }
    
    interface ILpState {
      lps: ILpItem[];
      isLoading: boolean;
      error: string | null;
      fetchLps: (keyword?: string) => Promise<void>; // 비동기 함수 타입 정의
    }
    
    // 비동기 스토어 생성
    const useLpStore = create<ILpState>((set, get) => ({
      lps: [],
      isLoading: false,
      error: null,
    
      // async/await를 사용하여 일반 함수처럼 작성
      fetchLps: async (keyword = '') => {
        // 요청 시작 시점에 로딩을 켜고 에러 초기화
        set({ isLoading: true, error: null });
    
        try {
          const response = await axios.get(`/api/lps?search=${keyword}`);
          
          // 성공 시 데이터를 스토어에 저장 로딩 off
          set({ lps: response.data, isLoading: false });
        } catch (err: any) {
          // 실패 시 에러 메시지 저장 로딩 off
          set({ 
            error: err.message || 'LP 목록을 가져오는 데 실패했습니다.', 
            isLoading: false 
          });
        }
      },
    }));
    
    export default useLpStore;
    ```
    
    #### 2️⃣ 컴포넌트에서 비동기 액션 트리거
    
    `useEffect` 안에서 비동기 훅을 호출, 상태 조각(`isLoading`, `error`, `lps`)에 따라 화면을 나눠서 처리한다.
    
    ```tsx
    import { useEffect } from 'react';
    import useLpStore from '../stores/useLpStore';
    import { CardSkeletonGrid } from '../components/Skeleton';
    
    export default function LpListPage() {
      // 필요한 상태와 비동기 함수들 Selector
      const lps = useLpStore((state) => state.lps);
      const isLoading = useLpStore((state) => state.isLoading);
      const error = useLpStore((state) => state.error);
      const fetchLps = useLpStore((state) => state.fetchLps);
    
      useEffect(() => {
        fetchLps();
      }, [fetchLps]);
    
      // 상태(State)에 따른 정밀한 UI 분기
      if (isLoading) return <CardSkeletonGrid count={12} />;
      if (error) return <p className="text-red-500 text-center py-20">{error}</p>;
    
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">LP 아카이브</h1>
          
          {lps.length === 0 ? (
            <p className="text-zinc-500">등록된 LP가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {lps.map((lp) => (
                <div key={lp.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <h3 className="font-bold text-white">{lp.title}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{lp.artist}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    ```
    
    #### 💡 요약
    
    > 
    > 
    > 1. **단순성**: 별도의 미들웨어나  패키지 없이 스토어 내부 리듀서에 직접 **`async/await`** 로직을 구현할 수 있음
    > 2. **가독성**: 단일 함수 내부에서 로딩 시작(set) → 비동기 데이터 통신(await) → 로딩 종료 및 데이터 반영(set) 흐름을 일괄 제어하여 가독성 극대화
    > 3. **결합력**: 통신 실패 시 catch 블록에서 스토어의 에러 상태를 즉각 업데이트할 수 있어 컴포넌트단에서의 예외 처리가 직관적임

    - **Zustand** + Persist 미들웨어 🍠
    
    # **Zustand** + Persist 미들웨어
    
    ---
    
    **Zustand**는 미들웨어를 활용해 로컬스토리지 등에 상태를 저장할 수 있어요.
    
    `persist` 미들웨어는 스토어의 전역 상태를 브라우저의 저장소(`localStorage` 또는 `sessionStorage`)에 자동으로 동기화 및 직렬화하여 저장해 주는 기능이다.
    
    사용자가 페이지를 새로고침하거나 브라우저 창을 껐다 켜도 전역 상태 데이터가 초기화되지 않고 영구히 유지된다
    
    #### 1️⃣ Persist 미들웨어
    
    `create` 함수 안에서 정의하는 초기 객체 전체를 `persist()` 함수로 한 단계 감싸주면 된다.
    
    ```tsx
    import { create } from 'zustand';
    import { persist, createJSONStorage } from 'zustand/middleware'; // persist 미들웨어 임포트
    
    interface IThemeState {
      isDarkMode: boolean;
      toggleTheme: () => void;
    }
    
    // Persist 미들웨어가 결합된 스토어 생성
    const useThemeStore = create<IThemeState>()(
      persist(
        (set) => ({
          isDarkMode: false,
          toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
        }),
        {
          name: 'theme-storage', // 로컬스토리지에 저장될 Key 이름
          storage: createJSONStorage(() => localStorage), // 기본값은 localStorage
        }
      )
    );
    
    export default useThemeStore;
    ```
    
    #### 2️⃣ Hydration(하이드레이션) 버그와 SSR 방어법
    
    Zustand Persist를 쓸 때 서버가 넘겨준 UI 구조와 브라우저 로컬스토리지를 읽어서 만든 UI 구조가 달라 화면이 갈라지는 에러(Hydration Mismatch)를 마주할 수 있다.
    
    이를 방지하기 위해 컴포넌트단에서 완전히 로컬스토리지를 다 읽어왔는지 체크해 주는 방어막 코드 패턴이다
    
    ```tsx
    import { useEffect, useState } from 'react';
    import useThemeStore from '../stores/useThemeStore';
    
    export default function ThemeToggle() {
      const isDarkMode = useThemeStore((state) => state.isDarkMode);
      const toggleTheme = useThemeStore((state) => state.toggleTheme);
    
      // SSR 및 초기 하이드레이션 불일치 버그 방어막 세팅
      const [isHydrated, setIsHydrated] = useState(false);
      useEffect(() => {
        setIsHydrated(true); // 컴포넌트가 마운트된 시점에만 UI를 그리도록 제어
      }, []);
    
      if (!isHydrated) return <div className="w-10 h-10 bg-zinc-200 animate-pulse rounded-full" />;
    
      return (
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-md font-bold ${
            isDarkMode ? 'bg-zinc-800 text-yellow-400' : 'bg-zinc-100 text-zinc-800'
          }`}
        >
          {isDarkMode ? '🌙 다크모드 활성화' : '☀️ 라이트모드 활성화'}
        </button>
      );
    }
    ```
    
    #### 3️⃣ 원하는 상태 조각만 골라서 저장하기 (`partialize`)
    
    스토어 내부의 모든 값을 다 로컬스토리지에 넣으면 보안상 위험하거나(비밀번호 등) 용량 낭비가 생길 수 있다. `partialize` 옵션을 쓰면 원하는 상태 조각만  스토리지에 저장할 수 있다.
    
    ```tsx
    {
          name: 'user-storage',
          // 'token'과 'role' 상태만 로컬스토리지에 저장
          partialize: (state) => ({ 
            token: state.token, 
            role: state.role 
          }), 
        }
    ```

    - **Zustand** + Immer 함께 쓰기 🍠
    
    # **Zustand** + Immer 함께 쓰기
    
    ---
    
    불변성 관리를 쉽게 하고 싶다면 Immer 미들웨어도 사용 가능해요.
    
    얕은 병합(Shallow Merge)만 지원하기에 중첩된 객체나 배열 상태를 변경하려면 매번 스프레드 연산자(`...`)를 겹겹이 써야 해서 코드가 복잡해진다. 이때 `immer` 미들웨어를 도입하면 불변성 관리(사본 생성 구조)를 내부적으로 자동화하여 마치 원본 객체의 값을 직접 수정하는 직관적인 문법(Mutative Code)으로 코드를 작성할 수 있다
    
    #### 1️⃣ Immer 미들웨어로 스토어 감싸기
    
    `create` 함수 뒤에 타입 규격을 명시하고, 초기화 콜백 함수 전체를 `immer()` 미들웨어로 감싸서 선언합니다.
    
    ```tsx
    // src/stores/useTodoStore.ts
    import { create } from 'zustand';
    import { immer } from 'zustand/middleware/immer';
    
    // 1. 중첩 구조를 가진 할 일(Todo) 데이터 타입 정의
    interface ITodoItem {
      id: number;
      text: string;
      isCompleted: boolean;
    }
    
    interface ITodoState {
      todos: ITodoItem[];
      addTodo: (text: string) => void;
      toggleTodo: (id: number) => void;
    }
    
    const useTodoStore = create<ITodoState>()(
      immer((set) => ({
        todos: [
          { id: 1, text: 'UMC 9주차 워크북 작성하기', isCompleted: false },
          { id: 2, text: 'Zustand 실습 파일 세팅하기', isCompleted: false },
        ],
    
        // 기존의 방식
        //addTodo: (text) => set((state) => ({ todos: [...state.todos, { id: Date.now(), text, isCompleted: false }] }))
        
        // Immer 방식
        // 복사본 생성 없이 내장 배열 메서드(.push)를 사용가능
        addTodo: (text) =>
          set((state) => {
            state.todos.push({
              id: Date.now(),
              text,
              isCompleted: false,
            });
          }),
    
        // 깊은 곳에 있는 특정 객체의 값 변경도 한 줄로 수정 가능
        toggleTodo: (id) =>
          set((state) => {
            const todo = state.todos.find((item) => item.id === id);
            if (todo) {
              todo.isCompleted = !todo.isCompleted;
            }
          }),
      }))
    );
    
    export default useTodoStore;
    ```
    
    #### 2️⃣ 코드 비교
    
    객체의 Depth가 깊어질 때 코드가 깔끔해지는지 보여주는 예시이다
    
    - 기존 Zustand 문법
    
    ```tsx
    set((state) => ({
      user: {
        ...state.user,
        profile: {
          ...state.user.profile,
          hobby: newHobby
        }
      }
    }));
    ```
    
    - **Immer 문법**
    
    ```tsx
    set((state) => {
      state.user.profile.hobby = newHobby;
    });
    ```
    
    #### 💡 요약
    
    > 
    > 
    > 1. **역할** : 복잡하고 깊은 중첩 구조를 가진 객체/배열 상태 변경 시 스프레드 연산자 `...state` 연쇄 사용으로 인한 지저분함 해결
    > 2. **장점** : `.push()` 나 직접 대입 등 기본 객체 수정 문법을 사용해도 백그라운드에서 불변성(Immutable 사본) 구조로 자동 가공해 줌
    > 3. **생산성** : 코드 가독성이 극대화되어 복잡한 도메인(예: 다중 필터링, 장바구니, 데이터 트리 구조)의 로직을 에러 없이 작성할 수 있음

    - **Zustand** vs Context API 🍠
    
    # **Zustand** vs Context API
    
    ---
    
    Props Drilling 문제를 해결하고 상태를 공유한다는 공통점이 있지만 내부 작동 원리, 성능 최적화 구조, 그리고 설계 목적에서 다른 메커니즘을 가지고 있다.
    
    #### **1️⃣ 차이점**
    
    | **비교** | **Context API (리액트)** | **Zustand (외부 전역 상태 라이브러리)** |
    | --- | --- | --- |
    | **Provider 필수 여부** | 필수 (`<Context.Provider>`로 감싸야 함) | 불필요 (어디서나 공급망 없이 훅으로 바로 호출) |
    | **렌더링** | 취약함 (값 변경 시 구독 중인 하위 트리 전체 리렌더링) | 매우 강력함 (선택한 특정 상태 변동 시에만 격리 리렌더링) |
    | **상태 관리 도구 여부** | 상태 관리가 아닌 공유에 불가함 | 상태 생성, 가공, 변경 로직을 모두 갖춘 '상태 관리 도구' |
    | **외부 접근** | 오직 컴포넌트 내부(내장 훅 영역)에서만 사용 가능 | 리액트 외부(.ts 파일 등)에서도 다이렉트 접근 가능 |
    | **미들웨어 확장성** | 불가능 | **강력함** (`persist`, `devtools`, `immer` 등 내장)
    2️⃣ |
    
    #### 2️⃣ 핵심 차이점 3가지
    
    1. **전달 도구(Context) vs 상태 관리 도구(Zustand)**
    - **Context API**: 상태를 직접 관리하는 도구가 아니다. `useState`나 `useReducer`로 만든 상태를 하위 컴포넌트들에게 공유하는 역할만 수행한다.
    - **Zustand**: 상태 초기값 정의, 동기/비동기 액션 함수 생성, 상태 업데이트(`set`), 불변성 유지까지 상태 관리에 필요한 로직을 스스로 수행할 수 있는 독립된 관리자이다
    
    ---
    
    1. **리렌더링의 차이**
    - **Context API**: Context가 들고 있는 객체 내부의 값 중 하나만 바뀌어도, 해당 Context를 구독하고 있는(`useContext`) 하위 컴포넌트들이 변경 사항과 상관없더라도 리렌더링된다. 이를 막으려면 Context를 여러개로 쪼개거나 `useMemo`로 수동 최적화를 해야한다.
    - **Zustand**: Pub/Sub 패턴과 셀렉터 기법을 사용하여 스토어의 다른 데이터가 변해도 ****훅으로 구독한 그 값이 바뀌지 않았다면 컴포넌트 리렌더링을 하지 않는다.
    
    ---
    
    1. **리액트 컴포넌트 생명주기로부터 독립성**
    - **Context API**: 리액트 내장 기능이기에 리액트 컴포넌트 트리 내부에 존재해야 하고 `useContext` 역시 리액트 컴포넌트 내부에서만 정상 작동한다.
    - **Zustand**: 스토어 데이터가 리액트 외부(자바스크립트 메모리 환경)에 독립적이다. 리액트 컴포넌트 영역이 아닌 순수 자바스크립트 파일에서도 최신 전역 상태를 자유롭게 읽고 변경할 수 있다.

---
# react 전역 상태 관리 블로그 읽고 개념 정리
- **`Context API`**의 **`value 전체 구독 메커니즘`**과 **`Zustand`**의 **`selector 기반 구독`**의 성능 차이를 설명해보세요.
    
    **1️⃣ `Context API` : Value 전체 구독 메커니즘**
    
    - **동작 방식**: `Context API`는 상태를 공유할 때 하나의 객체(`value={{ state1, state2 }}`) 형태로 하위 트리에 전달
    - **문제점** : `Context API`는 내부적으로 객체 참조(Reference) 비교를 수행한다. 이로 인해 객체 내부의 `state1`만 변경되더라도 Context를 감싸고 있는 전체 객체의 주소값이 새로 생성되면서 해당 Context를 구독(`useContext`)하고 있는 모든 하위 컴포넌트가 자신과 상관없는 변화임에도 불구하고 강제로 동시 리렌더링하게 된다
    - **해결**: 개발자가 직접 Context를 잘게 쪼개거나(`Multi-Context`) 하위 컴포넌트들을 `React.memo`로 감싸 수동 최적화를 해야 한다 → 최적화, 가독성이 떨어짐
    
    **2️⃣ `Zustand` : Selector 기반 구독 메커니즘**
    
    - **동작 방식**: Zustand는 컴포넌트에서 스토어를 호출할 때 `useStore(state => state.state1)`과 같이 익명 함수를 통해 ****화면을 그리는 데 필요한 특정 데이터 조각(Slice)만 구독하도록 유도한다.
    - **성능:**  Zustand는 내부적으로 발행-구독(Pub/Sub) 패턴 기반의 엄격한 값 비교(Strict Equality)를 수행한다.
        - 스토어 내부의 다른 데이터(`state2`)가 변하더라도 Selector로 가져온 데이터(`state1`)의 실제 값이 바뀌지 않았다면 컴포넌트 리렌더링을 하지 않는다.

    - **`Jotai`**의 **`atom`** 조합 방식이 파생 상태 관리에서 Zustand 대비 갖는 장점을 의존성 추적 관점에서 설명해보세요.
    - **파생 상태(Derived State) :** 기존의 원본 상태들을 조합하여 새롭게 계산해 낸 상태(예: `원가`와 `세율`을 조합한 `총액`)를 의미한다.
        - **파생 상태**를 다룰 때 `Jotai`는 Zustand 대비 선언적이고 자동화된 의존성 추적이라는 구조적 장점이 있다.
    
    **1️⃣ Zustand이 수동적 Selector 연산**
    
    • **작동 방식**: 거대 스토어 구조이기에 파생 상태를 만들려면 컴포넌트단이나 외부에서 `useStore(state => state.a + state.b)`와 같은 수동 Selector 연산을 수행하거나 `createSelector` 미들웨어를 붙여 가공해야 한다.
    • **의존성 관리의 한계**: 상태들의 관계가 복잡해져서 파생 상태가 또 다른 파생 상태를 참조하는 구조(상태 체이닝)가 되면 Selector 내부 코드를 개발자가 일일이 수정하고 의존 관계를 수동으로 추적해야 하므로 복잡한 데이터 그래프를 표현하기 어렵다.
    
    **2️⃣`Jotai`**
    
    - **장점 :** Bottom-up 선언과 자동 의존성 추적
    - **작동 방식 (자동 의존성 맵핑)**: 아주 작은 상태 단위인 `atom`들을 상호 조립하여 거대한 전역 상태를 빌드해 나가는 바텀업 아키텍처이다.
        - 파생 아톰을 만들 때 내부에서 `get()` 함수를 사용해 다른 아톰을 호출하면 `Jotai`엔 진이 백그라운드에서 아톰 간의 의존성 그래프(Dependency Graph)를 자동으로 추적하고 형성한다
        
        ```tsx
        // Jotai의 파생 아톰 예시
        const priceAtom = atom(100);
        const taxAtom = atom(10);
        
        // get()을 호출하는 순간 아톰은 priceAtom과 taxAtom에 의존하고 있음을 Jotai가 "자동으로 추적"함
        const totalAtom = atom((get) => get(priceAtom) + get(taxAtom));
        ```
        
    
    3️⃣ **의존성 추적 관점에서 장점**
    
    - **자동 메모이제이션 & 업데이트**: 개발자가 별도의 최적화 설정을 하지 않아도 의존하고 있는 원본 아톰(`priceAtom`)이 변경되는 순간 이를 감지하여 파생 아톰(`totalAtom`)의 값이 자동으로 재계산되고 갱신된다. 반대로 원본 값이 바뀌지 않았다면 이전 캐싱값을 그대로 유지한다.
    - **불필요한 리렌더링의 차단** : 컴포넌트가 `totalAtom`만 구독하고 있다면 원본 아톰들이 변해도 최종 연산 결과값인 `total`이 변경되지 않는 한 컴포넌트는 리렌더링되지 않는다
    - **유지보수성 극대화**: 상태 간의 관계가 겹겹이 엮여 있어도 연쇄적으로 안전하게 동기화되므로 수동으로 최적화 코드를 작성하지 않아도 된다.

    - 서버 상태를 **`useEffect`**로 관리할 때 발생하는 캐싱/중복 요청/불일치 문제를 설명해보세요.
    
    전역 상태 라이브러리나 서버 상태 관리 툴 없이, 컴포넌트 내부에서 `useState`와 `useEffect`만을 활용해 백엔드 API 데이터를 fetch할 때 발생하는 문제이다
    
    **1️⃣ 캐싱(Caching)의 부재 (네트워크 자원 낭비)**
    
    - **문제점**: `useEffect` 내부에서 데이터를 패칭하면 그 데이터는 오직 해당 컴포넌트의 로컬 `useState` 메모리에만 머무른다
    - **결과**: 사용자가 다른 페이지로 이동했다가 다시 돌아와서 컴포넌트가 언마운트 후 재마운트되면 기존에 받았던 데이터가 메모리에서 사라진다. 이로 인해 동일한 데이터임에도 불구하고 화면을 켤 때마다 백엔드 서버에 매번 새로운 API 요청을해야하므로 ****불필요한 네트워크 자원 낭비와 사용자 경험(UX) 저하(로딩 스피너의 무한 반복)를 유발한다.
    
    **2️⃣ 중복 요청 제어 불가능 (네트워크 병목)**
    
    - **문제점**:  한 화면 내에서 여러 개의 독립된 컴포넌트들이 동일한 서버 데이터(예: `현재 로그인한 유저 정보`)를 필요로 할 때가 있다
    - **결과**: 각 컴포넌트가 독립된 `useEffect`를 실행하기 때문에 화면이 켜지는 순간 동일한 API 요청이 동시에 여러번 서버로 날아가는 중복 요청이 발생한다.
    
    **3️⃣ 데이터 불일치/동기화 문제**
    
    - **문제점**: 다른 사용자가 서버의 데이터를 수정하거나 백엔드 DB가 변경되어도 클라이언트 컴포넌트의 데이터는 새로고침을 수동으로 누르지 않는 한 과거 데이터에 멈춰있게 된다
    - **결과**: 클라이언트 화면에 보이는 데이터와 실제 서버 DB의 데이터가 일치하지 않는 Stale 데이터 현상이 발생한다