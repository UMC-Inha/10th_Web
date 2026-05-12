- `gcTime`은 무엇인가요? 🍠
    <aside>
    💡
    
    “쓰지 않는 데이터를 얼마나 오래 메모리에 둘 건가?”(메모리 관리)
    
    </aside>
    
    → 캐시를 메모리에서 지우기까지의 기간
    
    → 컴포넌트가 언마운트 후 이 시간 뒤 삭제

- `staleTime`은 무엇인가요? 🍠
    <aside>
    💡
    
    “데이터를 얼마나 믿을 건가?”
    
    </aside>
    
    → 데이터가 신선한 기간으로 이 안에서는 네트워크 요청 없이 캐시 사용이 가능함

- 두 값을 어떤 식으로 설정하여야 `캐싱 전략에 유리`한가요? 🍠
  `staleTime` ≤ `gcTime`이 되어야 한다.

// 기존 워크북에 더 추가한 내용들

- 오프셋 기반 페이지네이션 (Offset-based Pagination)

  # 오프셋 기반 페이지네이션 (Offset-based Pagination)

  ***

  ### 1. 원리: "몇 번째부터 몇 개”

  오프셋 기반 페이지네이션은 흔히 **"숫자 페이지 매기기"** 방식이라고 불려요. 여러분이 웹사이트 하단에서 흔히 보셨던 **[1] [2] [3] ...** 형태의 페이지 이동 방식이 바로 이것이에요.
  이 방식은 데이터베이스의 쿼리에서 사용하는 `OFFSET`과 **`LIMIT`** 구문을 활용하는 것이 핵심이에요.
  - **`LIMIT`**: 한 페이지에 보여줄 데이터의 **개수** (예: 10개)
  - **`OFFSET`**: 데이터를 건너뛸 **시작점** (예: 앞에서부터 20개를 건너뛰고 시작)
    ⇒ 위의 말은 3페이지를 가져온다는 뜻
    **프론트에서의 요청**

  ```tsx
  /api/posts?page=3&size=10

  //뜻
  // 3페이지 주세요.
  // 한 페이지에는 10개씩 주세요
  ```

  **예시 원리**
  1. **1페이지 요청**: `OFFSET 0`, `LIMIT 10`
  2. **2페이지 요청**: `OFFSET 10`, `LIMIT 10`
  3. **3페이지 요청**: `OFFSET 20`, `LIMIT 10`

  ***

  ### 2. 서버와 클라이언트의 통신

  **2-1. 클라이언트의 요청 (프론트엔드)**
  클라이언트는 보통 페이지 번호 (`page`)와 한 페이지 당 항목 수 (`limit` 또는 `size`)를 쿼리 파라미터로 서버에 요청해요.

  ```tsx
  // 3페이지를 요청하는 URL
  // 'limit'은 보통 서버의 기본값으로 두기도 합니다.
  const pageNumber = 3;
  const pageSize = 10;
  const url = `/api/posts?page=${pageNumber}&size=${pageSize}`;
  // size = limit
  ```

  **2-2. 서버의 처리 (백엔드 - SQL 기준)**
  서버는 전달받은 `page`와 `size`를 이용해 실제 `OFFSET` 값을 계산해요.

  ```sql
  -- 3페이지 (size=10) 요청 시
  -- OFFSET = (3 - 1) * 10 = 20

  SELECT * FROM posts
  ORDER BY created_at DESC  -- 정렬 기준이 있어야 순서가 일정해요.
  LIMIT 10
  OFFSET 20;
  ```

  ***

  ### 3. 주의점: 고질적인 문제점

  오프셋 기반은 구현이 매우 직관적이지만, 치명적인 단점이 있어요.
  **3-1. 데이터 중복/누락 문제 (가장 중요!)**
  페이지를 이동하는 사이에 새로운 데이터가 추가되거나 기존 데이터가 삭제/변경되면, **데이터의 순서가 밀리거나 당겨져서** 사용자가 이미 본 데이터를 다시 보거나, 일부 데이터를 건너뛰고 못 볼 수 있어요.

  ```tsx
  처음 데이터
  [100] [99] [98] [97] [96] [95] [94] [93] [92] [91]

  1페이지에서 100~91번 글 확인

  그런데 2페이지로 넘어가기 전에 새 글이 추가됨.

  [101] [100] [99] [98] [97] [96] [95] [94] [93] [92] [91]

  이제 2페이지는 “앞에서 10개 건너뛰기”를 하니까
  101~92를 건너뛰고 91부터 시작할 수 있음.

  근데 91은 이미 봤던 글

  따라서 중복이 생길 수 있음
  ```

  **3-2. 느려지는 성능 (깊은 페이지)**
  `OFFSET` 값이 커질수록 (뒤 페이지로 갈수록), 데이터베이스는 이전의 모든 레코드(row)를 건너뛰어야 하기 때문에 쿼리 성능이 **점점 느려져요.**
  수백만 건의 데이터베이스에서는 이 문제가 심각해질 수 있어요.

