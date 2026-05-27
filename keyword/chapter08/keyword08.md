- **`Debounce`** 구글링 후 개념 정리 및 코드 작성해보기 🍠
  - **`Debounce`** 개념 정리 🍠
      <aside>
      💡
      
      **Debounce**는 이벤트가 연속으로 발생할 때, **마지막 이벤트가 끝난 뒤 일정 시간이 지난 후에 한 번만 실행**되도록 하는 기법!
      
      즉, 사용자가 계속 입력 중이면 함수 실행을 미루고, 입력이 멈췄을 때만 실행한다.
      
      </aside>
      
      ### 사용 예시
      
      검색창에 글자를 입력할 때마다 API 요청을 보내면 비효율적이다.
      
      ```
      ㄱ 입력 → API 요청
      기 입력 → API 요청
      김 입력 → API 요청
      김철 입력 → API 요청
      ```
      
      Debounce를 적용하면 사용자가 입력을 멈춘 뒤 한 번만 요청한다.
      
      ```
      김철수 입력 완료
      0.5초 동안 추가 입력 없음
      → API 요청 1번 실행
      ```
      
      ### 핵심 특징
      
      - 연속된 이벤트 중 **마지막 이벤트만 처리**
      - 불필요한 API 요청, 렌더링, 함수 실행을 줄일 수 있음
      - 검색창, 자동완성, 창 크기 조절, 버튼 중복 클릭 방지 등에 사용됨

  - **`Debounce`** 코드 작성 🍠

    ### **기본 코드**

    ```tsx
    function debounce(callback, delay) {
      let timerId;

      return function (...args) {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
          callback(...args);
        }, delay);
      };
    }
    ```

    - `function debounce(callback, delay)`
      ```tsx
      functiondebounce(callback,delay) {
      ```
      `debounce`라는 함수를 만들고 여기서 매개변수는 2개!
      - `callback` → 나중에 실제로 실행하고 싶은 함수
        예시) 검색 함수
        ```tsx
        functionsearch(keyword) {
        console.log(keyword);
        }
        ```
      - `delay` → 몇 초 기다렸다가 실행할지 정하는 시간 값
        단위는 **ms, 밀리초**
        ```
        500 -> 0.5초
        ```
    - `let timerId;`
      - `lettimerId` → 타이머 번호를 저장하는 변수
        `setTimeout`을 실행하면 자바스크립트가 타이머 ID를 하나 줌

        ```tsx
        timerId=setTimeout(...)
        // 나중에 타이머를 취소하기 위해 위와 같이 저장함

        clearTimeout(timerId);
        // 이렇게 취소 가능
        ```

    - `return function (...args)`
      `debounce` 함수는 바로 `callback`을 실행하는 게 아니라, **새로운 함수 하나를 만들어서 반환함**
      **예시**

      ```tsx
      constdebouncedSearch=debounce(search,500);

      // 이렇게 하면 debouncedSearch 안에는 이 함수가 들어가게 돼.

      function (...args) {
      clearTimeout(timerId);

      timerId=setTimeout(() => {
      callback(...args);
        },delay);
      }

      // 즉, 사용자가 실제로 호출하는 것은 debounce가 아니라 debounce가 만들어준 함수임
      ```

    - `...args` → 함수에 들어오는 모든 인자를 배열처럼 받아주는 문법
      **예시**

      ```tsx
      debouncedSearch('apple');

      // 그러면:
      args = ['apple'];
      // 만약 이렇게 부르면:
      debouncedSearch('apple', 1, true);
      // 그러면:
      args = ['apple', 1, true];
      // 이렇게 저장돼.
      // 나중에 원래 함수에 그대로 넘기려고 쓰는 거야.
      callback(...args);
      ```

    - `clearTimeout(timerId);` → 기존에 예약되어 있던 타이머 취소하는 코드
      **Debounce**의 핵심
      **예시**

      ```tsx
      검색창에 이렇게 입력한다고 할 때

      ```

      a 입력
      ap 입력
      app 입력
      apple 입력

      ```
      입력할 때마다 함수가 호출됨

      만약, 매번 이전 타이머를 취소한다면
      마지막에는 apple만 남음

      ```

      a 입력 → 500ms 뒤 실행 예약
      ap 입력 → 기존 a 예약 취소, 새로 예약
      app 입력 → 기존 ap 예약 취소, 새로 예약
      apple 입력 → 기존 app 예약 취소, 새로 예약

      ```

      ```

    - `setTimeout(() => { ... }, delay)`

      ```tsx
      timerId=setTimeout(() => {
      callback(...args);
      },delay);

      // 새로운 타이머 등록 코드

      // 뜻
      delay 시간만큼 기다린 뒤 callback 함수를 실행해라

      // 예시: delay가 500이면
      500ms 뒤에 callback 실행
      ```

    - `callback(...args);` → 실제 함수가 실행되는 부분
      **예시**

      ```tsx
      constdebouncedSearch=debounce(search,500);

      debouncedSearch('apple');

      // 500ms 뒤에 실제로는
      search('apple'); -> 이렇게 실행 됨
      ```

        <aside>
        💡
        
        `...args`를 쓰는 이유는 원래 함수에 전달했던 값을 그대로 다시 넣어주기 위해서!
        
        </aside>

    - 전체 흐름 예시

      ```tsx
      functionsearch(keyword) {
      console.log('검색어:',keyword);
      }

      constdebouncedSearch=debounce(search,500);

      debouncedSearch('a');
      debouncedSearch('ap');
      debouncedSearch('app');
      debouncedSearch('apple');
      ```

      **실행 흐름**

      ```
      1. 'a' 입력 → 500ms 뒤 search('a') 예약
      2. 'ap' 입력 → 이전 예약 취소, search('ap') 예약
      3. 'app' 입력 → 이전 예약 취소, search('app') 예약
      4. 'apple' 입력 → 이전 예약 취소, search('apple') 예약
      5. 500ms 동안 추가 입력 없음
      6. search('apple') 실행
      ```

      **결과**

      ```
      검색어:apple
      ```

    ### **사용 예시**

    ```tsx
    **const searchInput = document.querySelector('#search');

    function handleSearch(event) {
      console.log('검색어:', event.target.value);
    }

    const debouncedSearch = debounce(handleSearch, 500);

    searchInput.addEventListener('input', debouncedSearch);**
    ```

    ### **코드 흐름**

    ```tsx
    **1. 사용자가 입력한다.
    2. 기존 타이머가 있으면 취소한다.
    3. 새로운 타이머를 설정한다.
    4. 500ms 안에 또 입력하면 다시 취소된다.
    5. 500ms 동안 입력이 없으면 callback이 실행된다.**
    ```

    ### **React 예시**

    ```tsx
    import { useEffect, useState } from 'react';

    function SearchInput() {
      const [keyword, setKeyword] = useState('');
      const [debouncedKeyword, setDebouncedKeyword] = useState('');

      useEffect(() => {
        const timer = setTimeout(() => {
          setDebouncedKeyword(keyword);
        }, 500);

        return () => {
          clearTimeout(timer);
        };
      }, [keyword]);

      useEffect(() => {
        if (debouncedKeyword) {
          console.log('API 요청:', debouncedKeyword);
        }
      }, [debouncedKeyword]);

      return (
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
      );
    }
    ```

