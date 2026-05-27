- **`Context API`**의 **`value 전체 구독 메커니즘`**과 **`Zustand`**의 **`selector 기반 구독`**의 성능 차이를 설명해보세요.
    
    # Context API의 value 전체 구독 메커니즘
    
    React Context API는 Provider의 `value`가 변경되면 해당 Context를 구독하는 모든 컴포넌트가 다시 렌더링됩니다.
    
    예시:
    
    ```tsx
    <AuthContext.Provider
      value={{
        user,
        theme,
      }}
    >
    ```
    
    이 상태에서:
    
    ```tsx
    const { user } = useContext(AuthContext)
    ```
    
    만 사용하는 컴포넌트가 있어도,
    
    ```
    theme
    ```
    
    값이 바뀌면 같이 리렌더링될 수 있습니다.
    
    ---
    
    # 왜 이런 일이 발생할까?
    
    Context API는 내부적으로:
    
    ```
    "Provider의 value 객체 전체를 구독"
    ```
    
    하기 때문입니다.
    
    즉:
    
    ```tsx
    value={{
      user,
      theme
    }}
    ```
    
    에서 `theme`만 변경되어도:
    
    ```
    새로운 객체 생성
    ```
    
    ↓
    
    ```
    value 참조 변경
    ```
    
    ↓
    
    ```
    모든 useContext 구독 컴포넌트 리렌더링 가능
    ```
    
    ---
    
    # Context API의 문제점
    
    상태 규모가 커질수록:
    
    - 불필요한 리렌더링 증가
    - 성능 저하 가능성 증가
    - Provider 분리 필요성 증가
    
    ---
    
    # 예시 상황
    
    ```
    Context 안에:
    - user
    - theme
    - modal
    - notification
    - language
    ```
    
    등이 모두 들어있다면:
    
    ```
    notification 하나만 바뀌어도
    다른 컴포넌트들이 영향을 받을 가능성 존재
    ```
    
    ---
    
    # Zustand의 selector 기반 구독
    
    Zustand는:
    
    ```tsx
    const user = useStore((state) => state.user)
    ```
    
    처럼 selector 기반으로 상태를 구독합니다.
    
    즉:
    
    ```
    "필요한 state만 선택적으로 구독"
    ```
    
    합니다.
    
    ---
    
    # Zustand의 동작 방식
    
    ```tsx
    const theme = useStore(
      (state) => state.theme
    )
    ```
    
    이면:
    
    ```
    theme 값이 변경될 때만 리렌더링
    ```
    
    됩니다.
    
    반대로:
    
    ```
    state.user
    ```
    
    가 변경되어도 `theme` 구독 컴포넌트는 리렌더링되지 않습니다.
    
    ---
    
    # Zustand의 성능 장점
    
    ## 1. 불필요한 리렌더링 감소
    
    필요한 값만 구독
    
    ---
    
    ## 2. 상태 규모가 커져도 효율적
    
    state 일부 변경 시 관련 컴포넌트만 업데이트
    
    ---
    
    ## 3. Context 분리 필요 감소
    
    Context API에서는:
    
    - ThemeContext
    - UserContext
    - ModalContext
    
    등으로 나누는 경우 많음
    
    Zustand는 selector 기반이라 상대적으로 부담이 적음
    
    ---
    
    # 성능 차이 핵심 정리
    
    | 항목 | Context API | Zustand |
    | --- | --- | --- |
    | 구독 방식 | value 전체 구독 | selector 기반 구독 |
    | 리렌더링 범위 | 넓음 | 필요한 컴포넌트만 |
    | 상태 규모 증가 시 | 비효율 가능 | 상대적으로 효율적 |
    | 최적화 난이도 | 높음 | 쉬움 |
    
    ---
    
    # 핵심 요약
    
    ## Context API
    
    ```
    Provider value 전체를 기준으로 구독
    ```
    
    ---
    
    ## Zustand
    
    ```
    selector 기반으로 필요한 state만 구독
    ```
    
    ---
    
    ## 결과
    
    ```
    Zustand가 불필요한 리렌더링을 더 효과적으로 줄일 수 있음
    ```
    