- 커서 기반 페이지네이션 (Cursor-based Pagination)

  # 커서 기반 페이지네이션 (Cursor-based Pagination)

  커서 기반 페이지네이션은 앞에서 살펴본 오프셋 기반의 고질적인 단점, 즉 **데이터 누락/중복**과 **깊은 페이지에서의 성능 저하** 문제를 해결하기 위해 등장한 방식이에요.
  특히 실시간으로 데이터가 끊임없이 추가되는 **무한 스크롤(Infinite Scroll)** 구현에 가장 적합한 방식이랍니다.

  ***

  ### 1. 원리: “마지막 항목 다음부터”

  커서 기반은 "**마지막으로 조회한 데이터의 위치"**를 다음 페이지를 시작할 **기준점(커서)**으로 활용해요.
  마치 책갈피처럼, 내가 어디까지 읽었는지를 표시하고 그 다음부터 읽기 시작하는 원리라고 생각하시면 이해하기 쉬워요.
  - **커서(Cursor)**: 보통 데이터의 **고유하고 순서가 있는 값**을 사용해요. 예를 들어, **고유 ID**(`id`)나 **생성 시각**(`created_at`의 타임스탬프) 등이 커서가 될 수 있어요.
  - **요청 방식**: 클라이언트는 서버에 "이전 페이지의 마지막 항목 커서 값을 기준으로, 그 다음 데이터 10개를 줘"라고 요청합니다.
  **핵심 문장**
    <aside>
    💡
    
    ***내가 마지막으로 본 것 다음부터 가져와***
    
    </aside>
    
    **예시 원리** (데이터를 최신순으로 정렬했을 경우)
    
    1. **1페이지 요청**: 커서 없음. (가장 최신 데이터부터 `LIMIT 10`)
    2. **2페이지 요청**: 1페이지의 마지막 게시물 ID (커서)를 전달하여, **해당 ID보다 작은 (더 오래된) 데이터** 10개를 요청합니다.
    3. **3페이지 요청**: 2페이지의 마지막 게시물 ID (커서)를 전달하여, **해당 ID보다 작은** 데이터 10개를 요청합니다.
    
    ```tsx
    마지막으로 본 게시글 ID가 95야.
    그러면 95보다 오래된 글 10개 줘.
    ```
    
    **프론트에서의 요청**
    
    ```tsx
    // 처음 요청
    /api/posts?size=10
    
    // 서버 응답
    [105] [104] [103] [102] [101] [100] [99] [98] [97] [96]
    // 마지막 글이 96
    
    //다음 요청
    /api/posts?after=96&size=10
    // 뜨시 96 다음부터 10개 줘
    
    // 서버 조회
    WHERE id < 96
    ORDER BY id DESC
    LIMIT 10;
    
    // 응답
    [95] [94] [93] [92] [91] [90] [89] [88] [87] [86]
    ```
    
    ---
    
    ### 2. 서버와 클라이언트의 통신
    
    **2-1. 클라이언트의 요청 (프론트엔드)**
    
    클라이언트는 다음 페이지를 요청할 때, **페이지 번호 대신** 이전에 받아온 목록에서 **가장 마지막 항목의 커서 값** (`after` 또는 `last_id`)을 쿼리 파라미터로 서버에 전달해요.
    
    ```jsx
    // 이전에 받아온 목록의 마지막 게시물 ID가 95라고 가정합니다.
    const lastCursorId = 95;
    const pageSize = 10;
    // 'after'라는 쿼리 파라미터에 커서 값을 담아 전달합니다.
    const url = `/api/posts?after=${lastCursorId}&size=${pageSize}`;
    ```
    
    **2-2. 서버의 처리 (백엔드 - SQL 기준)**
    
    서버는 전달받은 커서 값을 이용하여 데이터베이스의 **`WHERE`** 절을 사용해 직접 다음 시작점을 지정해요. 이 방식이 성능에 큰 이점을 가져다줍니다.
    
    ```sql
    -- 마지막으로 본 게시물 ID가 95이고, ID 내림차순(최신순)으로 정렬했을 경우
    
    SELECT * FROM posts
    WHERE id < 95             -- ID가 95보다 작은 (즉, 더 오래된) 데이터만 가져옵니다.
    ORDER BY id DESC          -- 내림차순 정렬을 유지합니다.
    LIMIT 10;                 -- 10개만 가져옵니다.
    
    // 뜻
    // ID가 95보다 작은 글 중에서,
    // 최신순으로 10개만 가져와.
    // 이때 ID 95가 바로 cursor 즉, 책갈피라고 할 수 있음
    ```
    
    ---
    
    ### 3. 장점: 커서 기반의 매력
    
    커서 기반 페이지네이션이 오프셋 기반의 단점을 어떻게 극복하는지 살펴볼게요.
    
    **1. 데이터 중복/누락 문제 해결 (👍 일관성 유지)**
    
    데이터를 가져오는 기준이 '건너뛴 개수'가 아니라 '특정 항목의 값(커서)'이기 때문에, 페이지를 불러오는 사이에 **새로운 데이터가 추가되더라도** (예: ID 96, 97이 추가) 이미 `ID < 95`라는 조건으로 조회하고 있다면 **사용자가 보던 흐름에는 영향을 주지 않습니다.** 
    
    데이터의 일관성을 완벽하게 유지할 수 있어요.
    
    **2. 우수한 성능 (페이지가 깊어져도 OK!)**
    
    `WHERE` 절에서 사용되는 커서 값(`id < 95`)은 데이터베이스의 인덱스(Index)를 활용하기 때문에 매우 빠르게 원하는 위치를 찾을 수 있어요. 수백만 건의 데이터를 가진 테이블이라도 깊은 페이지로 이동할 때 **이전 데이터를 모두 건너뛸 필요가 없어서** 쿼리 속도 저하 없이 일관되게 빠른 성능을 유지할 수 있습니다.
    
    ---
    
    ### 4. 주의점 : 커서 기반의 한계
    
    커서 기반은 성능과 일관성 면에서 뛰어나지만, 만능은 아닙니다.
    
    **1. 랜덤 접근 불가**
    
    커서 기반은 **[1] [2] [3]**과 같은 페이지 번호를 제공하고, 사용자가 **특정 페이지(예: 50페이지)**를 클릭해 바로 이동하는 **랜덤 접근(Random Access)**이 기본적으로 **불가능**해요. 다음 페이지를 요청하려면 반드시 이전 페이지의 마지막 커서 값이 필요하기 때문이에요. 이 때문에 일반적인 숫자 페이지네이션 UI보다는 무한 스크롤에 주로 사용됩니다.
    
    ```tsx
    오프셋은 이런 UI가 가능.
    [1] [2] [3] [4] [5] ... [50]
    
    왜냐하면 50페이지면:
    OFFSET = (50 - 1) × 10
    이렇게 계산하면 되기 때문
    
    그런데 커서는 “마지막으로 본 항목” 필
    
    50페이지로 바로 가려면 49페이지의 마지막 커서를 알아야 함
    ```
    
    ```tsx
    그래서 커서 방식은
    1. 무한 스크롤
    2. 더 보기 버튼
    3. 인스타 피드
    4. 유튜브 댓글
    5. 트위터 타임라인
    에 많이 사용됨
    ```
    
    **2. 복잡한 쿼리 조건**
    
    커서로 사용되는 정렬 기준(예: `id` 또는 `created_at`)이 하나가 아니라 여러 개일 경우(예: 좋아요 수(`likes`)가 같으면 생성 시각(`created_at`)으로 정렬), `WHERE` 절의 조건이 복잡하고 까다로워질 수 있어요.

