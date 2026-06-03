- **`Redux Toolkit`** 사용법을 공식문서를 보며 직접 정리해보기 🍠
  [Getting Started | Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
  - Provider
      <aside>
      🍑
      
      Redux Store를 React 컴포넌트 트리 전체에 공급합니다. 
      
      반드시 앱 최상단에 위치해야 하며, `store` prop으로 스토어 인스턴스를 주입합니다.
      
      보통 `main.tsx` 또는 `index.tsx`에서 설정합니다.
      
      </aside>
      
      #### **Provider 사용 이유**
      
      Redux store는 기본적으로 React와 연결되어 있지 않음
      
      → 따라서 Provider로 감싸서 "모든 컴포넌트가 store 접근 가능" 하게 만듦!
      
      #### **Provider 사용 예시**
      
      ```tsx
      import { Provider } from 'react-redux'
      import { store } from './app/store'
      
      const root = ReactDOM.createRoot(document.getElementById('root'))
      
      root.render(
        <Provider store={store}>
          <App />
        </Provider>
      )
      ```
      
      #### **Provider 사용 시 주의사항**
      
      | 위치 | 앱 루트 최상단에 단 한 번만 배치 |
      | --- | --- |
      | context | 기본 ReactReduxContext 사용 (커스텀 가능) |
      | children | 하위 모든 컴포넌트에서 useSelector/useDispatch 사용 가능 |
      | SSR | Next.js에서는 요청별로 스토어 인스턴스를 새로 생성해야 함 |

  - configureStore
      <aside>
      🍑
      
      Redux의 `createStore`를 감싸는 래퍼. 
      
      Redux DevTools, redux-thunk, Immer가 기본으로 포함되어 최소한의 설정으로 스토어를 생성합니다.
      = Redux store를 생성하는 함수
      
      </aside>
      
      ```tsx
      // 기존 Redux에서는:
      createStore(rootReducer)
      // 처럼 사용했지만,
      
      // RTK에서는:
      configureStore()
      // 를 사용합니다.
      ```
      
      - configureStore 특징
          
          ### Step 1. reducer 자동 연결
          
          ```
          reducer: {
          counter:counterReducer
          }
          ```
          
          형태로 여러 reducer를 쉽게 합칠 수 있음
          
          ### Step 2. Redux DevTools 자동 설정
          
          개발자 도구 자동 연결
          
          ### Step 3. middleware 자동 설정
          
          Thunk 같은 미들웨어 기본 포함
          
      
      #### **configureStore 사용 예시**
      
      ```tsx
      import { configureStore } from '@reduxjs/toolkit'
      import counterReducer from '../features/counter/counterSlice'
      import authReducer from '../features/auth/authSlice'
      
      export const store = configureStore({
        reducer: {
          counter: counterReducer,
          auth: authReducer,
        }
      })
      
      // TypeScript 타입 추출
      export type RootState = ReturnType<typeof store.getState>
      export type AppDispatch = typeof store.dispatch
      ```
      
      #### **configureStore 고급 옵션**
      
      ```tsx
      configureStore({
        reducer: rootReducer,
      
        // 미들웨어 커스텀 (기본 미들웨어 유지 + 추가)
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(logger, analyticsMiddleware),
      
        // DevTools 옵션 (production에서는 비활성화 권장)
        devTools: process.env.NODE_ENV !== 'production',
      
        // 초기 상태 (server-side 렌더링 등에 활용)
        preloadedState: window.__PRELOADED_STATE__,
      
        // Enhancer 추가
        enhancers: (getDefaultEnhancers) =>
          getDefaultEnhancers().concat(monitorReducerEnhancer),
      })
      ```
      
      #### **기본 포함 미들웨어**
      
      | redux-thunk | 비동기 액션 함수(Thunk) 처리. createAsyncThunk의 동작 기반 |
      | --- | --- |
      | serializability | 직렬화 불가 값(Date, Promise 등)의 state/action 저장 경고 |
      | immutability | 리듀서 외부에서 state 직접 변경 시 경고 (개발 환경) |
      
      > **주의:** middleware 배열을 직접 할당하면 기본 미들웨어가 제거됩니다. 반드시 `getDefaultMiddleware()`를 사용하세요.
      >

  - createSlice
      <aside>
      🍑
      
      `Redux Toolkit`의 핵심 기능!
      
      `state` + `reducer` + `action`을 한 번에 생성
      
      원래 Redux는:
      
      - action type 작성
      - action creator 작성
      - reducer 작성
      
      전부 따로 했어야 함
      
      하지만 createSlice는 이를 자동화함!
      
      즉,
      
      슬라이스 이름, 초기 상태, 리듀서 함수 객체를 받아 액션 크리에이터와 액션 타입을 자동으로 생성
      
      Immer가 내장되어 불변성을 신경 쓰지 않아도 됩니다.
      
      </aside>
      
      #### **createSlice 구조**
      
      ```tsx
      createSlice({
        name,
        initialState,
        reducers
      })
      ```
      
      #### **createSlice 예시**
      
      ```tsx
      import {createSlice }from'@reduxjs/toolkit';
      
      constinitialState= {
        value:0,
      };
      
      constcounterSlice=createSlice({
        name:'counter',
      
        initialState,
      
        reducers: {
          increment: (state) => {
      state.value+=1;
          },
      
          decrement: (state) => {
      state.value-=1;
          },
      
          incrementByAmount: (state,action) => {
      state.value+=action.payload;
          },
        },
      });
      
      exportconst { increment, decrement, incrementByAmount }=
      counterSlice.actions;
      
      exportdefaultcounterSlice.reducer;
      ```
      
      - 주요 개념
          
          Step 1. state: 현재 상태 값
          
          ```tsx
          state.value
          ```
          
          Step 2. action: 상태 변경 요청 객체
          
          ```tsx
          dispatch(increment())
          ```
          
          Step 3. payload: 추가 데이터 전달
          
          ```tsx
          dispatch(incrementByAmount(5))
          // 여기서 5가 payload
          ```
          
      - Immer 기반 불변성 관리
          
          <aside>
          🍑
          
          Redux Toolkit 내부에는 Immer 가 포함되어 있습니다.
          
          </aside>
          
          ```tsx
          // 그래서 아래 코드처럼:
          state.value+=1;
          // 직접 수정하는 것처럼 보여도,
          // 실제로는 Immer가 불변성을 자동 처리합니다.
          
          // 기존 Redux에서는:
          return {
            ...state,
            value:state.value+1
          }
          // 처럼 복잡하게 작성해야 했습니다.
          ```
          
      
      #### **createSlice 기본 사용법**
      
      ```tsx
      import { createSlice, PayloadAction } from '@reduxjs/toolkit'
      
      interface CounterState { value: number; status: 'idle' | 'loading' }
      
      const counterSlice = createSlice({
        name: 'counter',          // 액션 타입 prefix: 'counter/increment'
        initialState: { value: 0, status: 'idle' } as CounterState,
      
        reducers: {
          increment(state) {
            state.value += 1       // Immer 덕분에 직접 변경 가능
          },
          decrement(state) {
            state.value -= 1
          },
          incrementByAmount(state, action: PayloadAction<number>) {
            state.value += action.payload
          },
          reset() {
            return { value: 0, status: 'idle' }   // 새 객체 반환도 가능
          }
        }
      })
      
      // 액션 크리에이터 & 리듀서 내보내기
      export const { increment, decrement, incrementByAmount, reset }
        = counterSlice.actions
      export default counterSlice.reducer
      ```
      
      - 예시
          
          **prepare callback — 액션 가공**
          
          ```tsx
          createSlice({
            name: 'todos',
            initialState: [],
            reducers: {
              addTodo: {
                // reducer: 실제 상태 변경
                reducer(state, action) {
                  state.push(action.payload)
                },
                // prepare: payload 가공 (uuid 등 주입)
                prepare(text: string) {
                  return { payload: { id: nanoid(), text } }
                }
              }
            }
          })
          ```
          
          **extraReducers — 외부 액션 처리**
          
          ```tsx
          createSlice({
            name: 'counter',
            initialState,
            reducers: {},
            // 다른 슬라이스 / createAsyncThunk 액션 처리
            extraReducers: (builder) => {
              builder
                .addCase(fetchUser.pending, (state) => {
                  state.status = 'loading'
                })
                .addCase(fetchUser.fulfilled, (state, action) => {
                  state.status = 'idle'
                  state.value = action.payload.count
                })
                .addMatcher(isRejected, (state) => {
                  state.status = 'idle'
                })
            }
          })
          ```

  - useSelector - 상태 읽기
      <aside>
      🍑
      
      컴포넌트에서 Redux 스토어에 접근하는 핵심 훅입니다. 
      
      TypeScript 프로젝트에서는 타입이 지정된 커스텀 훅을 만들어 사용하는 것을 권장합니다.
      
      **Redux store의 state를 가져오는 Hook**
      
      </aside>
      
      #### **useSelector의 사용 예시**
      
      ```tsx
      import { useSelector } from 'react-redux';
      
      const count = useSelector((state) => state.counter.value);
      ```
      
      #### **동작 원리**
      
      ```tsx
      state.counter.value
      // 의 값이 바뀌면
      // 해당 컴포넌트만 리렌더링됨
      ```
      
      #### **useSelector 특징: selector 기반 구독**
      
      → 필요한 state만 구독 가능
      
      ```tsx
      // 즉:
      state.counter.value
      // 만 변경 감지
      
      → 성능 최적화 가능
      ```
      
      #### **useSelector의 기본 사용 방법**
      
      ```tsx
      import { useSelector } from 'react-redux'
      import type { RootState } from './app/store'
      
      function Counter() {
        // selector가 반환한 값이 변경될 때만 리렌더링
        const count = useSelector(
          (state: RootState) => state.counter.value
        )
        return <div>{count}</div>
      }
      ```
      
      > **동작 방식:** 매 dispatch 후 selector를 재실행하고, 이전 값과 `===` 비교. 다르면 리렌더링 트리거.
      >

  - useDispatch - 액션 발생
      <aside>
      🍑
      
      컴포넌트에서 Redux 스토어에 접근하는 핵심 훅입니다. 
      
      TypeScript 프로젝트에서는 타입이 지정된 커스텀 훅을 만들어 사용하는 것을 권장합니다.
      
      **Redux action을 실행시키는 Hook**
      
      </aside>
      
      #### **useDispatch 사용 예시**
      
      ```tsx
      import { useDispatch } from 'react-redux';
      import { increment } from './counterSlice';
      
      const dispatch = useDispatch();
      
      <button onClick={() => dispatch(increment())}>
        증가
      </button>
      ```
      
      #### **useDispatch 기본 사용 방법**
      
      ```tsx
      import { useDispatch } from 'react-redux'
      import { increment, incrementByAmount }
        from './counterSlice'
      
      function CounterButtons() {
        const dispatch = useDispatch()
      
        return (
          <>
            <button onClick={() => dispatch(increment())}>+1</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
          </>
        )
      }
      ```

  - 기타 **`Redux Toolkit`** 사용 방법을 상세하게 정리해 보세요
    - Redux 흐름
      ```tsx
      컴포넌트
       ↓ dispatch(action)
      Reducer 실행
       ↓
      State 변경
       ↓
      useSelector 감지
       ↓
      컴포넌트 리렌더링
      ```
      #### **전체 구조 요약**
      Redux Toolkit의 핵심 패턴은 다음 순서로 구성됩니다.
      1. `createSlice`로 상태 단위(slice)를 정의하고 리듀서와 액션 크리에이터를 한 번에 만든다.
      2. `configureStore`로 slice reducer들을 합쳐 스토어를 만든다.
      3. `Provider`로 React 앱 최상단에 스토어를 주입한다.
      4. 컴포넌트에서 `useSelector`로 읽고, `useDispatch`로 액션을 발생시킨다.
    - 전체 **`Redux Toolkit`** 예제
      - `store.ts`

        ```tsx
        import { configureStore } from '@reduxjs/toolkit';
        import counterReducer from './counterSlice';

        export const store = configureStore({
          reducer: {
            counter: counterReducer,
          },
        });
        ```

      - `counterSlice.ts`

        ```tsx
        import { createSlice } from '@reduxjs/toolkit';

        const counterSlice = createSlice({
          name: 'counter',

          initialState: {
            value: 0,
          },

          reducers: {
            increment: (state) => {
              state.value += 1;
            },

            decrement: (state) => {
              state.value -= 1;
            },
          },
        });

        export const { increment, decrement } = counterSlice.actions;

        export default counterSlice.reducer;
        ```

      - `Counter.tsx`

        ```tsx
        import { useSelector, useDispatch } from 'react-redux';
        import { increment, decrement } from './counterSlice';

        const Counter = () => {
          const count = useSelector((state) => state.counter.value);

          const dispatch = useDispatch();

          return (
            <div>
              <h1>{count}</h1>

              <button onClick={() => dispatch(increment())}>증가</button>

              <button onClick={() => dispatch(decrement())}>감소</button>
            </div>
          );
        };

        export default Counter;
        ```

    - 기타 **`Redux Toolkit`** 사용 방법
      - `createAsyncThunk` - 비동기 API 처리용 함수
          <aside>
          🍑
          
          비동기 작업(API 호출 등)을 처리하는 표준 방법. 
          
          Promise 라이프사이클에 따라 `pending / fulfilled / rejected` 세 가지 액션을 자동 생성합니다.
          
          </aside>
          
          정의 및 `extraReducers` 연결
          
          <aside>
          🍑
          
          `extraReducers` 란?
          
          → 비동기 상태 처리
          
          </aside>
          
          ```tsx
          import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
          
          // 1. Thunk 생성 — 'users/fetchById' 접두사 자동 부여
          export const fetchUserById = createAsyncThunk(
            'users/fetchById',
            async (userId: string, thunkAPI) => {
              const response = await fetch(`/api/users/${userId}`)
              if (!response.ok) {
                return thunkAPI.rejectWithValue('서버 오류')
              }
              return response.json()       // fulfilled payload
            }
          )
          
          // 2. slice의 extraReducers에서 처리
          const usersSlice = createSlice({
            name: 'users',
            initialState: { data: null, status: 'idle', error: null },
            reducers: {},
            extraReducers: (builder) => {
              builder
                .addCase(fetchUserById.pending, (state) => {
                  state.status = 'loading'
                })
                .addCase(fetchUserById.fulfilled, (state, action) => {
                  state.status = 'succeeded'
                  state.data = action.payload
                })
                .addCase(fetchUserById.rejected, (state, action) => {
                  state.status = 'failed'
                  state.error = action.payload // rejectWithValue 값
                })
            }
          })
          ```
          
          #### **컴포넌트에서 dispatch**
          
          ```tsx
          function UserProfile({ userId }: { userId: string }) {
            const dispatch = useAppDispatch()
            const { data, status } = useAppSelector(s => s.users)
          
            useEffect(() => {
              dispatch(fetchUserById(userId))
            }, [userId])
          
            if (status === 'loading') return <Spinner />
            return <div>{data?.name}</div>
          }
          ```
          
          > **thunkAPI 활용:** `getState()`로 현재 상태 참조, `dispatch()`로 다른 액션 호출, `signal`로 요청 취소(AbortController) 가능합니다.
          >
      - `createEntityAdapter` - 정규화 데이터 관리

        ```tsx
        import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

        // { ids: [], entities: {} } 구조로 자동 관리
        const todosAdapter = createEntityAdapter<Todo>({
          sortComparer: (a, b) => a.title.localeCompare(b.title), // 정렬 기준
        });

        const todosSlice = createSlice({
          name: 'todos',
          initialState: todosAdapter.getInitialState({ loading: false }),
          reducers: {
            addTodo: todosAdapter.addOne, // 기본 CRUD 내장
            addTodos: todosAdapter.addMany,
            updateTodo: todosAdapter.updateOne,
            removeTodo: todosAdapter.removeOne,
            upsertTodos: todosAdapter.upsertMany, // 없으면 추가, 있으면 업데이트
          },
        });

        // 내장 셀렉터
        const { selectAll, selectById, selectIds } = todosAdapter.getSelectors(
          (s: RootState) => s.todos,
        );

        const allTodos = useAppSelector(selectAll);
        ```

      - `middleware` - Redux 동작 중간에 실행되는 기능
        예시
        - 로깅
        - API 처리
        - 에러 처리
        ```tsx
        configureStore({
          reducer,
          middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
        });
        ```
      - `listenerMiddleware` - 사이드 이펙트 처리

        ```tsx
        import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

        const listenerMiddleware = createListenerMiddleware();

        // 특정 액션 발생 시 사이드 이펙트 실행
        listenerMiddleware.startListening({
          actionCreator: userLoggedIn,
          effect: async (action, listenerAPI) => {
            // analytics, localStorage 저장 등
            analytics.track('login', { userId: action.payload.id });
          },
        });

        // 여러 액션 매칭
        listenerMiddleware.startListening({
          matcher: isAnyOf(increment, decrement),
          effect: (action, { getState }) => {
            localStorage.setItem('count', getState().counter.value);
          },
        });

        // configureStore에 등록
        configureStore({
          middleware: (getDefault) =>
            getDefault().prepend(listenerMiddleware.middleware),
        });
        ```

        > **`redux-saga` / `redux-observable` 대안:** 복잡한 비동기 흐름 없이 간단한 사이드 이펙트에 적합합니다. 취소(abortController) 및 fork도 지원합니다.

      - `RTK Query` - 데이터 페칭 & 캐싱

        ```tsx
        import {
          createApi,
          fetchBaseQuery,
        } from '@reduxjs/toolkit/query/react';

        // API 슬라이스 정의
        export const postsApi = createApi({
          reducerPath: 'postsApi',
          baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
          tagTypes: ['Post'],
          endpoints: (builder) => ({
            getPosts: builder.query<Post[], void>({
              query: () => '/posts',
              providesTags: ['Post'],
            }),
            addPost: builder.mutation<Post, Partial<Post>>({
              query: (body) => ({ url: '/posts', method: 'POST', body }),
              invalidatesTags: ['Post'], // 자동 캐시 무효화
            }),
          }),
        });

        // 자동 생성 훅 사용
        export const { useGetPostsQuery, useAddPostMutation } = postsApi;

        // 컴포넌트에서
        const { data, isLoading, error } = useGetPostsQuery();
        ```

        > **자동 처리 항목:** 로딩·에러 상태, 중복 요청 제거, 캐시 관리, 낙관적 업데이트, 폴링, refetch on focus/reconnect

      - `DevTools` - Redux 상태 흐름 추적 가능
        - action 기록 확인
        - state 변화 추적
        - 디버깅 편리
          → RTK에서는 자동 활성화됨

    - **`Redux Toolkit`** 장점
      | 장점 | 설명 |
      | ------------------ | ---------------- |
      | 코드 감소 | boilerplate 감소 |
      | 불변성 자동 처리 | Immer 내장 |
      | 공식 권장 | Redux 팀 공식 |
      | DevTools 자동 설정 | 디버깅 쉬움 |
      | 비동기 처리 지원 | createAsyncThunk |
    - **`Redux Toolkit`** 단점
      | 단점 | 설명 |
      | ---------------------------- | ----------------------------------- |
      | 초기 학습 난이도 | Redux 개념 이해 필요 |
      | boilerplate 완전 제거는 아님 | slice/store 구조 필요 |
      | 작은 프로젝트엔 과할 수 있음 | Context/Zustand가 더 간단할 수 있음 |

- **Zustand**란 무엇인가요? 🍠

  # **Zustand**란 무엇인가요?

  ***

    <aside>
    🍑
    
    Zustand 는 React 전역 상태 관리 라이브러리입니다.
    
    독일어로 “상태(state)”라는 뜻입니다.
    
    Redux보다 훨씬 간단하고 가벼운 상태 관리 라이브러리로 유명합니다.
    
    </aside>
    
    #### **특징:**
    
    - Provider 필요 없음
    - 보일러플레이트 거의 없음
    - Hook 기반 사용
    - selector 기반 구독 지원
    - 성능 최적화 쉬움

- 왜 **Zustand**를 사용할까요? 🍠

  # 왜 Zustand를 사용할까요?

  ***

  #### 1. 코드가 매우 간단함

  ```tsx
  // Redux:
  store
  slice
  provider
  dispatch
  reducer
  // 필요

  //Zustand:
  store 하나 생성하면 끝!
  ```

  #### 2. Provider 필요 없음

  ```tsx
  // Redux는:
  <Providerstore={store}>
  // 필수

  Zustand는 필요 없음
  ```

  #### 3. selector 기반 최적화 - 필요한 state만 구독 가능

  → 불필요한 리렌더 감소

  #### 4. 비동기 처리 쉬움 - store 내부에서 async 함수 바로 사용 가능

- **Zustand** 기본 사용법 🍠

  # **Zustand** 기본 사용법

  ***

  ### 1) Store 만들기

  ```tsx
  import { create } from 'zustand';

  interface CounterState {
    count: number;

    increase: () => void;

    decrease: () => void;
  }

  export const useCounterStore = create<CounterState>((set) => ({
    count: 0,

    increase: () =>
      set((state) => ({
        count: state.count + 1,
      })),

    decrease: () =>
      set((state) => ({
        count: state.count - 1,
      })),
  }));
  ```

  ### 2) 컴포넌트에서 사용하기

  ```tsx
  const count = useCounterStore((state) => state.count);

  const increase = useCounterStore((state) => state.increase);
  ```

- **Zustand**에서 중요한 개념 🍠

  # **Zustand**에서 중요한 개념

  ***

  ### 1) set 함수: 상태 변경 함수

  ```tsx
  set((state) => ({
    count: state.count + 1,
  }));
  ```

  ### 2) get 함수: 현재 상태 조회 가능

  ```tsx
  create((set, get) => ({
    increase: () => {
      const current = get().count;

      set({
        count: current + 1,
      });
    },
  }));
  ```

  ### 3) 선택적 구독 (selector)

  ```tsx
  const count = useStore((state) => state.count);
  // 특정 값만 구독 가능
  -> 성능 최적화
  ```

- **Zustand** 객체 상태 관리 예시 🍠

  # **Zustand** 객체 상태 관리 예시

  ***

  ```tsx
  import { create } from 'zustand';

  interface UserState {
    user: {
      name: string;
      age: number;
    };

    changeName: (name: string) => void;
  }

  export const useUserStore = create<UserState>((set) => ({
    user: {
      name: '철수',
      age: 20,
    },

    changeName: (name) =>
      set((state) => ({
        user: {
          ...state.user,
          name,
        },
      })),
  }));
  ```

- **Zustand** 비동기 로직 예시 🍠

  # **Zustand** 비동기 로직 예시

  ***

  **Zustand**에서는 비동기 API 호출도 간단하게 store 안에서 사용할 수 있어요.

  ```tsx
  import { create } from 'zustand';

  interface UserState {
    users: string[];

    fetchUsers: () => Promise<void>;
  }

  export const useUserStore = create<UserState>((set) => ({
    users: [],

    fetchUsers: async () => {
      const response = await fetch('/users');

      const data = await response.json();

      set({
        users: data,
      });
    },
  }));
  ```

- **Zustand** + Persist 미들웨어 🍠

  # **Zustand** + Persist 미들웨어

  ***

  **Zustand**는 미들웨어를 활용해 로컬스토리지 등에 상태를 저장할 수 있어요.

  ```tsx
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  export const useStore = create(
    persist(
      (set) => ({
        count: 0,

        increase: () =>
          set((state) => ({
            count: state.count + 1,
          })),
      }),

      {
        name: 'counter-storage',
      },
    ),
  );
  ```

  #### **Persist란?**

    <aside>
    🍑
    
    상태를 localStorage 등에 저장하는 기능
    
    새로고침해도 상태 유지 가능
    
    </aside>

- **Zustand** + Immer 함께 쓰기 🍠

  # **Zustand** + Immer 함께 쓰기

  ***

  불변성 관리를 쉽게 하고 싶다면 Immer 미들웨어도 사용 가능해요.

  ```tsx
  import { create } from 'zustand';
  import { immer } from 'zustand/middleware/immer';

  const useStore = create(
    immer((set) => ({
      count: 0,

      increase: () =>
        set((state) => {
          state.count += 1;
        }),
    })),
  );
  ```

- **Zustand** vs Context API 🍠

  # **Zustand** vs Context API

  ***

  | 비교            | Zustand              | Context API      |
  | --------------- | -------------------- | ---------------- |
  | 성능            | selector 기반 최적화 | 전체 value 구독  |
  | 리렌더          | 필요한 컴포넌트만    | 전체 리렌더 가능 |
  | Provider        | 필요 없음            | 필요             |
  | 코드량          | 적음                 | 상대적으로 많음  |
  | 대규모 상태관리 | 유리                 | 불리             |

- **`Context API`**의 **`value 전체 구독 메커니즘`**과 **`Zustand`**의 **`selector 기반 구독`**의 성능 차이를 설명해보세요.
  - `Context API`의 `value 전체 구독 메커니즘`
    Context API는
    ```tsx
    <MyContext.Providervalue={{ a, b }}>
    ```
    value 객체 전체를 구독합니다.
    즉,
    ```tsx
    consta = useContext(MyContext);
    ```
    를 사용하면,
    실제로는 `a`만 필요한 게 아니라 Provider의 value 전체 변경을 감지합니다.
  - `Context API`의 `value 전체 구독 메커니즘` 의 문제점
    예시
    ```
    value={{ user, theme }}
    ```
    일 때,
    theme만 변경돼도 user 사용하는 컴포넌트까지 리렌더링될 수 있음
    → 성능 비효율 발생
  - **`Zustand`**의 **`selector 기반 구독`**
    Zustand는
    ```tsx
    constuser = useStore((state) => state.user);
    ```
    처럼 특정 state만 구독 가능
    즉,
    - user 변경 시 → user 사용하는 컴포넌트만 리렌더
    - theme 변경 시 → theme 사용하는 컴포넌트만 리렌더
      → 훨씬 효율적
- **`Jotai`**의 **`atom`** 조합 방식이 파생 상태 관리에서 Zustand 대비 갖는 장점을 의존성 추적 관점에서 설명해보세요.
  #### **`Jotai`의 `atom` 조합 방식의 장점**
    <aside>
    🍑
    
    Jotai 는 atom 단위로 상태를 관리합니다.
    
    </aside>
    
    #### atom 예시
    
    ```tsx
    constcountAtom=atom(0);
    
    constdoubleAtom=atom((get) =>get(countAtom)*2);
    ```
    
    #### **핵심 특징**
    
    <aside>
    🍑
    
    **의존성 자동 추적** `doubleAtom` 은 `countAtom` 에 의존
    
    → `countAtom` 변경 시에만 재계산
    
    </aside>
    
    #### **Zustand 대비 장점**
    
    - Zustand
        - selector 직접 작성 필요
            - 파생 상태 수동 관리 많음
    - Jotai
        - atom 간 의존성 자동 추적
        - 파생 상태 자동 재계산
            - memoization 자연스러움
    
    즉,
    
    > 복잡한 파생 상태 관리에서는 Jotai가 더 선언적이고 효율적일 수 있음
    >
- 서버 상태를 **`useEffect`**로 관리할 때 발생하는 캐싱/중복 요청/불일치 문제를 설명해보세요.
  예시
  ```tsx
  useEffect(() => {
    fetch('/users')
      .then((res) => res.json())
      .then(setUsers);
  }, []);
  ```
  #### **문제 1. 캐싱 없음**
  페이지 이동 후 다시 돌아오면 매번 API 재요청
  → 비효율
  #### **문제 2. 중복 요청 발생**
  여러 컴포넌트에서 같은 API 호출 가능
  → 네트워크 낭비
  #### **문제 3. 상태 불일치**
  A 컴포넌트의 users와 B 컴포넌트의 users가 각자 fetch하면 데이터 시점 달라질 수 있음
  → 서버 상태 동기화 문제
  #### **문제 4. loading/error 직접 관리 필요**
  ```
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  ```
  직접 전부 구현해야 함
  #### 그래서
  - TanStack Query
  - SWR
    같은 서버 상태 관리 라이브러리가 등장함!

#### React Query가 해결하는 것

| 문제              | 해결          |
| ----------------- | ------------- |
| 캐싱              | 자동          |
| 중복 요청         | deduplication |
| stale 관리        | 자동          |
| refetch           | 자동          |
| loading/error     | 기본 제공     |
| optimistic update | 지원          |

#### 최종 정리

| 라이브러리    | 특징                     |
| ------------- | ------------------------ |
| Redux Toolkit | 대규모/명확한 구조       |
| Zustand       | 간단하고 빠름            |
| Jotai         | atom 기반 파생 상태 강력 |
| Context API   | 작은 규모 적합           |
| React Query   | 서버 상태 관리 특화      |
