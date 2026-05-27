# 디바운스
- **`Debounce`** 개념 정리 🍠
    
    **1️⃣ Debounce란?**
    
    디바운스는 연달아 호출되는 함수들 중 가장 마지막 함수만 실행하도록 한다.
    
    참고자료에서 엘리베이터 문에 비유하여 설명한 내용을 정리하였다.
    
    > 엘리베이터 문이 닫힐려고 할 때 새로운 사람이 타면 문은 다시 처음부터 5초를 기다린다. 또 다시 사람이 타면 5초 연장이 된다. 디바운스는 이 엘리베이터 문처럼 아무리 여러 번 이벤트가 발생하더라도 지정된 대기 시간 동안 추가 이벤트가 없을 때만 최종적으로 딱 한 번 실행된다.
    > 
    
    **2️⃣ 사용하는 이유는?**
    
    사용자의 행동 (타이핑, 스크롤, 창 크기 조절)에 따라 실시간으로 이벤트를 처리할 때가 많다. 만약 디바운스가 없다면 심각한 성능 저하나 비용 문제가 발생한다.
    
    - **API 요청 비용 절감** : 모든 타이핑마다 서버에 검색 API 요청하면 서버 과부하가 생긴다. 디바운스 처리하면 타이핑이 완전히 끝났을 때 1번만 요청을 보낼 수 있다.
    - **불필요한 리렌더링 방지** : 예를 들어 창 크기를 조절하는 `resize` 이벤트는 밀리초 단위로 수백 번 발생한다. 이를 상태값에 반영하면 브라우저가 버벅거린다.
    
    **3️⃣ 예시 코드**
    
    클로저(Closure)와 `setTimeout`을 이용하여 구현 할 수 있다. 새로운 이벤트가 들어오면 기존에 예약되어 있던 `Timeout`을 취소하고 다시 타이머를 설정한다.
    
    ```tsx
    import { useState, useMemo } from 'react';
    
    const SearchComponent = () => {
      const [search, setSearch] = useState('');
    
      // 리렌더링 시 디바운스 함수가 초기화되는 것을 useMemo로 방지
      const debouncedSearch = useMemo(
        () => debounce((value: string) => {
          console.log("디바운스된 값으로 API 호출:", value);
        }, 500),
        []
      );
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        setSearch(nextValue);       // UI는 타이핑하는 대로 즉시 변경 (빠른 UX)
        debouncedSearch(nextValue);  // API 요청은 디바운싱 적용 (서버 보호)
      };
    
      return <input value={search} onChange={handleChange} placeholder="검색어 입력" />;
    };
    ```
    
    **4️⃣ 디바운스 실행 시점**
    
    **Leading Edge vs Trailing Edge**
    
    디바운스는 함수를 실행하는 타이밍에 따라 2가지 모드로 나눌 수 있다. (기본 값: 대부분 Trailing)
    
    - **Trailing Edge** : 여러 번 발생하는 이벤트가 끝나고 나서 일정 시간 뒤에 함수를 실행한다
    - **Leading Edge** : 이벤트가 시작하자마자 첫 번째 함수를 즉시 실행하고 그 뒤에 연달아 들어오는 이벤트는 무시한다. (좋아요 연타 방지, 버튼 중복 클릭 방지)
    
    **5️⃣ 메모리 누수 (Memory Leak)**
    
    디반운스는 setTimeout을 사용하기에 사용자가 타이핑하다가 갑자기 다른 페이지로 이동한다면 백그라운드에 타이머가 남아 오작동 될 수 있다. 따라서 컴포넌트가 사라질 때 디바운스 함수 내부의 clearTimeout을 호출해 주는 클린업 코드를 작성하는 것이 좋다.
    
    6️⃣ Throttle 과 차이점
    
    | **개념** | **작동 방식** | **예시** |
    | --- | --- | --- |
    | **Debounce** | 마지막에 딱 한 번만 실행 | 검색창 인풋(`input`), 창 크기 조절(`resize`) |
    | **Throttle** | 설정한 시간 간격마다 주기적으로 실행 | 무한 스크롤(스크롤 위치 계산), 마우스 움직임 감지 |

    ## 예시 코드
    - **`Debounce`** 코드 작성 🍠
    
    ```tsx
    export function debounce<T extends (...args: any[]) => any>(
      func: T, 
      delay: number
    ): (...args: Parameters<T>) => void {
      
      // 타이머 ID를 기억할 변수를 클로저(Closure) 공간에 선언
      let timerId: ReturnType<typeof setTimeout> | null = null;
    
      return function (this: any, ...args: Parameters<T>): void {
        // 대기 시간이 끝나기 전에 함수가 또 호출되면 기존 타이머를 취소(Clear)
        if (timerId) {
          clearTimeout(timerId);
        }
    
        // 새로운 타이머를 설정하여 지정된 delay 이후에만 func가 실행되도록 함
        timerId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }
    ```
    
    - **작동 원리 (클로저 활용):** `timerId`를 내부 변수로 둔 채 함수를 리턴하는 클로저(Closure) 구조를 활용한다. 여러번 요청이 들어와도 하나의 타이머 상태를 계속 추적하고 취소(`clearTimeout`)할 수 있다

