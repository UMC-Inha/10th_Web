- **`useCallabck`** 에 대하여 정리해주세요! 🍠

  # **`useCallabck`** 에 대하여 정리해주세요! 🍠

  ***
  - **`useCallabck`** 이 무엇인지? 🍠

    # **`useCallabck`** 이 무엇인지?

    ***
    - 함수(콜백)를 “메모이제이션” 한다는 게 무슨 뜻인지?
      메모이제이션이란 **이전에 만들어둔 값을 기억해두고, 조건이 같으면 다시 만들지 않고 재사용하는 것**입니다.
      `useCallback`에서는 값이 아니라 **함수의 참조**를 기억합니다.

      ```tsx
      const fn1 = () => {};
      const fn2 = () => {};

      console.log(fn1 === fn2); // false
      ```

      함수 내용이 같아도 새로 만들면 다른 함수입니다.
      `useCallback`은 이런 상황에서 함수가 매번 새로 만들어지는 것을 막아줍니다.

    - 언제 새 함수를 만들고, 언제 기존 함수를 재사용하는지?
      ```tsx
      const handleClick = useCallback(() => {
        console.log(count);
      }, [count]);
      ```
      | 상황                                     | 결과             |
      | ---------------------------------------- | ---------------- |
      | `count`가 그대로임                       | 기존 함수 재사용 |
      | `count`가 변경됨                         | 새 함수 생성     |
      | 컴포넌트가 리렌더링됐지만 deps 변화 없음 | 기존 함수 재사용 |
      즉, `useCallback`은 **의존성 배열에 들어간 값이 바뀔 때만 새 함수를 만듭니다.**

  - 왜 **`useCallabck`**을 사용하는지? 🍠

    # 왜 **`useCallabck`**을 사용하는지?

    ***
    - **불필요한 리렌더링 방지**와 어떤 관련이 있는지

      ```tsx
      // 부모 컴포넌트가 자식에게 함수를 props로 넘긴다고 할 때
      function Parent() {
        const handleClick = () => {
          console.log("click");
        };

        return <Child onClick={handleClick} />;
      }
      // 부모가 리렌더링될 때마다 handleClick은 새로 만들어짐
      // 그러면 자식 입장에서는 아래와 같음
      이전 onClick !== 새로운 onClick
      ```

      만약 자식 컴포넌트가 `memo`로 감싸져 있어도, props로 받은 함수의 참조가 바뀌면 다시 렌더링될 수 있습니다.

      ```tsx
      const Child = memo(({ onClick }) => {
        console.log('Child 렌더링');
        return <button onClick={onClick}>클릭</button>;
      });
      ```

      이때 부모에서 useCallback을 사용하면

      ```tsx
      const handleClick = useCallback(() => {
        console.log("click");
      }, []);
      hadleClick의 참조가 유지돼요!

      그래서 자식 컴포넌트의 불필요한 리렌더링을 줄일 수 있습니다
      ```

    - 성능 최적화 관점에서 얻는 이득 vs 남용했을 때의 오버헤드
      `useCallback`을 쓰면 좋은 경우는 보통 이럴 때입니다.
      | 상황 | 효과 |
      | ------------------------------------------------------------------- | -------------------------------- |
      | `memo`로 감싼 자식에게 함수를 props로 넘길 때 | 자식 리렌더링 방지 가능 |
      | `useEffect` 의존성 배열에 함수를 넣어야 할 때 | effect 반복 실행 방지 |
      | 커스텀 훅에서 함수를 반환할 때 | 사용하는 쪽에서 참조 안정성 확보 |
      | 디바운스/스로틀 함수가 렌더링마다 새로 만들어지는 것을 막고 싶을 때 | 이벤트 최적화 가능 |
      남용했을 때의 오버헤드
      `useCallback`을 많이 쓴다고 무조건 좋은 것은 아닙니다. `useCallback`도 내부적으로 의존성 배열을 비교하고, 이전 함수를 기억해야 합니다.
      즉, 약간의 비용이 있습니다.
      React 공식 문서에서도 `memo`는 컴포넌트가 같은 props로 자주 리렌더링되고 렌더링 비용이 클 때 가치가 있으며, props가 항상 새로 만들어지면 효과가 없다고 설명합니다.
      따라서 아래처럼 단순한 함수에는 굳이 필요 없습니다.

      ```tsx
      function Button() {
        const handleClick = () => {
          alert('click');
        };

        return <button onClick={handleClick}>클릭</button>;
      }
      ```

      이 경우 자식에게 props로 넘기는 것도 아니고, 렌더링 비용도 크지 않기 때문에 `useCallback`을 쓰지 않아도 됩니다.

  - **`useCallabck`** 기본 사용법 🍠

    # **`useCallabck`** 기본 사용법

    ***
    - **`useCallabck`**은 어떻게 사용하나요? (코드)

      ```tsx
      import { useCallback, useState } from 'react';

      function Counter() {
        const [count, setCount] = useState(0);

        const handleIncrease = useCallback(() => {
          setCount((prev) => prev + 1);
        }, []);

        return <button onClick={handleIncrease}>증가</button>;
      }
      ```

      여기서 `handleIncrease`는 컴포넌트가 리렌더링되어도 다시 만들어지지 않습니다.
      왜냐하면 deps 배열이 빈 배열이기 때문입니다.

      ```tsx
      }, []);
      ```

    - `deps` 배열에 무엇을 넣어야 하는지 규칙
        <aside>
        🚨
        
        **콜백 함수 안에서 사용하는 외부 값은 deps 배열에 넣어야 합니다.**
        
        </aside>
        
        ```tsx
          console.log(count);
        }, [count]);
        
        count를 함수 안에서 사용했기 때문에 [count]에 넣어야 합니다.
        
        props도 마찬가지입니다.
        
        function UserButton({ userId }: { userId: number }) {
          const handleClick = useCallback(() => {
            console.log(userId);
          }, [userId]);
        
          return <button onClick={handleClick}>유저 확인</button>;
        }
        ```

    - 의존성 변경 시 콜백이 어떻게 다시 만들어지는지
      ```tsx
      const handleClick = useCallback(() => {
        console.log(count);
      }, [count]);
      ```
      `count`가 0일 때 만들어진 함수는 `count`가 0인 상태를 기억합니다.
      이후 `count`가 1로 바뀌면 React는 새 함수를 만듭니다.
      즉:
      ```tsx
      count 변경 전 함수 !== count 변경 후 함수
      ```
      가 됩니다.

  - **`useCallabck`**에서 중요한 개념 🍠

    # **`useCallabck`**에서 중요한 개념

    ***
    - **참조 동일성(reference equality)** 이 왜 중요한지 (=== 비교)
      참조 동일성이란 `===` 비교했을 때 같은지를 의미합니다.

      ```tsx
      const a = () => {};
      const b = () => {};

      console.log(a === b); // false
      ```

      함수 내용은 같아도 참조가 다르면 다른 함수입니다.
      React에서 `memo`, `useEffect` deps, props 비교는 이 참조 동일성과 깊은 관련이 있습니다.

    - 클로저와 상태: 콜백 안에서 state, props를 사용할 때 주의할 점
      함수는 만들어질 당시의 값을 기억합니다.
      ```tsx
      const handleClick = useCallback(() => {
        console.log(count);
      }, []);
      ```
      이 코드는 문제가 생길 수 있습니다.
      왜냐하면 `count`를 사용했는데 deps 배열에 넣지 않았기 때문입니다. 그러면 `handleClick`은 처음 렌더링 때의 `count`만 기억할 수 있습니다.
      이것을 **stale closure**, 즉 낡은 값 캡처 문제라고 합니다.
    - **stale closure(낡은 값 캡처)** 문제는 언제 생기는지, 어떻게 피하는지

      ```tsx
      function Counter() {
        const [count, setCount] = useState(0);

        const handleAlert = useCallback(() => {
          alert(count);
        }, []);

        return (
          <>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>증가</button>
            <button onClick={handleAlert}>현재 값 확인</button>
          </>
        );
      }
      ```

      `count`가 5가 되어도 alert에는 0이 나올 수 있습니다. 이유는 `handleAlert`가 처음 만들어질 때의 `count`를 기억하고 있기 때문입니다.

      ```tsx
      const handleAlert = useCallback(() => {
        alert(count);
      }, [count]);
      ```

      - stale closure 피하는 방법
        ### 방법 1. deps에 필요한 값을 정확히 넣기
        ```
        const handleClick = useCallback(() => {
          console.log(count);
        }, [count]);
        ```
        ### 방법 2. 이전 state를 기준으로 업데이트할 때는 함수형 업데이트 사용
        ```
        const handleIncrease = useCallback(() => {
          setCount((prev) => prev + 1);
        }, []);
        ```
        이렇게 하면 `count`를 직접 참조하지 않기 때문에 deps에 `count`를 넣지 않아도 됩니다.

  - **`useCallabck`**을 사용한 콜백 메모이제이션 예시 🍠

    # **`useCallabck`**을 사용한 콜백 메모이제이션 예시

    ***
    - 부모에서 자식으로 콜백을 내려줄 때, `onClick`, `onChange` 같은 핸들러를 **`useCallabck`** 없이 넘겼을 때와 **`useCallabck`**으로 감싸서 넘겼을 때 차이
      1. `useCallback` 없이 넘기는 경우

         ```tsx
         import { memo, useState } from 'react';

         const Child = memo(({ onClick }: { onClick: () => void }) => {
           console.log('Child 렌더링');

           return <button onClick={onClick}>자식 버튼</button>;
         });

         function Parent() {
           const [count, setCount] = useState(0);
           const [text, setText] = useState('');

           const handleClick = () => {
             console.log('자식 버튼 클릭');
           };

           return (
             <div>
               <p>count: {count}</p>

               <button onClick={() => setCount(count + 1)}>
                 부모 count 증가
               </button>

               <input value={text} onChange={(e) => setText(e.target.value)} />

               <Child onClick={handleClick} />
             </div>
           );
         }

         // 이 경우 text만 바뀌어도 Parent가 리렌더링됩니다.
         // 그러면 handleClick 함수가 새로 만들어집니다.
         // 그래서 Child는 memo로 감싸져 있어도 다시 렌더링될 수 있습니다.
         ```

      2. `useCallback`으로 감싼 경우

      ```tsx
      import { memo, useCallback, useState } from 'react';

      const Child = memo(({ onClick }: { onClick: () => void }) => {
        console.log('Child 렌더링');

        return <button onClick={onClick}>자식 버튼</button>;
      });

      function Parent() {
        const [count, setCount] = useState(0);
        const [text, setText] = useState('');

        const handleClick = useCallback(() => {
          console.log('자식 버튼 클릭');
        }, []);

        return (
          <div>
            <p>count: {count}</p>

            <button onClick={() => setCount(count + 1)}>부모 count 증가</button>

            <input value={text} onChange={(e) => setText(e.target.value)} />

            <Child onClick={handleClick} />
          </div>
        );
      }

      // 이제 Parent가 리렌더링되어도 handleClick의 참조가 유지됩니다.
      // 따라서 Child는 props가 바뀌지 않았다고 판단할 수 있습니다.
      ```

  - 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시 🍠

    # 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시

    ***
    - 버튼 클릭 시 API 호출하는 핸들러를 `useCallback`으로 감싸는 패턴

      ```tsx
      import { useCallback, useState } from 'react';

      function UserSearch() {
        const [keyword, setKeyword] = useState('');

        const handleSearch = useCallback(async () => {
          const response = await fetch(`/api/users?keyword=${keyword}`);
          const data = await response.json();

          console.log(data);
        }, [keyword]);

        return (
          <div>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button onClick={handleSearch}>검색</button>
          </div>
        );
      }
      ```

      `handleSearch`는 `keyword`를 사용하므로 deps에 `[keyword]`를 넣어야 합니다.

    - `useEffect` 안에서 의존성으로 콜백을 넣을 때 패턴

      ```tsx
      import { useCallback, useEffect, useState } from 'react';

      function UserList() {
        const [page, setPage] = useState(1);
        const [users, setUsers] = useState([]);

        const fetchUsers = useCallback(async () => {
          const response = await fetch(`/api/users?page=${page}`);
          const data = await response.json();

          setUsers(data);
        }, [page]);

        useEffect(() => {
          fetchUsers();
        }, [fetchUsers]);

        return (
          <div>
            <button onClick={() => setPage((prev) => prev + 1)}>
              다음 페이지
            </button>
          </div>
        );
      }
      ```

      흐름

      ```tsx
      page 변경
      → fetchUsers 새로 생성
      → useEffect 다시 실행
      → 새 page 기준으로 API 요청
      ```

    - 폼 제출 핸들러, 디바운스/스로틀 함수와 함께 사용할 때

      ```tsx
      import { useCallback, useState } from 'react';

      function LoginForm() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = useCallback(
          async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            await fetch('/api/login', {
              method: 'POST',
              body: JSON.stringify({ email, password }),
            });
          },
          [email, password],
        );

        return (
          <form onSubmit={handleSubmit}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">로그인</button>
          </form>
        );
      }
      ```

      `email`, `password`를 사용하므로 deps에 둘 다 넣어야 합니다.