- **`Jotai`**의 **`atom`** 조합 방식이 파생 상태 관리에서 Zustand 대비 갖는 장점을 의존성 추적 관점에서 설명해보세요.
    
    # Jotai의 atom 기반 구조
    
    Jotai는 상태를 작은 단위(atom)로 관리합니다.
    
    예시:
    
    ```tsx
    const countAtom = atom(0)
    ```
    
    각 atom은 독립적인 상태 단위
    
    ---
    
    # 파생 상태(derived state)
    
    Jotai는 atom끼리 조합 가능
    
    예시:
    
    ```tsx
    const countAtom = atom(0)
    
    const doubleAtom = atom((get) => {
      return get(countAtom) * 2
    })
    ```
    
    ---
    
    # 핵심 특징
    
    ```
    doubleAtom은 countAtom에 의존
    ```
    
    합니다.
    
    즉:
    
    ```
    Jotai가 atom 간 의존성을 자동 추적
    ```
    
    합니다.
    
    ---
    
    # 의존성 추적 기반 최적화
    
    Jotai는:
    
    ```
    "어떤 atom이 어떤 atom에 의존하는지"
    ```
    
    를 내부적으로 알고 있습니다.
    
    따라서:
    
    ```
    countAtom이 변경될 때만
    doubleAtom 재계산
    ```
    
    됩니다.
    
    ---
    
    # Zustand와 차이점
    
    Zustand는 기본적으로:
    
    - store 기반
    - selector 기반 구독
    
    구조입니다.
    
    예시:
    
    ```tsx
    const double = useStore(
      (state) => state.count * 2
    )
    ```
    
    ---
    
    # Zustand의 한계
    
    selector 내부 계산은 가능하지만:
    
    ```
    "상태 간 의존성 그래프"
    ```
    
    를 명시적으로 관리하지 않습니다.
    
    즉:
    
    - 어떤 값이 어떤 값에 의존하는지
    - 어떤 계산을 재사용 가능한지
    
    를 atom 단위처럼 추적하지 않음
    
    ---
    
    # Jotai의 장점
    
    ## 1. 의존성 기반 자동 재계산
    
    필요한 atom만 재계산
    
    ---
    
    ## 2. 파생 상태 재사용 쉬움
    
    ```tsx
    const filteredTodosAtom = atom(...)
    const completedTodosAtom = atom(...)
    ```
    
    처럼 조합 가능
    
    ---
    
    ## 3. 계산 단위가 매우 세밀함
    
    atom 단위로 업데이트 추적
    
    ---
    
    # 비유
    
    ## Zustand
    
    ```
    큰 store에서 selector로 필요한 값 꺼내기
    ```
    
    ---
    
    ## Jotai
    
    ```
    작은 atom들을 연결해 dependency graph 구성
    ```
    
    ---
    
    # 성능 관점 차이
    
    Jotai는:
    
    ```
    "상태 간 의존성을 기준으로 최소 재계산"
    ```
    
    에 강점이 있습니다.
    
    특히:
    
    - 복잡한 파생 상태
    - 계산 기반 상태
    - 여러 상태 조합
    
    이 많을수록 장점이 커짐
    
    ---
    
    # 핵심 요약
    
    ## Jotai
    
    ```
    atom 간 의존성을 자동 추적
    ```
    
    ---
    
    ## 장점
    
    ```
    파생 상태 재계산을 최소화 가능
    ```
    
    ---
    
    ## Zustand 대비 차이
    
    | 항목 | Zustand | Jotai |
    | --- | --- | --- |
    | 상태 구조 | store 기반 | atom 기반 |
    | 파생 상태 | selector 계산 | atom 조합 |
    | 의존성 추적 | 제한적 | 자동 추적 |
    | 재계산 최적화 | selector 단위 | atom dependency 단위 |