- **useInfiniteQuery**
- 무한 스크롤을 쉽게 만들게 도와주는 도구
- **useInfiniteQuery** **핵심 구조**

  ```tsx
  useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
  ```

  ```tsx
  queryKey: ['posts'],
  // 데이터의 이름표로 React Query가 캐시에 저장할 때 post 데이터라는 것을 구분하는 키
  ```

  ```tsx
  queryFn: ({ pageParam }) => fetchPosts(pageParam);

  // 실제로 서버에 요청하는 함수
  // pageParam은 현재 가져올 페이지 정보

  // 오프셋 방식이면:
  pageParam = 1;
  pageParam = 2;
  pageParam = 3;

  // 커서 방식이면:
  pageParam = undefined;
  pageParam = 96;
  pageParam = 86;
  ```

  ```tsx
  initialPageParam: 1;
  // 첫 요청에 사용할 값
  // 즉: 처음에는 1페이지부터 시작한다는 뜻

  // 커서 방식이면 보통 null이나 undefined 줄 수 있
  ```

  ```tsx
  getNextPageParam: (lastPage) => lastPage.nextPage
  // 뜻:
  // 방금 받아온 마지막 페이지를 보고,
  // 다음 요청에 사용할 pageParam을 정해줘.

  // 예시: 아래와 같은 서버 응답 옴
  {
    posts: [...],
    nextCursor: 86
  }
  // 그러면
  getNextPageParam: (lastPage) => lastPage.nextCursor
  // 위처럼 쓰면 됨.

  // 다음 요청 때 pageParam이 86 됨
  ```