- **`memo`**에 대하여 정리해주세요!🍠

  # **`memo`**에 대하여 정리해주세요!🍠

  ***
  - **`memo`**가 무엇인지? 🍠

    # **`memo`**가 무엇인지?

    ***

      <aside>
      🚨
      
      `memo`는 컴포넌트를 메모이제이션하는 기능입니다.
      
      </aside>
      
      ```tsx
      import { memo } from "react";
      
      const Child = memo(function Child({ name }: { name: string }) {
        console.log("Child 렌더링");
      
        return <div>{name}</div>;
      });
      ```
      
      `memo`로 감싼 컴포넌트는 props가 바뀌지 않으면 리렌더링을 건너뛸 수 있습니다.
      
      즉, `useCallback`이 함수를 기억한다면, `memo`는 컴포넌트의 렌더링 결과를 재사용하는 데 도움을 줍니다.
      
      React 공식 문서에서도 `memo`는 props가 바뀌지 않았을 때 컴포넌트 리렌더링을 건너뛰게 해주는 API라고 설명합니다.

  - 왜 **`memo`**를 사용하는지? 🍠

    # 왜 **`memo`**를 사용하는지?

    ***

      <aside>
      🚨
      
      부모 컴포넌트가 리렌더링되면 기본적으로 자식 컴포넌트도 다시 렌더링될 수 있습니다.
      
      </aside>
      
      ```tsx
      function Parent() {
        const [count, setCount] = useState(0);
      
        return (
          <>
            <button onClick={() => setCount(count + 1)}>
              증가
            </button>
      
            <Child name="철수" />
          </>
        );
      }
      ```
      
      `count`가 바뀌면 `Parent`가 리렌더링됩니다.
      
      그러면 `Child`의 props인 `name`은 그대로여도 `Child`가 다시 렌더링될 수 있습니다.
      
      이때 `Child`를 `memo`로 감싸면:
      
      ```tsx
      const Child = memo(function Child({ name }) {
        return <div>{name}</div>;
      });
      ```
      
      props가 그대로라면 렌더링을 건너뛸 수 있습니다.

  - **`memo`** 기본 사용법 🍠

    # **`memo`** 기본 사용법

    ***

    ```tsx
    import { memo } from 'react';

    type ProfileProps = {
      name: string;
      age: number;
    };

    const Profile = memo(function Profile({ name, age }: ProfileProps) {
      console.log('Profile 렌더링');

      return (
        <div>
          <p>이름: {name}</p>
          <p>나이: {age}</p>
        </div>
      );
    });

    export default Profile;
    ```

    사용할 때

    ```tsx
    function App() {
      return <Profile name="철수" age={20} />;
    }
    ```

    `name`, `age`가 바뀌지 않으면 `Profile`은 리렌더링을 건너뛸 수 있습니다.

  - **`memo`**를 언제 쓰면 좋은지 / 안 좋은지 🍠

    # **`memo`**를 언제 쓰면 좋은지 / 안 좋은지

    ***

    ### 쓰면 좋은 경우

    | 상황                              | 이유                                      |
    | --------------------------------- | ----------------------------------------- |
    | 자식 컴포넌트가 자주 리렌더링됨   | 불필요한 렌더링을 줄일 수 있음            |
    | 자식 컴포넌트의 렌더링 비용이 큼  | 성능 이득이 생길 수 있음                  |
    | props가 자주 바뀌지 않음          | `memo`가 효과적으로 작동함                |
    | 리스트 아이템 컴포넌트            | 많은 아이템의 불필요한 리렌더링 방지 가능 |
    | 부모 state 변경이 자식과 관계없음 | 자식 렌더링을 건너뛸 수 있음              |

    예시

    ```tsx
    const TodoItem = memo(function TodoItem({ todo, onToggle }) {
      console.log('TodoItem 렌더링');

      return <li onClick={() => onToggle(todo.id)}>{todo.title}</li>;
    });
    ```

    ### 쓰면 안 좋거나 효과가 적은 경우
    1. props가 매번 바뀌는 경우

       ```tsx
       <Child user={{ name: '철수' }} />
       // 객체가 매번 새로 만들어지기 때문에 memo 효과가 거의 없음
       ```

    2. 컴포넌트가 너무 단순한 경우

       ```tsx
       const Title = memo(({ text }) => {
         return <h1>{text}</h1>;
       });
       // 이 정도로 단순한 컴포넌트는 memo를 쓰는 비용이 더 의미 없음
       ```

    3. 무조건 모든 컴포넌트에 적용하는 경우

       `memo`가 많아지면 코드가 복잡해지고, props 비교 비용도 생깁니다.

       즉, 성능 최적화가 아니라 오히려 가독성을 떨어뜨릴 수 있습니다.

