- **`useCallabck`** 에 대하여 정리해주세요! 🍠
    
    # **`useCallabck`** 에 대하여 정리해주세요! 🍠
    
    ---
    
    - **`useCallabck`** 이 무엇인지? 🍠
        
        # **`useCallabck`** 이 무엇인지?
        
        ---
        
        - 함수(콜백)를 “메모이제이션” 한다는 게 무슨 뜻인지?
            - 정의: `useCallback`은 컴포넌트가 리렌더링될 때 내부에서 정의된 **함수(콜백 함수)를 재생성하지 않고, 메모리에 고정하여 재사용**할 수 있도록 돕는 리액트의 최적화 전용 훅입니다.
            - **핵심 목적**: 앞서 학습한 참조 등가성(Referential Equality)을 유지하기 위함입니다. 컴포넌트 내부 함수가 매번 새로 동적 생성되는 것을 막아, 이 함수를 props로 전달받는 자식 컴포넌트의 불필요한 오버렌더링을 방지(Bailout)하는 데 사용됩니다.
            - **기존 리액트의 문제점**: 리액트 컴포넌트는 상태가 변해 리렌더링될 때마다 함수 전체가 다시 실행됩니다. 이때 컴포넌트 내부에 선언된 일반 함수들은 **내용물이 완전히 똑같더라도 매번 새로운 메모리 주소를 할당받는 새 객체로 재생성**됩니다.
            - **메모이제이션(Memoization)의 의미**: 컴퓨터 과학에서 동일한 계산을 반복해야 할 때 이전 값을 메모리에 저장해 두고 재사용하는 기법을 뜻합니다. 리액트에서 함수를 메모이제이션한다는 것은 "최초 렌더링 때 생성된 함수의 메모리 주소(참조값)를 리액트가 가상의 저장소에 따로 킵(Keep)해 두고 기억하는 것"을 의미합니다. 컴포넌트가 백 번 리렌더링되어도 새로 함수를 짓지 않고 이 저장소에서 똑같은 주소값을 꺼내와 돌려주게 됩니다.
        - 언제 새 함수를 만들고, 언제 기존 함수를 재사용하는지?
            
            이 재생성과 재사용의 타이밍은 `useCallback`의 두 번째 인자인 의존성 배열(Dependency Array, `[]`)에 의해 철저하게 제어됩니다.
            
            - **기존 함수를 재사용하는 경우 (Reuse)**
                - 의존성 배열에 등록된 값들이 이전 렌더링 시점과 비교했을 때 **단 하나도 변하지 않았다면** 기존 함수 주소를 그대로 재사용합니다.
                - 만약 의존성 배열을 빈 배열(`[]`)로 넘겨준다면, 컴포넌트가 최초로 화면에 붙을 때(Mount) 딱 한 번만 함수를 만들고, 이후 컴포넌트가 사라질 때까지 평생 기존 함수 주소만 우려먹으며 재사용합니다.
            - **새 함수를 만드는 경우 (Re-create)**
                - 의존성 배열에 넣어둔 특정 상태(State)나 Props 값이 **하나라도 변경되면**, 리액트는 기존 함수를 파기하고 **현재의 최신 데이터를 반영하는 새로운 함수 주소를 생성**하여 메모리를 동기화합니다.
                - **이유**: 만약 상태가 바뀌었는데도 함수를 새로 만들지 않고 옛날 함수를 고수하면, 함수가 생성될 당시의 과거 데이터 스냅샷만 기억하는 '클로저(Closure)의 함정(Stale Closure)'에 빠져 화면에 에러나 철 지난 데이터가 반영되는 심각한 논리적 버그가 발생하기 때문입니다.
    - 왜 **`useCallabck`**을 사용하는지? 🍠
        
        # 왜 **`useCallabck`**을 사용하는지?
        
        ---
        
        - **불필요한 리렌더링 방지**와 어떤 관련이 있는지
            - **`React.memo`와의 협업**: 자식 컴포넌트의 불필요한 렌더링을 막기 위해 `React.memo`를 사용하더라도, 부모 컴포넌트가 자식에게 일반 함수를 props로 넘겨주면 아무런 소용이 없어집니다.
            - 부모가 리렌더링될 때마다 함수의 주소값이 바뀌므로, 자식 컴포넌트(`React.memo`) 입장에서는 "전달받은 props(함수 주소)가 바뀌었네?"라고 판단하여 싱크를 맞추기 위해 강제로 자식 화면을 다시 그리게 됩니다.
            - **최적화 체인 완성**: 부모 컴포넌트에서 자식에게 넘겨줄 콜백 함수를 `useCallback`으로 감싸주어야만, 부모가 리렌더링되어도 자식이 받는 props의 주소가 동일하게 유지됩니다. 비로소 `React.memo`가 정상 작동하여 자식 컴포넌트의 불필요한 리렌더링을 완벽하게 방지(Bailout)할 수 있게 됩니다.
        - 성능 최적화 관점에서 얻는 이득 vs 남용했을 때의 오버헤드
            
            
            | **구분** | **내용** |
            | --- | --- |
            | **성능 최적화 관점의 이득 (Benefits)** | * 하위 컴포넌트가 무겁거나(가상화 리스트, 복잡한 차트 등) 트리가 깊을 때, **자식 컴포넌트 전체가 다시 실행되는 연산 비용을 통째로 세이브**할 수 있습니다.
            * `useEffect`의 의존성 배열에 함수가 들어가는 경우, 불필요하게 `useEffect` 내부 로직이 재트리거되는 싱크 버그를 원천 차단합니다. |
            | **남용했을 때의 오버헤드 (Overhead)** | * **메모리 추가 소비**: 함수를 메모리에 유지하기 위해 가상의 저장소에 할당하고, 매번 의존성 배열(`[]`)을 비교하는 추가적인 연산 비용과 메모리가 소모됩니다.
            * **가독성 저하**: 모든 함수를 `useCallback`으로 도배하면 코드가 불필요하게 길어지고 복잡해져 유지보수 생산성이 떨어집니다.
            * **함수 재생성 비용은 동일**: `useCallback` 내부의 인라인 함수 코드는 리렌더링 때마다 어차피 자바스크립트 엔진에 의해 새로 파싱(정의)됩니다. 단지 리액트가 그걸 버리고 기존 주소를 쓸 뿐이므로, 함수 생성 자체를 안 하게 만드는 마법이 아닙니다. |
    - **`useCallabck`** 기본 사용법 🍠
        
        # **`useCallabck`** 기본 사용법
        
        ---
        
        - **`useCallabck`**은 어떻게 사용하나요? (코드)
            
            ```tsx
            import { useState, useCallback } from 'react';
            import ChildButton from './ChildButton';
            
            export default function App() {
              const [count, setCount] = useState<number>(0);
            
              const increment = useCallback(() => {
                setCount((prevCount) => prevCount + 1);
              }, []);
            
              return (
                <div>
                  <h1>현재 카운트: {count}</h1>
                  <ChildButton onClick={increment} />
                </div>
              );
            }
            ```
            
        - `deps` 배열에 무엇을 넣어야 하는지 규칙
            
            `useCallback`의 두 번째 인자인 의존성 배열(`deps`)에는 "함수 내부에서 참조하고 있는 컴포넌트 범위의 모든 동적 값"을 빠짐없이 선언해야 합니다.
            
            - **반드시 넣어야 하는 값**
                - 컴포넌트 내부의 상태(State) 값
                - 부모로부터 전달받은 props 값
                - 컴포넌트 바디 내부에서 선언된 다른 변수나 함수
            - **넣지 않아도 되는 값**
                - `useState`가 반환하는 상태 변경 함수 (예: `setLps` 등은 리액트가 고유한 참조 안정성을 보장하므로 생략 가능)
                - 컴포넌트 외부(파일 스코프나 전역)에서 정의된 변수나 함수
                - `useRef`의 `ref.current` 값 (값이 바뀌어도 리렌더링을 유발하지 않으므로 의존성 배열에 넣어도 감지되지 않음)
            
            > **⚠️ 규칙을 어겼을 때의 위험성 (Stale Closure)**
            함수 내부에서 특정 상태를 사용하는데 deps 배열에서 누락하면, 함수는 그 상태의 **최초 렌더링 당시 과거 스냅샷(구버전 데이터)**만 기억하게 됩니다. 상태가 아무리 업데이트되어도 함수는 계속 옛날 값을 기준으로 실행되는 치명적인 논리적 버그가 발생합니다.
            > 
        - 의존성 변경 시 콜백이 어떻게 다시 만들어지는지
            
            리액트 런타임 환경에서 의존성 배열의 변경에 따라 함수가 재사용되거나 재생성되는 내부 매커니즘은 다음과 같습니다.
            
            1. **얕은 비교 수행 (Shallow Compare)**
            컴포넌트가 리렌더링되면 리액트는 이전 렌더링 시점의 deps 배열 요소들과 현재 렌더링 시점의 deps 배열 요소들을 하나씩 대조하며 얕은 비교(`Object.is`)를 수행합니다.
            2. **의존성 값이 이전과 같을 때 (재사용)**
            배열 안의 모든 값이 이전 렌더링 때와 완벽히 같다면, 리액트는 이번 렌더링 과정에서 새롭게 파싱된 인라인 함수 코드를 가차 없이 버립니다. 그리고 가상 저장소에 킵해두었던 **최초 혹은 이전 회차에 생성된 함수의 메모리 주소(참조값)를 그대로 컴포넌트에 반환**합니다.
            3. **의존성 값이 하나라도 다를 때 (재생성)**
            배열 안의 값 중 단 하나라도 주소나 데이터가 바뀐 것이 감지되면, 리액트는 기존 함수 주소를 폐기 처리합니다. 이어서 **현재 변경된 최신 상태값들을 스코프 체인에 단단히 결합한 새로운 함수 객체를 메모리에 올리고, 이 새 주소값으로 저장소를 교체**합니다. 이에 따라 자식 컴포넌트가 받는 props의 주소도 변경되므로 자식 역시 최신 데이터를 기반으로 새롭게 리렌더링을 시작하게 됩니다.
    - **`useCallabck`**에서 중요한 개념 🍠
        
        # **`useCallabck`**에서 중요한 개념
        
        ---
        
        - **참조 동일성(reference equality)** 이 왜 중요한지 (=== 비교)
            - **메모리 주소 비교**: 자바스크립트에서 객체, 배열, 함수는 참조 타입입니다. 내용물이 완벽히 같아도 메모리 상의 주소가 다르면 `===`(엄격한 동등 비교) 연산 결과는 `false`가 됩니다.
            - **리액트의 판단 기준**: 리액트의 `React.memo`, `useEffect`, `useCallback` 등의 의존성 배열은 내부적으로 얕은 비교(Shallow Compare, `Object.is` 혹은 `===`)를 통해 변경 여부를 감지합니다.
            - **최적화의 전제 조건**: 함수의 내용이 바뀌지 않았더라도 리렌더링으로 인해 새로운 주소값이 할당되면, 리액트는 이를 '다른 함수'로 인식합니다. 따라서 `useCallback`을 통해 메모리 주소를 고정하는 **참조 동일성**을 지켜주어야 자식 컴포넌트의 불필요한 렌더링을 방어할 수 있습니다.
        - 클로저와 상태: 콜백 안에서 state, props를 사용할 때 주의할 점
            - **클로저(Closure)의 성질**: 자바스크립트 함수는 **생성되는 시점**의 주변 환경(렉시컬 스코프)에 있는 변수(State, Props)들을 캡처하여 기억합니다.
            - **리액트 렌더링과의 충돌**: 리액트에서 컴포넌트가 리렌더링된다는 것은 새로운 스냅샷(최신 State와 Props)을 가진 함수가 통째로 다시 실행됨을 뜻합니다.
            - **주의할 점**: `useCallback`으로 함수를 메모리에 박제해 버리면, 그 함수는 최신 렌더링 주기의 변수가 아닌 **자신이 생성되었던 과거 렌더링 주기의 변수 스냅샷**을 계속 바라보게 됩니다.
        - **stale closure(낡은 값 캡처)** 문제는 언제 생기는지, 어떻게 피하는지
            
            ### ① 언제 발생하는가?
            
            - `useCallback` 내부에서 컴포넌트의 상태(State)나 Props를 참조하고 있음에도 불구하고, **의존성 배열(deps)을 빈 배열(`[]`)로 넘기거나 해당 변수를 누락했을 때** 발생합니다.
            - 함수는 최초 마운트 시점의 낡은(Stale) 상태값만 캡처해 둔 채 재사용되므로, 이후 상태가 아무리 업데이트되어도 계속 초기값이나 이전 값만 출력하는 동기화 오류를 범하게 됩니다.
            
            ### ② 어떻게 피하는가?
            
            - **방법 1: 의존성 배열(deps) 채우기**
            함수 내부에서 사용하는 모든 동적 변수(State, Props)를 의존성 배열에 명시합니다. 변수가 바뀔 때마다 리액트가 함수를 새로 생성하여 최신 상태를 다시 캡처하도록 유도합니다.
                
                ```tsx
                // count가 바뀔 때마다 함수를 새로 만들어 최신 count를 반영함
                const logCount = useCallback(() => {
                  console.log(count);
                }, [count]);
                ```
                
            - **방법 2: 함수형 업데이트(Functional Updates) 활용**`useState`의 상태 변경 함수에 값이 아닌 콜백 함수(`prev => prev + 1`)를 넘겨주면, 현재 상태값을 인자로 직접 주입받기 때문에 상태 변수 자체에 대한 의존성을 끊어낼 수 있습니다. 의존성 배열을 빈 배열(`[]`)로 유지하면서도 안전하게 최신 상태를 반영합니다.
                
                ```tsx
                // count 변수를 직접 참조하지 않으므로 빈 배열([])로 최적화 유지 가능
                const increment = useCallback(() => {
                  setCount((prev) => prev + 1);
                }, []);
                ```
                
    - **`useCallabck`**을 사용한 콜백 메모이제이션 예시 🍠
        
        # **`useCallabck`**을 사용한 콜백 메모이제이션 예시
        
        ---
        
        - 부모에서 자식으로 콜백을 내려줄 때, `onClick`, `onChange` 같은 핸들러를 **`useCallabck`** 없이 넘겼을 때와 **`useCallabck`**으로 감싸서 넘겼을 때 차이
            
            ### 1. `useCallback` 없이 핸들러를 넘겼을 때
            
            - **동작 원리**: 부모 컴포넌트가 자신의 상태 변경 등으로 인해 리렌더링될 때마다, 내부에 선언된 `onClick` 이나 `onChange` 함수는 매번 새로운 메모리 주소(참조값)를 할당받으며 새로 생성됩니다.
            - **자식 컴포넌트에 미치는 영향**: 자식 컴포넌트를 `React.memo`로 감싸서 최적화를 시도했더라도, 부모가 넘겨주는 함수의 주소값이 매번 바뀌기 때문에 자식 입장에서는 "새로운 props가 들어왔다"고 판단합니다.
            - **결과**: 부모가 리렌더링될 때마다 자식 컴포넌트도 **불필요하게 동반 리렌더링**을 일으킵니다.
            
            ### 2. `useCallback`으로 감싸서 핸들러를 넘겼을 때
            
            - **동작 원리**: 부모 컴포넌트가 리렌더링되더라도, 의존성 배열(`deps`)의 값이 바뀌지 않았다면 최초 마운트 시점에 생성되었던 함수의 메모리 주소를 그대로 유지(메모이제이션)하여 반환합니다.
            - **자식 컴포넌트에 미치는 영향**: 자식 컴포넌트가 `React.memo`로 감싸져 있다면, 자식이 받는 `onClick` 이나 `onChange` props의 주소값이 이전 렌더링 때와 완벽히 동일하므로 얕은 비교(`===`)를 통과합니다.
            - **결과**: 부모 컴포넌트가 아무리 자주 리렌더링되어도, 자식 컴포넌트는 자신의 데이터가 바뀐 게 아니라면 리렌더링을 완전히 스킵(Bailout)합니다.
            
            | **구분** | **useCallback 미사용** | **useCallback 사용** |
            | --- | --- | --- |
            | **함수 객체의 주소값** | 부모 리렌더링 시마다 **매번 변경됨** | 의존성이 변하지 않는 한 **기존 주소 고정** |
            | **자식 컴포넌트의 props 비교** | `prevProps.onClick === nextProps.onClick` 👉 **`false`** | `prevProps.onClick === nextProps.onClick` 👉 **`true`** |
            | **`React.memo` 작동 여부** | 주소값이 계속 바뀌므로 **작동 안 함** (무용지물) | 주소값이 유지되므로 **정상 작동함** |
            | **최적화 결과** | 부모를 따라 자식도 불필요하게 렌더링됨 (성능 낭비) | 자식의 불필요한 렌더링을 차단함 (성능 이득) |
        
    - 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시 🍠
        
        # 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시
        
        ---
        
        - 버튼 클릭 시 API 호출하는 핸들러를 `useCallback`으로 감싸는 패턴
            
            버튼 클릭 시 비동기 API를 호출하는 핸들러를 최적화하는 패턴입니다. 무거운 자식 컴포넌트에 핸들러를 넘겨주거나, 함수 호출의 일관성을 유지할 때 사용합니다.
            
            ```tsx
            import { useState, useCallback } from 'react';
            
            export default function AsyncHandlerExample({ userId }: { userId: string }) {
              const [loading, setLoading] = useState(false);
            
              // ✨ 비동기 API 호출 함수를 useCallback으로 메모이제이션
              // 외부에서 주입된 userId에 의존하므로 deps 배열에 userId를 추가합니다.
              const handleFetchUserProfile = useCallback(async () => {
                setLoading(true);
                try {
                  const response = await fetch(`https://api.example.com/users/${userId}`);
                  const data = await response.json();
                  console.log('유저 정보 로드 완료:', data);
                } catch (error) {
                  console.error(error);
                } finally {
                  setLoading(false);
                }
              }, [userId]); // userId가 바뀔 때만 새로운 함수를 생성
            
              return (
                <button onClick={handleFetchUserProfile} disabled={loading}>
                  {loading ? '로딩 중...' : '프로필 가져오기'}
                </button>
              );
            }
            ```
            
        - `useEffect` 안에서 의존성으로 콜백을 넣을 때 패턴
            
            `useEffect` 내부에서 컴포넌트 스코프의 함수를 호출해야 한다면, 그 함수를 반드시 `useCallback`으로 감싸야 합니다. 감싸지 않은 함수를 `useEffect` 의존성 배열에 넣으면 **매 렌더링마다 함수 주소가 바뀌어 `useEffect`가 무한 루프에 빠지는 대참사**가 발생합니다.
            
            ```tsx
            import { useState, useEffect, useCallback } from 'react';
            
            export default function UseEffectDependencyPattern({ keyword }: { keyword: string }) {
              const [results, setResults] = useState<string[]>([]);
            
              // 1. useEffect 내부에서 쓸 비동기 함수를 useCallback으로 묶어 주소값 고정
              const fetchSearchResults = useCallback(async () => {
                if (!keyword) return;
                const response = await fetch(`https://api.example.com/search?q=${keyword}`);
                const data = await response.json();
                setResults(data);
              }, [keyword]); // keyword가 바뀔 때만 함수의 참조 등가성이 깨짐
            
              // 2. 고정된 함수 참조를 의존성 배열에 안전하게 주입
              useEffect(() => {
                fetchSearchResults();
              }, [fetchSearchResults]); // useCallback 덕분에 무한 루프가 발생하지 않음
            
              return (
                <ul>
                  {results.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              );
            }
            ```
            
        - 폼 제출 핸들러, 디바운스/스로틀 함수와 함께 사용할 때
            
            디바운스(Debounce)나 스로틀(Throttle) 함수는 내부적으로 타이머(`setTimeout`) 유효 범위를 유지하는 클로저를 형성합니다. `useCallback`으로 감싸지 않으면 렌더링할 때마다 새로운 디바운스 함수가 생성되어 기존 타이머가 계속 초기화(디바운스 무력화)됩니다.
            
            ```tsx
            import { useState, useCallback } from 'react';
            import debounce from 'lodash/debounce'; // 실무 표준 lodash 디바운스 활용 예시
            
            export default function FormAndDebounceExample() {
              const [searchQuery, setSearchQuery] = useState('');
            
              // 폼 제출 핸들러 (입력 상태와 상관없이 주소값 고정)
              const handleSubmit = useCallback((e: React.FormEvent) => {
                e.preventDefault();
                console.log('폼 최종 제출 완료');
              }, []);
            
              // ✨ 디바운스 함수는 무조건 의존성 배열을 빈 배열([])로 고정해야 함
              // 렌더링마다 lodash.debounce가 새로 실행되어 타이머가 터지는 것을 완벽 차단
              const debounceSearchAPI = useCallback(
                debounce((value: string) => {
                  console.log(`📡 디바운스 적용 - [${value}] API 요청 발송!`);
                }, 300),
                []
              );
            
              const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const nextValue = e.target.value;
                setSearchQuery(nextValue);
                debounceSearchAPI(nextValue); // 사용자가 입력을 멈추고 0.3초 뒤에 실행됨
              };
            
              return (
                <form onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={handleInputChange} 
                    placeholder="검색어를 입력하세요 (디바운스 작동)" 
                  />
                  <button type="submit">검색</button>
                </form>
              );
            }
            ```
            
        
- **`memo`**에 대하여 정리해주세요!🍠
    
    # **`memo`**에 대하여 정리해주세요!🍠
    
    ---
    
    - **`memo`**가 무엇인지? 🍠
        
        # **`memo`**가 무엇인지?
        
        ---
        
        - **정의**: `React.memo`는 컴포넌트의 고질적인 문제인 불필요한 리렌더링을 방지하여 성능을 최적화할 수 있도록 돕는 고차 컴포넌트(Higher-Order Component, HOC)입니다.
        - **동작 원리**: 컴포넌트가 전달받는 **props의 변경 여부를 스스로 감지**합니다. 만약 이전 렌더링 때의 props와 현재 렌더링 때의 props가 완벽히 같다면, 리액트는 컴포넌트 함수를 실행하지 않고 가상 DOM 연산 과정을 건너뛴 채 **메모리에 저장해 둔 기존의 렌더링 결과물(HTML 스냅샷)을 그대로 재사용**합니다.
    - 왜 **`memo`**를 사용하는지? 🍠
        
        # 왜 **`memo`**를 사용하는지?
        
        ---
        
        - **리액트의 기본 렌더링 전파 차단**: 리액트는 부모 컴포넌트의 상태(State)가 바뀌면 하위에 있는 모든 자식 컴포넌트들을 무조건 함께 리렌더링하는 전방위적 전파 매커니즘을 가지고 있습니다.
        - **불필요한 연산 낭비 방지**: 자식 컴포넌트가 받는 데이터(props)가 변하지 않았고 내부 상태도 그대로임에도 불구하고, 단지 부모가 리렌더링되었다는 이유만으로 자식이 매번 무거운 DOM 연산을 새로 수행하는 것은 심각한 자원 낭비입니다.
        - `React.memo`를 사용하면 props가 변하지 않는 자식 컴포넌트의 리렌더링 흐름을 중간에서 단단히 가로막아(Bailout), 화면 전체의 **렌더링 연산 비용을 획기적으로 절감**하고 부드러운 유저 경험을 유지할 수 있습니다.
    - **`memo`** 기본 사용법 🍠
        
        # **`memo`** 기본 사용법
        
        ---
        
        방법 1. 컴포넌트 선언과 동시에 감싸기 (실무 선호 패턴)
        
        ```tsx
        import React from 'react';
        
        interface Props {
          title: string;
        }
        
        // ✨ 컴포넌트 전체를 React.memo로 감싸줍니다.
        const MyComponent = React.memo(({ title }: Props) => {
          console.log("🎨 [MyComponent] 렌더링 발생!");
          return <div>{title}</div>;
        });
        
        MyComponent.displayName = 'MyComponent';
        export default MyComponent;
        ```
        
        방법 2. Export 시점에 감싸기
        
        ```tsx
        import React from 'react';
        
        function UserProfile({ name }: { name: string }) {
          return <div>유저 이름: {name}</div>;
        }
        
        // ✨ 내보낼 때 memo를 씌워서 내보냅니다.
        export default React.memo(UserProfile);
        ```
        
    - **`memo`**를 언제 쓰면 좋은지 / 안 좋은지 🍠
        
        # **`memo`**를 언제 쓰면 좋은지 / 안 좋은지
        
        ---
        
        ### 1. 언제 쓰면 좋은지 (적극 권장)
        
        - **순수 컴포넌트일 때**: 동일한 props를 받았을 때 항상 100% 같은 화면만 그려주는 UI 컴포넌트(Pure Component)일 때 완벽하게 동작합니다.
        - **부모는 자주 바뀌는데 자식 props는 고정일 때**: 부모 컴포넌트가 실시간 타이머, 스크롤 감지, 검색어 입력 등으로 초당 수십 번씩 리렌더링되지만, 정작 자식이 물고 있는 props는 거의 고정되어 있을 때 극적인 성능 이득을 봅니다.
        - **컴포넌트 자체 가 무겁고 복잡할 때**: 내부에 수많은 자식 요소를 품고 있거나, 복잡한 SVG 차트 애니메이션, 데이터 매핑 로직 등이 담겨 있어 **한 번 리렌더링될 때의 비용이 확연히 체감되는 컴포넌트**에 적용해야 의미가 있습니다.
        
        ### 2. 언제 쓰면 안 좋은지 (남용 금지)
        
        - **props가 렌더링마다 높은 확률로 바뀔 때**: 화면이 켜져 있는 동안 props 데이터가 계속 역동적으로 변하는 컴포넌트라면 `memo`를 쓰면 안 됩니다. 리액트는 `props가 바뀌었나?` 검사하는 비용(Shallow Compare)을 소모한 뒤, 결국 `바뀌었네!` 하고 렌더링을 또 수행하므로 **최적화 검사 비용만 2중으로 낭비**하는 꼴이 됩니다.
        - **컴포넌트의 연산 비용이 매우 저렴할 때**:순수하게 단순 텍스트 레이블 하나 띄우는 `<p>{text}</p>` 수준의 가벼운 컴포넌트는 `memo`를 쓰는 주소 대조 비용이 그냥 렌더링 한 번 새로 하는 비용과 별반 다르지 않거나 오히려 더 클 수 있습니다.
        - **참조 등가성 처리를 안 해준 객체를 props로 받을 때**: 부모가 `useMemo`나 `useCallback` 처리를 하지 않은 인라인 객체(`{}`)나 익명 함수를 자식에게 그냥 넘겨준다면, `React.memo`는 매번 주소값이 바뀐 걸 감지하므로 최적화 효과를 전혀 보지 못합니다.

        # **`useMemo`** 에 대하여 정리해주세요! 🍠

---

- **`useMemo`**가 무엇인지? 🍠
    
    # **`useMemo`**가 무엇인지? 🍠
    
    ---
    
    - **정의**: `useMemo`는 컴포넌트가 리렌더링될 때 마다 **복잡한 연산(함수 호출)의 결과값을 매번 다시 계산하지 않고, 메모리에 저장(캐싱)해 두었다가 재사용**할 수 있도록 돕는 리액트의 대표적인 최적화 훅입니다.
    - **핵심 동작**: 함수의 호출 자체를 제어하여 **값(Value)을 메모이제이션**합니다. `useCallback`이 '함수 자체의 주소값'을 기억한다면, `useMemo`는 '함수가 실행되고 뱉어낸 최종 결과값'을 기억한다는 점에서 명확한 차이가 있습니다.
- 왜 **`useMemo`**를 사용하는지? 🍠
    
    # 왜 **`useMemo`**를 사용하는지? 🍠
    
    ---
    
    ### 1) 무거운 연산 비용의 절감 (CPU 자원 방어)
    
    리액트 컴포넌트는 상태가 하나만 바뀌어도 함수 전체가 재실행됩니다. 만약 컴포넌트 내부에 만 개짜리 배열을 필터링하거나 정렬하는 무거운 로직이 있다면, 그와 전혀 상관없는 다른 상태(예: 입력창 타이핑)가 바뀔 때도 매번 무거운 연산이 돌아가 화면이 버벅거리게 됩니다. `useMemo`를 쓰면 관련 데이터가 바뀔 때만 딱 한 번 연산하고 그 외에는 이미 계산된 값을 쏙 꺼내와서 화면을 그리므로 성능을 획기적으로 올릴 수 있습니다.
    
    ### 2) 참조 등가성(Referential Equality) 유지를 통한 하위 최적화 방어
    
    자바스크립트에서 객체(`{}`)나 배열(`[]`)은 모양이 같아도 리렌더링 때마다 새로운 주소값을 가집니다. 부모가 자식 컴포넌트(`React.memo`)에게 객체 데이터를 넘겨주거나, `useEffect` 의존성 배열에 객체를 넣으면 주소값이 매번 바뀌어 최적화가 깨지고 무한 루프가 돌 수 있습니다. `useMemo`로 객체나 배열의 참조 주소를 고정해 주면 이러한 주소값 변동 문제를 원천 차단할 수 있습니다.
    
- **`useMemo`** 기본 사용법 🍠
    
    # **`useMemo`** 기본 사용법 🍠
    
    ---
    
    ```tsx
    const cachedValue = useMemo(() => {
      // 💡 여기에 메모이제이션하고 싶은 무거운 계산 로직을 작성합니다.
      return expensiveCalculation(a, b);
    }, [a, b]); // 💡 의존성 배열인 a 혹은 b가 변경될 때만 위의 함수가 다시 실행됩니다.
    ```
    
    - **첫 번째 인자**: 값을 반환하는 익명 함수(콜백)를 받습니다. 리액트는 최초 렌더링 시 이 함수를 실행하고 결과값을 기억합니다.
    - **두 번째 인자**: 의존성 배열(`deps`)입니다. 이 배열에 넣은 값이 이전 렌더링과 비교해 바뀔 때만 첫 번째 인자 함수를 새로 실행해 결과값을 갱신합니다.
    
- **`useMemo`**에서 중요한 개념 🍠
    
    # **`useMemo`**에서 중요한 개념 🍠
    
    ---
    
    ### 1) 값의 캐싱과 메모리 트레이드 오프
    
    - `useMemo`는 마법처럼 성능을 공짜로 올려주는 도구가 아닙니다. 이전의 결과값과 의존성 배열을 가상 메모리에 보관하고 렌더링 때마다 배열의 요소를 하나씩 대조하는 **비교 연산 비용**이 추가로 발생합니다.
    - 따라서 단순한 산술 연산(`a + b`)이나 가벼운 텍스트 결합에 `useMemo`를 사용하는 것은 오히려 성능상 손해(오버헤드)가 될 수 있으므로 반드시 비용이 큰 연산에만 제한적으로 사용해야 합니다.
    
    ### 2) 의존성 배열의 동등 비교 메커니즘
    
    - `useMemo` 역시 리액트의 표준 얕은 비교(`===`) 컨벤션을 따릅니다. 의존성 배열에 넣은 값이 원시 타입이 아니라 메모이제이션되지 않은 참조 타입(객체/배열)이라면 리액트가 바뀐 것으로 착각하여 `useMemo`가 매번 실행되는 버그가 생기므로 주의해야 합니다.
    
    ## 
    
- **`useMemo`** 실전 예시 🍠
    
    # **`useMemo`** 실전 예시 🍠
    
    ---
    
    예시 1. 대용량 데이터의 필터링 및 정렬 (무거운 연산 최적화)
    
    ```tsx
    import { useState, useMemo } from 'react';
    
    interface Product {
      id: number;
      name: string;
      category: string;
    }
    
    export default function ProductList({ products }: { products: Product[] }) {
      const [filterCategory, setFilterCategory] = useState<string>('All');
      const [searchQuery, setSearchQuery] = useState<string>(''); // 👈 이 값이 바뀔 때 필터 연산이 재실행되면 낭비!
    
      // ✨ products 배열이 만 개가 넘는 대용량일 때, filterCategory가 바뀔 때만 재연산하도록 고정
      const filteredProducts = useMemo(() => {
        console.log("⚡ [useMemo] 대규모 배열 필터링 연산 실행 중...");
        if (filterCategory === 'All') return products;
        return products.filter(product => product.category === filterCategory);
      }, [products, filterCategory]); // 💡 searchQuery가 바뀔 때는 이 연산을 건너뛰고 캐싱된 값을 재사용함
    
      return (
        <div>
          <input 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="검색어 입력 (리렌더링 유발용)" 
          />
          
          <select onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">전체</option>
            <option value="Electronics">전가제품</option>
            <option value="Books">도서</option>
          </select>
    
          <ul>
            {filteredProducts.map(p => <li key={p.id}>{p.name}</li>)}
          </ul>
        </div>
      );
    }
    ```
# **추가로 본인이 학습한 내용에 대해서 정리해주세요** 🍠

---

## 🍠 1. 무료 플랜 빌드 시간(Build Minutes)을 아끼는 기적의 이그노어(Ignore) 스크립트

Vercel 무료 플랜은 한 달에 **1000분**의 빌드 시간을 줍니다. 혼자 개발할 때는 넉넉해 보이지만, README.md를 고치거나 주석만 바꿨는데도 깃허브에 푸시할 때마다 Vercel이 눈치 없이 빌드를 새로 돌려 빌드 시간을 갉아먹곤 합니다.

### 💡 꿀팁: Ignored Build Step 설정하기

Vercel 프로젝트 세팅의 `Git` -> `Ignored Build Step` 메뉴에 아래와 같은 한 줄짜리 쉘 명령어를 넣어두면 **실제 웹 소스코드(`src`, `public` 등)가 바뀐 게 아닐 때는 빌드를 아예 생략**하고 바로 Pass 시켜버립니다.

Bash

```
# src 폴더나 package.json에 변동이 있을 때만 빌드를 진행하라는 명령어
git diff --quiet HEAD^ HEAD ./src ./package.json
```

- **결과**: 무의미한 빌드가 차단되어 한 달 제한 시간을 극적으로 아낄 수 있고, 배포 대기열(Queue)이 밀리는 현상도 방지할 수 있습니다.

## 🍠 2. AWS Lambda(서버리스) vs V8 이솔레이트(엣지) 인프라의 비밀

Vercel에서 Next.js나 백엔드 서버리스 함수(API Routes)를 배포하면 백엔드 인프라가 자동으로 세팅되는데, 이때 **Serverless**와 **Edge** 두 종류의 인프라 분기를 완벽히 이해해야 성능을 쥐어짜낼 수 있습니다.

### 1) Serverless Runtime (기본값)

- **네트워크**: AWS Lambda 기반으로 구동됩니다.
- **특징**: Node.js의 모든 패키지(Prisma, 암호화 라이브러리 등)를 제한 없이 다 쓸 수 있어 강력하지만, 한동안 요청이 없다가 들어오면 서버가 켜지는 데 시간이 걸리는 **콜드 스타트(Cold Start)** 조율이 필요합니다.
- **🚨 기본값의 함정**: Vercel 서버리스 함수의 기본 리전(Region)은 미국 동부(`iad1` - 워싱턴 D.C.)입니다. 한국에서 데이터베이스를 연동해 API를 쏘면 서울 DB <-> 미국 Vercel 서버를 왕복하느라 속도가 심각하게 느려집니다.
- **🛠 해결책**: `vercel.json` 파일을 파서 반드시 서버 리전을 한국 서울(`icn1`)로 고정해 주어야 합니다.JSON
    
    ```
    {
      "regions": ["icn1"]
    }
    ```
    

### 2) Edge Runtime

- **네트워크**: 전 세계 CDN(콘텐츠 전송 네트워크) 서버에 코드가 분산 배치되어 유저와 가장 가까운 물리적 거리에서 실행됩니다.
- **특징**: V8 이솔레이트 엔진 기반이라 가볍고 **콜드 스타트가 0초**에 가깝습니다. 응답 속도가 무시무시하게 빠릅니다.
- **단점**: Node.js 전체 기능을 쓰지 못하고 최소한의 웹 표준 API만 지원하므로, 무거운 DB 무력화 연산이나 특정 라이브러리는 에러가 날 수 있어 가벼운 미들웨어(인증 체크, 리다이렉트 등)에 적합합니다.

## 🍠 3. 유저의 ChunkLoadError를 막아주는 Skew Protection (배포 시차 보호)

리액트나 Next.js는 빌드할 때 코드를 쪼개서 `main.1234.js`, `page.5678.js` 같은 청크(Chunk) 파일들로 만듭니다.

여기서 실무에서 자주 터지는 끔찍한 버그 시나리오가 있습니다.

1. 유저가 서비스 화면을 열어놓고 글을 읽고 있는 중입니다. (구버전 청크를 물고 있음)
2. 개발자가 기능을 새로 추가해서 Vercel에 새 버전을 배포(Production Deploy)합니다.
3. Vercel 서버의 파일들이 신버전 청크(`main.abcd.js`)로 싹 교체됩니다.
4. 유저가 화면 안에서 다른 페이지로 이동하는 버튼을 누르는 순간, 브라우저가 예전 청크 파일(`page.5678.js`)을 서버에 요청하지만 **서버에는 이미 새 파일밖에 없으므로 404 에러가 나며 화면이 완전히 뻗어버립니다(`ChunkLoadError`).**

### 💡 Vercel의 방어 기전

Vercel은 이를 막기 위해 **Skew Protection** 기능을 제공합니다. 새로운 배포가 라이브로 올라가더라도, 기존 구버전 세션을 잡고 있는 유저들을 위해 구버전 청크 파일들을 일정 시간 동안 백그라운드 메모리에 지우지 않고 유지해 줍니다. 유저가 새로고침을 하기 전까지 화면이 터지는 대참사를 인프라 레벨에서 막아주는 고마운 기능입니다.

## 🍠 4. Turborepo와 연계되는 무적의 레모트 캐싱 (Remote Caching)

프로젝트 규모가 커져서 서비스들을 모노레포(Monorepo) 구조로 묶고 Vercel의 빌드 툴인 **Turborepo**를 얹으면, 그대부터 CI/CD 속도가 압도적으로 빨라집니다.

- **동작 원리**: 팀원 A가 로컬에서 특정 컴포넌트를 빌드한 적이 있다면, Vercel은 그 빌드 결과물(Hash)을 **클라우드 스토어에 캐싱**해 둡니다.
- **이득**: 이후 Git에 푸시되어 Vercel CI/CD가 돌 때, Vercel은 처음부터 빌드하지 않고 클라우드에 저장된 팀원 A의 빌드 캐시를 그대로 복사해 와서 배포를 끝내버립니다. 빌드 시간이 5분 걸리던 프로젝트가 단 **몇 초** 만에 배포 완료되는 신세계를 경험할 수 있습니다.

## 🍠 5. 백엔드 가기 전에 입구 컷 하거나 우회하는 `vercel.json` 고급 라우팅

CORS 에러를 잡으려고 리액트나 익스프레스 코드 내부에서 복잡하게 헤더 세팅을 만질 필요가 없습니다. Vercel 라우터 단에서 미리 가로채서 헤더를 주입하거나 프록시(Proxy)를 걸어버릴 수 있습니다.
    