---

# Throttling
- **`Throttling`** 개념 정리 🍠
    
    **1️⃣ Thottling이란?**
    
    많은 이벤트가 연속으로 발생해도 지정된 시간 간격마다 한 번만 함수가 실행 되도록 제한한다
    
    참고자료 속 비유를 정리해보았다.
    
    > **일정 주기 마다 물방울이 떨어지는 수도꼭지**
    > 
    
    > **놀이 공원 회전문** : 문 앞에 여러 명이 있어도 회전 문은 정해진 속도로만 돌기에 3초에 정해진 인원만 통과할 수 있다.
    > 
    
    **2️⃣ 사용하는 이유는?**
    
    사용자가 어떤 행위를 지속적으로 하고 있어도 화면에 주기적 변화를 보여줘야 할 때 throttling이 필요하다. 디바운스는 행동이 멈추기 전까지 화면에 움직임이 없기 때문이다.
    
    - **무한 스크롤 및 스크롤 이벤트** : 웹 페이지를 아래로 스크롤 할 때 브라우저는 밀리초 단위로 스크롤 위치를 계산한다. throttling을 이용하여 한 번씩만 현재 위치를 체크하게 되면 브라우저가 버벅거리지 않고 스크롤 끝에 닿았을 때 부드럽게 다음 데이터를 가져온다.
    
    **3️⃣ 예시 코드**
    
    ```tsx
    export function throttle<T extends (...args: any[]) => any>(
      func: T,
      delay: number
    ): (...args: Parameters<T>) => void {
      
      // 마지막으로 함수가 가동된 시각을 저장하는 공간
      let lastTime = 0;
    
      return function (this: any, ...args: Parameters<T>): void {
        const now = Date.now();
    
        // 현재 시각과 마지막 실행 시각의 차이가 설정한 delay보다 클 때
        if (now - lastTime >= delay) {
          func.apply(this, args);
          
          // 실행한 시각을 현재 시각으로 갱신
          lastTime = now;
        }
      };
    }
    ```
    
    **4️⃣ Leading Edge vs Trailing Edge**
    
    디바운스와 동일하게 주기의 시작과 끝 중 언제 실행할 지 결정할 수 있다
    
    - **Leading Edge** : 사용자가 이벤트를 시작하자마자 첫 번째 함수를 즉시 실행하고 그 뒤로 설정한 시간 동안 들어오는 모든 이벤트는 무시한다. 시간이 지나면 다시 첫 이벤트가 실행된다
    - **Trailing Edge :** 이벤트가 들어오면 즉시 실행하지 않고 설정한 시간 뒤로 타이머를 예약한다. 그 시간 동안 들어오는 요청은 무시하다가 타이머가 끝나면 실행된다.
    
    **5️⃣ Debounce와의 차이**
    
    - **Debounce** : 사용자가 행동을 마칠 때까지 계속 타이머를 초기화하며 미루다가 마지막에 한번 실행된다
    - **Throttling** : 사용자가 행동을 계속하고 있더라도 타이머를 초기화하지 않고 정해진 시간 주기마다 규칙적으로 실행한다.

    - **`Throttling`** 코드 작성 🍠
    
    ```tsx
    export function throttle<T extends (...args: any[]) => any>(
      func: T,
      delay: number
    ): (...args: Parameters<T>) => void {
      
      // 마지막으로 함수가 실행된 시각을 기억할 변수
      let lastTime = 0;
    
      return function (this: any, ...args: Parameters<T>): void {
        const now = Date.now();
    
        // 현재 시각과 마지막 실행 시각의 차이가 delay 시간보다 클 때
        if (now - lastTime >= delay) {
          func.apply(this, args);
          
          // 함수가 실행되었으므로 마지막 실행 시각을 현재 시각으로 갱신
          lastTime = now;
        }
      };
    }
    ```