- 서버 상태를 **`useEffect`**로 관리할 때 발생하는 캐싱/중복 요청/불일치 문제를 설명해보세요.
    
    # useEffect 기반 서버 상태 관리
    
    기본적인 fetch 방식:
    
    ```tsx
    useEffect(() => {
      fetch('/users')
        .then((res) => res.json())
        .then(setUsers)
    }, [])
    ```
    
    ---
    
    # 문제 1. 캐싱 부재
    
    `useEffect`는 기본적으로 데이터를 캐싱하지 않습니다.
    
    즉:
    
    ```
    컴포넌트가 다시 마운트될 때마다
    API 요청 발생 가능
    ```
    
    ---
    
    # 예시
    
    ```
    페이지 이동
    ↓
    컴포넌트 unmount
    ↓
    다시 진입
    ↓
    재요청 발생
    ```
    
    ---
    
    # 결과
    
    - 불필요한 네트워크 요청 증가
    - 사용자 경험 저하
    - 로딩 반복
    
    ---
    
    # 문제 2. 중복 요청 발생
    
    여러 컴포넌트가 같은 데이터를 요청하면:
    
    ```
    <UserList/>
    <UserProfile/>
    ```
    
    둘 다:
    
    ```
    fetch('/users')
    ```
    
    를 실행할 수 있음
    
    ---
    
    # 결과
    
    ```
    같은 API 중복 호출
    ```
    
    발생 가능
    
    ---
    
    # 왜 문제인가?
    
    - 서버 부하 증가
    - 네트워크 낭비
    - 성능 저하
    
    ---
    
    # 문제 3. 데이터 불일치(stale state)
    
    각 컴포넌트가:
    
    - 독립적으로 fetch
    - 독립적으로 state 저장
    
    하기 때문에:
    
    ```
    동일 데이터라도 서로 다른 시점의 값 보유 가능
    ```
    
    ---
    
    # 예시
    
    ```
    A 컴포넌트 → 이전 데이터
    B 컴포넌트 → 최신 데이터
    ```
    
    ---
    
    # 결과
    
    UI 일관성 깨질 가능성 존재
    
    ---
    
    # 문제 4. 로딩/에러 상태 반복 관리
    
    매번:
    
    ```
    const [loading, setLoading]
    const [error, setError]
    ```
    
    직접 관리 필요
    
    ---
    
    # 문제 5. race condition 가능성
    
    빠르게 요청이 여러 번 발생하면:
    
    ```
    늦게 끝난 이전 요청이
    최신 데이터를 덮어쓸 가능성
    ```
    
    존재
    
    ---
    
    # 예시
    
    ```
    요청 A 시작
    요청 B 시작
    ↓
    B 먼저 완료
    ↓
    A 나중 완료
    ↓
    오래된 데이터가 최신 데이터 덮어씀
    ```
    
    ---
    
    # 해결을 위해 등장한 라이브러리
    
    대표적으로:
    
    - TanStack Query
    - RTK Query
    - SWR
    
    등이 등장
    
    ---
    
    # 이런 라이브러리들이 해결하는 것
    
    ## 1. 캐싱
    
    같은 데이터 재사용
    
    ---
    
    ## 2. 중복 요청 제거
    
    동일 요청 dedupe
    
    ---
    
    ## 3. background refetch
    
    백그라운드 자동 최신화
    
    ---
    
    ## 4. stale 관리
    
    데이터 freshness 관리
    
    ---
    
    ## 5. loading/error 상태 자동 관리
    
    반복 코드 감소
    
    ---
    
    # 핵심 요약
    
    ## useEffect 기반 서버 상태 관리 문제
    
    - 캐싱 없음
    - 중복 요청 가능
    - 데이터 불일치 가능
    - loading/error 반복 관리
    - race condition 가능
    
    ---
    
    # 근본 원인
    
    ```
    useEffect는 "서버 상태 관리 도구"가 아니기 때문
    ```
    
    ---
    
    # 현대 React 권장 방식
    
    서버 상태는:
    
    - TanStack Query
    - RTK Query
    - SWR
    
    등 전용 라이브러리 사용 권장