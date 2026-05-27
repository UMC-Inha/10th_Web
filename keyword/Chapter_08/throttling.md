# **`Throttling`** 개념 정리 🍠
    
    ## `Throttling` 개념 정리
    
    `Throttle`은 이벤트가 연속적으로 발생하더라도
    
    **일정 시간 간격마다 한 번씩만 함수가 실행되도록 제한하는 기법**이다.
    
    예를 들어 스크롤 이벤트는 사용자가 화면을 움직이는 동안 수십~수백 번 발생한다.
    
    이때 이벤트마다 함수를 실행하면:
    
    - 성능 저하
    - 불필요한 연산 증가
    - 렌더링 부담
    
    문제가 생길 수 있다.
    
    `Throttle`을 적용하면 지정한 시간 간격(예: 300ms)마다 한 번씩만 실행되므로
    
    과도한 함수 호출을 줄일 수 있다.
    
    ### 동작 방식
    
    1. 이벤트 발생
    2. 함수 실행
    3. 일정 시간 동안 추가 호출 무시
    4. 시간이 지나면 다시 실행 가능
    
    즉,
    
    - 이벤트는 계속 발생하지만
    - 함수는 정해진 주기마다 실행된다.
    
    ### 주 사용 사례
    
    - scroll 이벤트
    - resize 이벤트
    - 마우스 이동(mousemove)
    - 버튼 연속 클릭 방지
# **`Throttling`** 코드 작성 🍠
    
    ```jsx
    function throttle(func, delay) {
      let lastCall = 0;
    
      return function (...args) {
        const now = Date.now();
    
        // 마지막 실행 이후 delay가 지났는지 확인
        if (now - lastCall >= delay) {
          lastCall = now;
          func.apply(this, args);
        }
      };
    }
    ```
    
    ### 사용 예시
    
    ```jsx
    consthandleScroll=throttle(() => {
    console.log("스크롤 이벤트 실행");
    },300);
    
    window.addEventListener("scroll",handleScroll);
    ```
    
    ### 코드 흐름 설명
    
    ```jsx
    constnow=Date.now();
    ```
    
    현재 시간을 저장한다.
    
    ```jsx
    if (now-lastCall>=delay)
    ```
    
    마지막 실행 시점으로부터 `delay` 이상 지났는지 확인한다.
    
    ```jsx
    lastCall=now;
    ```
    
    함수가 실행되면 마지막 실행 시간을 갱신한다.
    
    즉, 이벤트가 아무리 많이 발생해도
    설정한 시간 간격마다 함수가 한 번씩만 실행된다.