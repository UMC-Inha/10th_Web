# **`Debounce`** 개념 정리 
    
    `Debounce`는 이벤트가 연속적으로 발생할 때,
    
    **마지막 이벤트가 발생한 뒤 일정 시간이 지나면 딱 한 번만 실행**되도록 만드는 기법이다.
    
    예를 들어 사용자가 검색창에 글자를 입력할 때마다 API 요청을 보내면:
    
    - `r` 입력 → 요청
    - `re` 입력 → 요청
    - `rea` 입력 → 요청
    - ...
    
    처럼 너무 많은 요청이 발생한다.
    
    이때 `Debounce`를 적용하면 사용자가 입력을 멈춘 뒤 일정 시간(예: 300ms)이 지나고 나서 한 번만 요청을 보낸다.
    
    즉, **불필요한 함수 실행을 줄여 성능을 최적화**하는 방식이다.
    
    ### 동작 방식
    
    1. 이벤트 발생
    2. 타이머 시작
    3. 지정 시간 안에 이벤트가 또 발생하면 기존 타이머 취소
    4. 다시 타이머 시작
    5. 마지막 이벤트 이후 일정 시간이 지나면 함수 실행
    
    ### 주 사용 사례
    
    - 검색 자동완성
    - 입력값 검증
    - 자동 저장(auto-save)
    - resize 이벤트 최적화
    
    ### Throttle과의 차이
    
    | 구분 | Debounce | Throttle |
    | --- | --- | --- |
    | 실행 시점 | 이벤트가 멈춘 뒤 실행 | 일정 시간마다 실행 |
    | 목적 | 마지막 결과만 처리 | 중간 과정도 주기적으로 처리 |
    | 사용 예시 | 검색창 입력 | 스크롤 이벤트 |
    
    Debounce는
    
    “사용자가 행동을 끝냈을 때 실행”에 가깝고,
    
    Throttle은
    
    “계속 발생하더라도 일정 주기로 실행”에 가깝다.
    
# **`Debounce`** 코드 작성 
    
    ```jsx
    function debounce(func, delay) {
      let timeoutId;
    
      return function (...args) {
        // 기존 타이머 제거
        clearTimeout(timeoutId);
    
        // 새로운 타이머 등록
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }
    ```
    
    ### 사용 예시
    
    ```jsx
    constsearch=debounce((keyword) => {
    console.log("검색 요청:",keyword);
    },300);
    
    input.addEventListener("input", (e) => {
    search(e.target.value);
    });
    ```
    
    ### 코드 흐름 설명
    
    ```jsx
    clearTimeout(timeoutId);
    ```
    
    기존에 예약된 실행이 있다면 취소한다.
    
    ```jsx
    timeoutId=setTimeout(...)
    ```
    
    새로운 실행 예약을 만든다.
    
    즉, 이벤트가 계속 발생하면 이전 예약은 계속 취소되고
    
    마지막 이벤트 이후 `delay` 시간이 지나야 함수가 실행된다.