- **`Throttling`** 구글링 후 개념 정리 및 코드 작성해보기 🍠
  - **`Throttling`** 개념 정리 🍠
      <aside>
      💡
      
      **Throttle(스로틀링)** 은 이벤트가 계속 발생하더라도, **일정 시간 간격마다 한 번씩만 실행**되도록 제한하는 기법!
      
      즉, 이벤트를 아예 마지막에 한 번만 실행하는 Debounce와 달리,
      
      Throttle은 이벤트가 계속 발생해도 **주기적으로 실행**된다.
      
      </aside>
      
      ## **Debounce와의 차이점**
      
      ### Debounce
      
      ```
      입력이 끝날 때까지 기다렸다가 마지막 1번 실행
      
      예시
      aaaaaaa 입력 중...
      입력 멈춤
      → 실행 1번
      ```
      
      ### Throttle
      
      ```
      입력이 계속되어도 일정 간격마다 실행
      
      예시
      스크롤 중...
      0.5초마다 실행
      0.5초마다 실행
      0.5초마다 실행
      ```
      
      ## 사용 예시
      
      1. 스크롤 이벤트
          
          ```
          스크롤은 엄청 많이 발생함
          
          스크롤 1px
          스크롤 2px
          스크롤 3px
          ...
          -> 이를 매번 실행하면 성능 떨어짐
          그래서 throttle을 사용하여 0.3초마다 한 번씩만 실행하게 만듦
          ```
          
      2. 게임 이동
          
          ```
          키를 누르고 있으면 이벤트 발생
          
          throttle 사용하면 '0.1초 마다 이동'처럼 제어 가능!
          ```
          
      
      ## 핵심 특징
      
      - 일정 시간 간격마다 실행
      - 이벤트가 계속 발생해도 주기적으로 실행 가능
      - 스크롤, 마우스 이동, 게임 입력 등에 많이 사용
      - 과도한 이벤트 호출을 줄여 성능 최적화 가능

  - **`Throttling`** 코드 작성 🍠

    ### 기본 코드

    ```tsx
    functionthrottle(callback,delay) {
    letisWaiting=false;

    returnfunction (...args) {
    if (isWaiting)return;

    callback(...args);

    isWaiting=true;

    setTimeout(() => {
    isWaiting=false;
        },delay);
      };
    }
    ```

    - **`function throttle(callback, delay)`**

      ```tsx
      function throttle(callback, delay) {
      // Throttle 함수를 만드는 부분
      ```

      - `callback` → 매개 변수
      - 실제로 실행할 함수
        ```tsx
        // 예시
        function movePlayer() {
          console.log('이동');
        }
        ```
      - `delay` → 몇 ms마다 실행할지 정하는 시간

      ***

    - **`let isWaiting = false;` →** 지금 대기 중인지 확인하는 변수
      - 초기값 `false -> 아직 실행 가능 상태` 라는 뜻
    - **`return function (...args)** {`
        <aside>
        💡
        
        Throttle도 debounce처럼 새로운 함수를 반환함
        
        즉
        
        `const throttledScroll = throttle(handleScroll, 300);`
        하면 실제로 이벤트에 등록되는 건 반환된 함수임
        
        </aside>

    - **`if (isWaiting) return;`**
        <aside>
        💡
        
        Throttle의 핵심으로
        
        만약 현재 대기 상태라면 `함수 실행하지 말고 끝내라`는 뜻!
        
        </aside>
        
        **예시**
        
        ```tsx
        첫 실행 → 가능0.1초 뒤 실행 시도 → 막힘0.2초 뒤 실행 시도 → 막힘0.3초 지나면 다시 가능
        ****
        ```

    - **`callback(...args);` →** 실제 함수 실행

      ```tsx
      **예시**

      throttledScroll('현재 위치');
      이면:
      handleScroll('현재 위치');
      실행됨.
      ```

    - **`isWaiting = true;` →** 실행 금지 상태로 바꿈
        <aside>
        💡
        
        지금부터 delay 시간 동안 실행 막기!
        
        </aside>

    - **`setTimeout(() => { ... }, delay)`**
        <aside>
        💡
        
        delay 시간이 지나면 다시 실행 가능 상태로 바꿈
        
        </aside>
        
        **예시**
        
        ```tsx
        delay = 1000 이면
        1초 뒤에 다시 실행 허용
        ****
        ```

    - **전체 흐름 예시**

      ```tsx
      function shoot() {  console.log('발사!');}
      const throttledShoot = throttle(shoot, 1000);

      // 사용자가 버튼을 엄청 빠르게 누른다고 할 때
      throttledShoot();
      throttledShoot();
      throttledShoot();
      throttledShoot();

      **// 실행 흐름

      // 첫 번째 클릭**
      isWaiting = false
      → 실행 가능
      → "발사!"
      → isWaiting = true

      **// 두 번째 클릭**
      isWaiting = true
      → return
      → 무시됨

      **// 세 번째 클릭**
      여전히 true
      → 무시

      **// 1초 후**
      isWaiting = false
      다시 실행 가능 상태 됨
      ```

    - **Debounce vs Throttle 핵심 비교**
      | 구분 | Debounce | Throttle |
      | ------------ | ---------------- | ------------------ |
      | 실행 방식 | 마지막 한 번만 | 일정 간격마다 |
      | 연속 입력 시 | 계속 취소 | 일정 시간마다 실행 |
      | 대표 사용 | 검색창 | 스크롤 |
      | 핵심 목적 | 마지막 행동 감지 | 실행 횟수 제한 |
