- **`Debounce`** 개념 정리 🍠
    
    디바운스(Debounce)는 아무리 많은 이벤트가 연속으로 발생해도, **"마지막 이벤트가 끝나고 일정 시간이 지나기 전까지"** 실제 로직을 실행하지 않고 대기하는 기술입니다. 이벤트를 한데 모아서 맨 마지막에 딱 한 번만 처리하는 통제 장치라고 보면 됩니다.
    
    - **해결하려는 문제**: 사용자가 타자를 칠 때마다 API를 호출하면 서버가 터지거나 비용이 낭비되는 문제.
    - **실제 서비스 맥락**:
        - **검색창 자동완성**: 사용자가 오스카를 입력할 때 ㅇ, 오, 오ㅅ, 오스 마다 API를 쏘는 게 아니라, 타이핑을 멈추고 0.3초가 지났을 때 최종 단어 오스카로 한 번만 검색을 요청함.
        - **윈도우 리사이즈(Resize)**: 브라우저 창 크기를 마우스로 늘릴 때 레이아웃 계산 함수가 수백 번 실행되는 것을 방지하고, 크기 조절이 완전히 끝났을 때 최종 결과만 반영함.
- **`Debounce`** 코드 작성 🍠
    
    ```jsx
    function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
      return function (...args: Parameters<T>) {
        // 이전 타이머가 작동 중이었다면 싹 취소 (이전 요청은 무시함)
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
    
        // 지정된 지연 시간(delay) 뒤에 실행되도록 새로운 타이머 설정
        timeoutId = setTimeout(() => {
          fn(...args);
        }, delay);
      };
    }
    
    // 사용 예시 (검색 입력 이벤트 핸들러)
    const handleSearch = debounce((keyword: string) => {
      console.log(`서버로 [${keyword}] 검색 API 요청 발송!`);
    }, 300);
    ```

    - **`Throttling`** 개념 정리 🍠
    
    쓰로틀링(Throttling)은 연속으로 이벤트가 아무리 많이 쏟아져도, **"설정한 주기(Interval)마다 최대 한 번만"** 실행되도록 강제로 실행 빈도를 제한하는 기술입니다. 쏟아지는 폭포수 앞에 일정한 속도로 돌아가는 물레방아를 설치하는 것과 같습니다.
    
    - **해결하려는 문제**: 유저의 스크롤이나 마우스 움직임에 맞춰 무거운 렌더링/연산 로직이 초당 수백 번씩 실행되어 화면이 버벅거리는(Frame Drop) 문제.
    - **실제 서비스 맥락**:
        - **무한 스크롤 무력화 방지**: 유저가 휠을 붕붕 돌릴 때 스크롤 감지 함수가 너무 자주 실행되면 브라우저가 멈출 수 있으므로, `0.1초에 딱 한 번씩만` 바닥에 닿았는지 체크하도록 조절함.
        - **게임 내 연사 제한 / 스킬 쿨타임**: 마우스를 광클해도 캐릭터가 설정된 연사 속도(주기) 이상으로 총을 쏘지 못하게 막음.
- **`Throttling`** 코드 작성 🍠
    
    ```jsx
    function throttle<T extends (...args: any[]) => void>(fn: T, limit: number) {
      let inThrottle = false;
    
      return function (...args: Parameters<T>) {
        // 쿨타임(기다리는 중) 상태라면 아무것도 하지 않고 무시함
        if (inThrottle) return;
    
        // 로직을 즉시 실행
        fn(...args);
        // 쿨타임 시작 스위치 ON
        inThrottle = true;
    
        // 설정한 제한 시간(limit)이 지나면 다시 스위치를 OFF로 풀어줌
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      };
    }
    
    // 사용 예시 (스크롤 감지 스크립트)
    const handleScroll = throttle(() => {
      console.log("현재 스크롤 위치 계산 중... (0.2초마다 규칙적으로 실행)");
    }, 200);
    ```