- **`useMemo`** 에 대하여 정리해주세요! 🍠

  # **`useMemo`** 에 대하여 정리해주세요! 🍠

  ***
  - **`useMemo`**가 무엇인지? 🍠

    # **`useMemo`**가 무엇인지? 🍠

    ***

      <aside>
      🚨
      
      `useMemo`는 **계산 결과를 메모이제이션(Memoization)하는 React Hook**입니다.
      
      컴포넌트가 리렌더링될 때마다 특정 계산을 다시 수행하지 않고, **이전에 계산한 값을 재사용**할 수 있도록 도와줍니다.
      
      ```tsx
      const memoizedValue = useMemo(() => {
        return 계산결과;
      }, [deps]);
      ```
      
      여기서 중요한 점 두가지 입니다.
      
      - `useCallback` → 함수 자체를 기억
      - `useMemo` → 함수 실행 결과(값)를 기억
      
      예
      
      ```tsx
      const result = useMemo(() => {
        return 1 + 1;
      }, []);
      처음 렌더링 때는 계산을 수행합니다.
      
      1 + 1 = 2
      
      // 이후 리렌더링이 발생해도 deps가 바뀌지 않았다면 기존 계산 결과(2)재사용 합니다.
      ```
      
      </aside>
      
      ## 메모이제이션(Memoization)이란?
      
      <aside>
      🚨
      
      이전에 계산한 결과를 저장해두고, 같은 입력값이 들어오면 다시 계산하지 않고 재사용하는 기법입니다.
      
      </aside>
      
      예시
      
      ```tsx
      10만 개 데이터를 필터링하는 작업이 있다고 가정해봅시다.
      
      const filtered = data.filter(...)
      
      컴포넌트가 리렌더링될 때마다 필터링을 다시 수행하면 성능이 낭비됩니다. 이럴 때 `useMemo`를 사용하면 됩니다.
      ```

  - 왜 **`useMemo`**를 사용하는지? 🍠

    # 왜 **`useMemo`**를 사용하는지? 🍠

    ***
    - 비싼 계산(Expensive Calculation) 최적화
      - 가장 대표적인 목적
        예시

      ```tsx
      const sortedList = useMemo(() => {
        return users.sort(...);
      }, [users]);

      // 만약 users가 10,000개라면 정렬 비용이 큼

      // 리렌더링될 때마다 다시 정렬하면 불필요한 CPU를 사용합니다.

      // `useMemo`를 사용하면 users가 바뀔 때만 정렬하게 됩니다.
      ```

    - 참조 동일성 유지
      - 실제로 React에서 더 많이 사용
        예시

      ```tsx
      const user = {
        name: "철수",
      };

      // 컴포넌트가 리렌더링될 때마다 새 객체가 생성됩니다.

      이전 user !== 새로운 user

      // 그래서 `memo`가 깨질 수 있습니다.
      ```

      해결방법

      ```tsx
      const user = useMemo(() => {
        return {
          name: "철수",
        };
      }, []);

      // 이제
      이전 user === 새로운 user
      // 가 됨
      ```

    - 불필요한 리렌더링 방지
      - React는 props를 비교할 때 얕은 비교

      ```tsx
      <Child user={user} />;

      // Child가 memo로 감싸져 있어도 user 참조 변경이 발생하면 다시 렌더링됩니다.

      const user = useMemo(() => {
        return {
          name: '철수',
        };
      }, []);

      // 그래서 위의 식을 이용해서 참조 유지함
      ```

  - **`useMemo`** 기본 사용법 🍠

    # **`useMemo`** 기본 사용법 🍠

    ***

    ### 기본 문법

    ```tsx
    const memoizedValue = useMemo(() => {
      return 계산결과;
    }, [deps]);
    ```

    - 첫 번째 인자 → 계산 함수
    - 두 번째 인자 → 의존성 배열

    ### 간단한 예제

    ```tsx
    import { useMemo, useState } from 'react';

    function Example() {
      const [count, setCount] = useState(0);

      const doubled = useMemo(() => {
        console.log('계산 수행');

        return count * 2;
      }, [count]);

      return (
        <>
          <p>{doubled}</p>

          <button onClick={() => setCount(count + 1)}>증가</button>
        </>
      );
    }
    ```

    동작

    ```tsx
    count 변경
    → useMemo 재계산

    count 그대로
    → 기존 값 재사용
    ```

    ### 의존성 배열(deps)

    ```tsx
    const value = useMemo(() => {
      return count * 2;
    }, [count]);

    // 여기서는 count를 사용했으므로 deps에 넣어야 함
    ```

  - **`useMemo`**에서 중요한 개념 🍠

    # **`useMemo`**에서 중요한 개념 🍠

    ***
    - 참조 동일성
        <aside>
        🚨
        
        React 최적화의 핵심
        
        </aside>
        
        ```tsx
        객체:
        
        const obj1 = {
          name: "철수",
        };
        
        const obj2 = {
          name: "철수",
        };
        
        console.log(obj1 === obj2);
        
        결과는 false -> 왜냐하면 서로 다른 객체이기 때문입니다.
        ```
        
        ```tsx
        useMemo 사용
        const user = useMemo(() => {
          return {
            name: "철수",
          };
        }, []);
        
        이제 같은 객체를 재사용합니다.
        
        이전 user === 새로운 user
        ```

    - useMemo는 성능 최적화 용도

      ```tsx
      // 잘못된 사용

      const [count, setCount] = useState(0);

      const value = useMemo(() => count * 2, [count]);

      이 계산은 count * 2 밖에 안 됩니다.

      너무 가벼운 계산입니다. 굳이 메모이제이션할 필요가 없습니다.

      오히려 의존성 비교 비용 + 메모리 저장 비용이 추가됩니다.
      ```

    - useMemo도 비용 존재

      ```tsx
      많은 초보자들이 전부 useMemo 사용하지만 React는:

      - deps 비교
      - 값 저장
      - 값 재사용
      과정을 수행해야 합니다.

      즉 useMemo 자체도 비용이 있습니다.
      ```

    - useMemo는 보장 X
        <aside>
        🚨
        
        React 공식 문서에서도 강조하는 내용입니다.
        
        useMemo는 성능 최적화를 위한 힌트
        
        React가 필요하다고 판단하면 값을 버리고 다시 계산할 수도 있습니다.
        
        따라서 useMemo에 의존하여 프로그램 로직을 작성하면 안 됨
        
        공식 문서에서도 useMemo는 성능 최적화를 위한 캐시일 뿐, 로직의 필수 요소가 되어서는 안 된다고 함
        
        </aside>

  - **`useMemo`** 실전 예시 🍠

    # **`useMemo`** 실전 예시 🍠

    ***
    - 예시 1) 비싼 필터링

      ```tsx
      function UserList({ users, keyword }) {
        const filteredUsers = useMemo(() => {
          return users.filter((user) =>
            user.name.includes(keyword)
          );
        }, [users, keyword]);

        return (
          <>
            {filteredUsers.map((user) => (
              <div key={user.id}>
                {user.name}
              </div>
            ))}
          </>
        );
      }

      동작
      keyword 변경
      → 필터링 수행
      다른 state 변경
      → 필터링 재사용
      ```

    - 예시 2) 정렬 최적화

      ```tsx
      const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => b.score - a.score);
      }, [users]);

      // 정렬 비용이 큰 경우 효과적
      ```

    - 예시 3) memo와 함께 사용

      ```tsx
      const Child = memo(({ user }) => {
        console.log('Child 렌더링');

        return <div>{user.name}</div>;
      });
      ```

      부모

      ```tsx
      function Parent() {
        const [count, setCount] = useState(0);

        const user = useMemo(() => {
          return {
            name: '철수',
          };
        }, []);

        return (
          <>
            <button onClick={() => setCount(count + 1)}>증가</button>

            <Child user={user} />
          </>
        );
      }
      ```

      흐름

      ```tsx
      Parent 리렌더링
      → user 참조 유지
      → Child props 동일
      → memo 덕분에 Child 렌더링 스킵
      ```

    - 예시 4) useEffect 의존성 안정화
      잘못된 예시

      ```tsx
      const options = {
        page: 1,
      };

      useEffect(() => {
        fetchData(options);
      }, [options]);

      매 렌더링마다 새 객체가 생성되어 Effect가 계속 실행
      ```

      해결

      ```tsx
      const options = useMemo(() => {
        return {
          page: 1,
        };
      }, []);

      useEffect(() => {
        fetchData(options);
      }, [options]);
      ```

- **추가로 본인이 학습한 내용에 대해서 정리해주세요** 🍠
  # **추가로 본인이 학습한 내용에 대해서 정리해주세요** 🍠
  ***
  배포는 단순히 코드를 인터넷에 올리는 작업이 아니라, 사용자가 안정적으로 서비스를 사용할 수 있도록 만드는 과정이라는 점을 알게 되었습니다.
  특히 React 프로젝트는 브라우저가 바로 이해할 수 있는 형태로 변환하기 위해 build 과정이 필요하고, Vercel은 이 build와 hosting 과정을 자동으로 처리해주는 플랫폼입니다.
  또한 CI/CD는 개발자가 매번 수동으로 테스트하고 배포하는 과정을 자동화하여 실수를 줄이고 협업 효율을 높여줍니다.
  Vercel을 GitHub와 연결하면 코드를 push할 때마다 자동으로 배포가 이루어지고, PR이나 브랜치별로 Preview URL이 생성되어 실제 서비스에 반영하기 전에 미리 확인할 수 있습니다.
  이를 통해 배포는 개발의 마지막 단계가 아니라, 개발 과정 전체와 연결된 중요한 자동화 흐름이라는 것을 이해했습니다.
