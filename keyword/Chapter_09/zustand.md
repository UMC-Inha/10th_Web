- **Zustand**란 무엇인가요? 🍠
    
    # **Zustand**란 무엇인가요?
    
    ---
    
    Zustand는 React 애플리케이션에서 사용하는 가벼운 전역 상태 관리 라이브러리입니다.
    
    독일어로 “상태(state)”라는 뜻이며, Redux보다 훨씬 간단한 방식으로 상태를 관리할 수 있도록 만들어졌습니다.
    
    공식 사이트: [Zustand Official Docs](https://zustand-demo.pmnd.rs/?utm_source=chatgpt.com)
    
    ---
    
    # Zustand의 특징
    
    - boilerplate(반복 코드)가 매우 적음
    - Provider 없이 사용 가능
    - Hook 기반 API
    - Context API보다 리렌더링 최적화 쉬움
    - Redux보다 훨씬 간단함
    - TypeScript 지원 우수
    - middleware 지원
    - 비동기 로직 처리 쉬움
    
    ---
    
    # Zustand의 핵심 아이디어
    
    ```
    "상태를 Hook처럼 사용한다"
    ```
    
    예:
    
    ```jsx
    const bears = useBearStore((state) => state.bears)
    ```
    
    즉:
    
    - store를 직접 가져오는 것이 아니라
    - Hook처럼 상태를 구독해서 사용
- 왜 **Zustand**를 사용할까요? 🍠
    
    # 왜 Zustand를 사용할까요?
    
    ---
    
    # 1. Redux보다 훨씬 간단함
    
    Redux는:
    
    - Provider 필요
    - reducer 필요
    - action 필요
    - dispatch 필요
    
    등 개념이 많음
    
    반면 Zustand는:
    
    ```jsx
    const useStore = create((set) => ({
      count: 0,
      increase: () => set((state) => ({
        count: state.count + 1
      }))
    }))
    ```
    
    정도로 끝남
    
    ---
    
    # 2. Provider가 필요 없음
    
    Redux:
    
    ```jsx
    <Provider store={store}>
      <App />
    </Provider>
    ```
    
    필수
    
    ---
    
    Zustand:
    
    ```
    그냥 store import 후 사용 가능
    ```
    
    별도 Provider 필요 없음
    
    ---
    
    # 3. 리렌더링 최적화가 쉬움
    
    Context API는:
    
    - 값 하나만 바뀌어도
    - Provider 하위 전체 리렌더링 가능성 존재
    
    하지만 Zustand는:
    
    ```jsx
    const count = useStore((state) => state.count)
    ```
    
    처럼 필요한 값만 구독 가능
    
    즉:
    
    - 선택한 값이 바뀔 때만 리렌더링
    
    ---
    
    # 4. 비동기 처리도 간단함
    
    Redux thunk 같은 별도 개념 없이:
    
    ```jsx
    fetchUsers: async () => {
      const response = await fetch('/users')
      const data = await response.json()
    
      set({ users: data })
    }
    ```
    
    가능
    
    ---
    
    # 5. learning curve가 낮음
    
    Redux보다 개념이 적어서 입문 난이도가 낮음
    
    특히:
    
    - 소규모 프로젝트
    - 개인 프로젝트
    - 빠른 개발
    
    에서 많이 사용
    
    ---
    
- **Zustand** 기본 사용법 🍠
    
    # **Zustand** 기본 사용법
    
    ---
    
    # 설치
    
    ```
    npm install zustand
    ```
    
    ### 1) Store 만들기
    
    ```tsx
    import { create } from 'zustand'
    
    const useCounterStore = create((set) => ({
      count: 0,
    
      increase: () =>
        set((state) => ({
          count: state.count + 1,
        })),
    
      decrease: () =>
        set((state) => ({
          count: state.count - 1,
        })),
    }))
    ```
    
    ---
    
    # 코드 설명
    
    ## create()
    
    store 생성 함수
    
    ---
    
    ## set
    
    state 변경 함수
    
    ---
    
    ## count
    
    전역 상태
    
    ---
    
    ## increase/decrease
    
    상태 변경 함수
    
    ### 2) 컴포넌트에서 사용하기
    
    ```tsx
    function Counter() {
      const count = useCounterStore(
        (state) => state.count
      )
    
      const increase = useCounterStore(
        (state) => state.increase
      )
    
      return (
        <div>
          <h1>{count}</h1>
    
          <button onClick={increase}>
            증가
          </button>
        </div>
      )
    }
    ```
    
    ---
    
    # 동작 흐름
    
    ```
    버튼 클릭
       ↓
    increase 실행
       ↓
    set 호출
       ↓
    state 변경
       ↓
    구독 중인 컴포넌트 리렌더링
    ```
    
- **Zustand**에서 중요한 개념 🍠
    
    # **Zustand**에서 중요한 개념
    
    ---
    
    ### 1) set 함수
    
    state를 변경하는 함수
    
    ---
    
    # 기본 사용
    
    ```jsx
    set({ count:1 })
    ```
    
    ---
    
    # 이전 state 기반 업데이트
    
    ```jsx
    set((state) => ({
      count: state.count + 1,
    }))
    ```
    
    React setState와 매우 유사
    
    ---
    
    # 부분 업데이트 가능
    
    ```jsx
    set({
      user: {
        name:'Tom'
      }
    })
    ```
    
    ### 2) get 함수
    
    현재 state 조회 함수
    
    ---
    
    # 사용 예시
    
    ```jsx
    const useStore = create((set, get) => ({
      count: 0,
    
      increase: () => {
        const current = get().count
    
        set({
          count: current + 1,
        })
      },
    }))
    ```
    
    ---
    
    # get 특징
    
    ```
    현재 최신 state를 읽을 수 있음
    ```
    
    ---
    
    # 주로 사용하는 상황
    
    - 현재 state 기반 계산
    - 조건 처리
    - 다른 state 참조
    
    ### 3) 선택적 구독 (selector)
    
    Zustand 핵심 기능 중 하나
    
    ---
    
    # selector란?
    
    필요한 state만 선택해서 구독하는 것
    
    ---
    
    # 예시
    
    ```jsx
    const count = useStore(
      (state) => state.count
    )
    ```
    
    ---
    
    # 장점
    
    ```
    count가 바뀔 때만 리렌더링
    ```
    
    ---
    
    # 나쁜 예시
    
    ```jsx
    const state = useStore()
    ```
    
    전체 state 구독
    
    불필요한 리렌더링 가능성 증가
    
    ---
    
    # 좋은 예시
    
    ```jsx
    const user = useStore((state) => state.user)
    ```
    
    필요한 값만 구독
    
- **Zustand** 객체 상태 관리 예시 🍠
    
    # **Zustand** 객체 상태 관리 예시
    
    ---
    
    ```tsx
    import { create } from 'zustand'
    
    const useUserStore = create((set) => ({
      user: {
        name: '',
        age: 0,
      },
    
      setName: (name) =>
        set((state) => ({
          user: {
            ...state.user,
            name,
          },
        })),
    
      setAge: (age) =>
        set((state) => ({
          user: {
            ...state.user,
            age,
          },
        })),
    }))
    ```
    
    ---
    
    # 사용 예시
    
    ```jsx
    function Profile() {
      const user = useUserStore(
        (state) => state.user
      )
    
      const setName = useUserStore(
        (state) => state.setName
      )
    
      return (
        <div>
          <h1>{user.name}</h1>
    
          <button
            onClick={() => setName('Tom')}
          >
            이름 변경
          </button>
        </div>
      )
    }
    ```
    
- **Zustand** 비동기 로직 예시 🍠
    
    # **Zustand** 비동기 로직 예시
    
    ---
    
    **Zustand**에서는 비동기 API 호출도 간단하게 store 안에서 사용할 수 있어요.
    
    ```tsx
    import { create } from 'zustand'
    
    const useUserStore = create((set) => ({
      users: [],
      loading: false,
    
      fetchUsers: async () => {
        set({ loading: true })
    
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        )
    
        const data = await response.json()
    
        set({
          users: data,
          loading: false,
        })
      },
    }))
    ```
    
    ---
    
    # 사용 예시
    
    ```tsx
    function Users() {
      const users = useUserStore(
        (state) => state.users
      )
    
      const loading = useUserStore(
        (state) => state.loading
      )
    
      const fetchUsers = useUserStore(
        (state) => state.fetchUsers
      )
    
      return (
        <div>
          <button onClick={fetchUsers}>
            유저 조회
          </button>
    
          {loading && <p>로딩중...</p>}
    
          {users.map((user) => (
            <p key={user.id}>{user.name}</p>
          ))}
        </div>
      )
    }
    ```
    
- **Zustand** + Persist 미들웨어 🍠
    
    # **Zustand** + Persist 미들웨어
    
    ---
    
    **Zustand**는 미들웨어를 활용해 로컬스토리지 등에 상태를 저장할 수 있어요.
    
    # 설치
    
    ```
    npm install zustand
    ```
    
    persist는 Zustand 내부 제공
    
    ---
    
    # 예시
    
    ```tsx
    import { create } from 'zustand'
    
    import { persist } from 'zustand/middleware'
    
    const useAuthStore = create(
      persist(
        (set) => ({
          token: '',
    
          login: (token) =>
            set({ token }),
    
          logout: () =>
            set({ token: '' }),
        }),
    
        {
          name: 'auth-storage',
        }
      )
    )
    ```
    
    ---
    
    # 동작 방식
    
    ```
    state 변경
       ↓
    localStorage 자동 저장
       ↓
    새로고침 후 복원
    ```
    
    ---
    
    # 저장되는 localStorage key
    
    ```
    auth-storage
    ```
    
    ---
    
    # 주로 저장하는 것
    
    - 로그인 토큰
    - 다크모드
    - 사용자 설정
- **Zustand** + Immer 함께 쓰기 🍠
    
    # **Zustand** + Immer 함께 쓰기
    
    ---
    
    불변성 관리를 쉽게 하고 싶다면 Immer 미들웨어도 사용 가능해요.
    
    # 설치
    
    ```
    npm install immer
    ```
    
    ---
    
    # 예시
    
    ```tsx
    import { create } from 'zustand'
    
    import { immer } from 'zustand/middleware/immer'
    
    const useStore = create(
      immer((set) => ({
        user: {
          name: '',
          age: 0,
        },
    
        updateName: (name) =>
          set((state) => {
            state.user.name = name
          }),
      }))
    )
    ```
    
    ---
    
    # Immer 장점
    
    원래는:
    
    ```tsx
    set((state) => ({
      user: {
        ...state.user,
        name,
      },
    }))
    ```
    
    처럼 복사 필요
    
    ---
    
    Immer 사용 시:
    
    ```tsx
    state.user.name=name
    ```
    
    처럼 직접 수정 가능
    
- **Zustand** vs Context API 🍠
    
    # **Zustand** vs Context API
    
    ---
    
    # Zustand vs Context API
    
    ---
    
    | 항목 | Zustand | Context API |
    | --- | --- | --- |
    | 전역 상태 관리 | 매우 적합 | 가능 |
    | 리렌더링 최적화 | 쉬움 | 어려움 |
    | Provider 필요 여부 | 필요 없음 | 필요 |
    | 사용 난이도 | 쉬움 | 쉬움 |
    | 대규모 상태 관리 | 적합 | 비효율 가능 |
    | selector 지원 | 지원 | 기본 미지원 |
    | 비동기 처리 | 쉬움 | 직접 구현 |
    | middleware | 지원 | 없음 |