- `data.pages`는?

  `useInfiniteQuery`는 받아온 데이터를 이렇게 쌓아둠

  ```tsx
  data.pages[0] → 첫 번째로 받아온 데이터
  data.pages[1] → 두 번째로 받아온 데이터
  data.pages[2] → 세 번째로 받아온 데이터
  ```

  **예시**

  ```tsx
  data.pages = [
    { posts: [105, 104, 103] },
    { posts: [102, 101, 100] },
    { posts: [99, 98, 97] },
  ];

  // 화면에 보여줄 때는 합쳐서 보여줌
  data.pages.flatMap((page) => page.posts)[
    //결과
    (105, 104, 103, 102, 101, 100, 99, 98, 97)
  ];
  ```

- **useInfiniteQuery** 주요 옵션

  ### **useInfiniteQuery**의 주요 옵션
  - **주요 옵션들**
    - **queryKey**
      - 캐싱 및 식별을 위한 유니크 키 (배열 형태 권장)

        ```tsx
        // 사용 예시
        queryKey: ['posts']

        // 뜻
        queryKey는 데이터를 구분하는 이름표

        //React Query가 내부 캐시에 데이터를 저장할 때
        ['posts'] 데이터
        ['movies'] 데이터
        ['comments'] 데이터

        // 예시
        // 1. 게시글 목록
        queryKey: ['posts']
        // 2. 영화 목록
        queryKey: ['movies']
        // 3. 특정 카테고리 게시글
        queryKey: ['posts', category]
        // 4. 인기 게시글 목록 데이터
        queryKey: ['posts', 'popular']
        ```

      - 배열 권장 이유: 나중에 조건을 추가하기 쉽기 때문

      ```tsx
      queryKey: ['posts', category, keyword]

      // 예시
      queryKey: ['posts', 'popular', 'react']

      // 뜻
      posts 중에서 popular 카테고리이고 react 검색어가 들어간 데이터
      ```

    - **queryFn**
      - 페이지 정보를 받아 비동기 데이터 패칭 함수. 기본적으로 `pageParam` 값을 사용하며, 초기값을 설정할 수 있음.

      ```tsx
      queryFn: ({ pageParam }) => fetchPosts(pageParam)

      // 뜻
      queryFn은 실제로 서버에 요청하는 함수
      // 데이터를 가져오는 담당

      // 예시
      const fetchPosts = async (pageParam: number) => {
        const res = await fetch(`/api/posts?page=${pageParam}&size=10`);
        return res.json();
      };

      //useInfiniteQuery
      useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: ({ pageParam }) => fetchPosts(pageParam),
        initialPageParam: 1,
      });

      // 실제 요청
      /api/posts?page=1&size=10

      // 다음 페이지 불러오기
      /api/posts?page=2&size=10
      ```

    - **getNextPageParam**
      - 마지막 페이지 데이터를 바탕으로 다음 페이지의 `pageParam` 값을 결정하는 함수
      - 반환 값이 `false` 혹은 `undefined`이면 추가 페이지가 없음을 의미합니다.

      ```tsx
      getNextPageParam: (lastPage) => lastPage.nextPage

      // 뜻
      getNextPageParam은 다음 페이지 요청값을 정하는 함수

      // lastPage
      lastPage는 마지막으로 받아온 페이지 데이터

      // 예시
      {
        posts: ['A', 'B', 'C'],
        currentPage: 1,
        nextPage: 2
      }
      getNextPageParam: (lastPage) => lastPage.nextPage
      // 뜻
      마지막으로 받은 페이지의 nextPage 값을 다음 pageParam으로 써
      // 다음 요청
      pageParam = 2

      다음 페이지가 없으면
      {
        posts: ['X', 'Y', 'Z'],
        currentPage: 5,
        nextPage: undefined
      }
      getNextPageParam: (lastPage) => lastPage.nextPage
      // 결과는 undefined

      ```

      ```tsx
      커서 방식이면 페이지 번호가 아니라 마지막 데이터의 ID를 다음 요청값으로 씀.

      // 서버 응답
      {
        posts: [
          { id: 105, title: '글 105' },
          { id: 104, title: '글 104' },
          { id: 103, title: '글 103' }
        ],
        nextCursor: 103
      }
      // 그러면
      getNextPageParam: (lastPage) => lastPage.nextCursor

      // 다음 요청은
      /api/posts?cursor=103&size=10

      // 뜻
      103번 글 다음부터 ㄱㄱ
      ```

    - **getPreviousPageParam**
      - (필요한 경우) 이전 페이지의 파라미터를 결정하는 함수

      ```tsx
      getPreviousPageParam: (firstPage) => firstPage.prevCursor
      // 뜻
      이건 이전 페이지를 가져올 때 쓰는 값을 정하는 함수

      보통 무한 스크롤은 아래로 내려가면서 다음 페이지 가져옴
      이때는 getNextPageParam만 있어도 됨

      채팅 앱처럼 위로 올리면 이전 메시지를 불러와야 하는 경우 존재

      // 위로 스크롤하면 과거 메시지 불러오기

      // 예시
      useInfiniteQuery({
        queryKey: ['chat', roomId],
        queryFn: ({ pageParam }) => fetchMessages(pageParam),
        initialPageParam: null,
        getPreviousPageParam: (firstPage) => firstPage.prevCursor,
      });

      // 서버 응답
      {
        messages: [
          { id: 200, text: '안녕' },
          { id: 199, text: '뭐해' }
        ],
        prevCursor: 198
      }

      // 이전 페이지 요청값은: 198

      // 즉, 198번 이전 메시지부터 더 가져와.
      ```

    - **staleTime, cacheTime 등**
      - 일반 useQuery와 유사하게 데이터의 신선도 및 캐싱 전략을 설정할 수 있음

      ```tsx
      staleTime: 1000 * 60
      staleTime은 데이터를 신선하다고 보는 시간

      // 예시
      useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 60,
      });

      // 뜻
      게시글 목록은 1분 동안 신선한 데이터로 취급한다.
      ```

      ```tsx
      gcTime: 1000 * 60 * 5
      cacheTime 또는 gcTime은 사용하지 않는 데이터를 캐시에 얼마나 오래 남겨둘지 정하는 시간

      // 뜻
      이 데이터를 안 쓰게 된 뒤에도 5분 동안 캐시에 보관한다.

      // 예시
      staleTime: 1분
      gcTime: 5분
      // 뜻
      1분 동안은 신선함
      1분 지나면 오래된 데이터로 봄
      하지만 화면에서 사라져도 5분 동안 캐시에는 남아 있음
      ```

    - **refetchOnWindowFocus, enabled 등**
      - 조건부 패칭 및 자동 재요청 옵션들을 동일하게 활용 가능

      ```tsx
      refetchOnWindowFocus: true
      // 뜻
      브라우저 탭을 다시 클릭했을 때 데이터를 다시 가져올지 정하는 옵션

      // 예시
      다른 탭에 있다가 다시 돌아올 때
      React Query가
      사용자가 다시 돌아왔네?
      데이터 최신인지 다시 요청해볼까?
      하는 옵션

      refetchOnWindowFocus: true
      // 탭에 돌아왔을 때 재요청 가능
      refetchOnWindowFocus: false
      // 다시 돌아와도 자동 요청 안 함

      // 언제 false 함?
      // -> 게시글 목록처럼 조금 오래돼도 괜찮은 데이터
      ```

      ```tsx
      enabled: !!userId
      // 뜻
      enabled는 쿼리를 실행할지 말지 조건을 거는 옵션

      // 예시: 로그인한 유저의 게시글 가져오기
      useInfiniteQuery({
        queryKey: ['posts', userId],
        queryFn: ({ pageParam }) => fetchUserPosts(userId, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!userId,
      });

      // enabled: !!userId 의 뜻은 userId가 있을 때만 요청

      만약 userId가 아직 없으면?
      // API 요청 안 함
      userId가 생기면?
      // 그때 API 요청 시작

      왜 필요하냐?
      /api/users/undefined/posts
      즉, 아직 값이 없는데 요청해버리는 상황을 막아줌
      ```
