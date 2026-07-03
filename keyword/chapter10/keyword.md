# Referential Equality (참조 동일성)
- **리액트 렌더링 최적화**와 **`Referential Equality`**는 어떤 관계가 있을까요? 🍠
    
    **1️⃣ Referential Equality (참조 대등성)의 개념**
    
    JavaScript에서 데이터 타입은 원시 타입(Primitive)과 참조 타입(Reference)으로 나뉜다.
    **참조 대등성**은 객체, 배열, 함수 같은 참조 타입 데이터를 비교할 때 "메모리 주소값이 같은가?"를 따지는 개념이다.
    
    **2️⃣ React의 렌더링 감지 메커니즘 : Shallow Compare**
    
    리액트는 컴포넌트의 상태(State)나 props가 변경 되었는지 판단할 때 성능을 위해 객체의 내부 속성을 참조 대등성(메모리 주소 비교)만을 따지는 얕은 비교를 수행한다.
    
    - **불변성을 지키지 않아 렌더링이 누락됨**
        
        원본 객체를 직접 수정하면 알맹이는 바뀌었지만 메모리 주소는 그대로이기에 변경 사항이 없다고 판단하여 화면을 리렌더링 하지 않는 오류가 발생한다.
        
    - **매번 새로운 참조가 생성되어 불필요한 재렌더링이 발생됨**
        
        컴포넌트가 한 번 리렌더링될 때마다, 함수 내부에 선언된 객체, 배열, 함수들은 코드가 처음부터 다시 실행되면서 새로운 메모리 주소(참조)를 할당 받는다.
        
    
    **3️⃣ 리액트 렌더링 최적화**
    
    리액트가 제공하는 최적화 도구들(`React.memo`, `useMemo`, `useCallback`)은 참조 대등성을 인위적으로 유지하거나 제어하기 위해 존재한다.
    
    #### 1 ) `React.memo`와 Props의 참조 대등성
    
    자식 컴포넌트가 받는 Props를 얕은 비교하여 Props가 바뀌지 않으면 부모 컴포넌트가 리렌더링되더라도 자식 컴포넌트의 재렌더링을 방어(Memoization)한다.
    
    부모가 자식에게 Props로 `{}` (객체)나 `[]` (배열)를 넘겨주면 부모가 렌더링될 때마다 새로운 메모리 주소가 생성되므로 `React.memo`는 참조가 달라진 것을 보고 최적화를 무시한 채 자식을 강제로 리렌더링시킨다.
    
    #### 2 ) **`useMemo`를 통한 객체/배열의 참조 대등성 유지**
    
    `useMemo`는 의존성 배열의 값이 바뀌지 않으면 이전에 생성된 객체나 배열의 메모리 주소(참조)를 그대로 보존하여 반환한다.
    
    ```tsx
    // ❌ 부모가 리렌더링될 때마다 새로운 참조 주소가 생성됨
    const userInfo = { nickname: "동동", role: "Developer" }; 
    
    // ⭕ 의존성이 변하지 않으면 동일한 메모리 주소를 유지함
    const userInfo = useMemo(() => ({ nickname: "동동", role: "Developer" }), []);
    ```
    
    #### 3 ) `useCallback`을 통한 함수의 참조 대등성 유지
    
    컴포넌트 내부에서 선언한 이벤트 핸들러 함수는 렌더링될 때마다 새 주소를 가진다. `useCallback`은 **함수 객체의 메모리 주소를 고정**시켜 자식에게 전달되는 Props의 참조 대등성을 지켜준다.
---

# useCallback
- **`useCallabck`** 에 대하여 정리해주세요! 🍠
    
    # **`useCallabck`** 에 대하여 정리해주세요! 🍠
    
    ---
    
    - **`✔️useCallabck`** 이 무엇인지? 🍠
        
        # **`useCallabck`** 이 무엇인지?
        
        ---
        
        - 함수(콜백)를 “메모이제이션” 한다는 게 무슨 뜻인지?
            
            함수를 매번 새로 만드는 비효율을 줄이기 위해 최초 호출 시 생성된 함수의 참조(메모리 주소)를 React의 메모리 저장소에 기록(캐싱)해 두고 다음 렌더링 때 새로운 함수를 파는 대신 저장소에서 기존 함수의 주소값을 그대로 꺼내와 재사용하는 것을 의미한다.
            
        - 언제 새 함수를 만들고, 언제 기존 함수를 재사용하는지?
            
            `useCallback`의 두 번째 인자인 의존성 배열(Dependency Array, `[]`)이 결정한다
            
            - **기존 함수를 재사용하는 경우:** 리렌더링이 일어났을 때 의존성 배열에 넣어둔 모든 값들이 이전 렌더링 시점의 값과 비교하여 단 하나도 바뀌지 않았다면(`Object.is` 비교 결과 대등하면) 새로 함수를 정의하지 않고 기존에 캐싱해 둔 함수의 참조를 그대로 사용한다
            - **새 함수를 만드는 경우:** 의존성 배열에 포함된 상태(State)나 Props 중 ****하나라도 이전 렌더링과 비교해 값이 바뀌었다면 이전 캐시를 버리고 현재 시점의 최신 상태를 반영한 ****새로운 함수 객체를 생성하여 메모리를 갱신한다.
    - ✔️왜 **`useCallabck`**을 사용하는지? 🍠
        
        # 왜 **`useCallabck`**을 사용하는지?
        
        ---
        
        - **불필요한 리렌더링 방지**와 어떤 관련이 있는지
            
            부모 컴포넌트가 리렌더링되면 자식 컴포넌트도 Props의 변경 여부와 상관없이 렌더링 스택에 쌓고 다시 그린다. 성능 최적화를 위해 자식 컴포넌트를 `React.memo`로 감싸두면 Props가 바뀌지 않았을 때 렌더링을 안할수 있다.
            
            하지만 부모 컴포넌트 내부에 선언된 함수를 자식에게 Props로 넘겨줄 경우 `React.memo`를 썼더라도 리렌더링된다. 
            
            ⇒ **`useCallback`으로 함수의 참조를 고정해 주어야만 `React.memo`가 정상적으로 작동하며 자식의 불필요한 리렌더링을 방어할 수 있다**
            
        - 성능 최적화 관점에서 얻는 이득 vs 남용했을 때의 오버헤드
            
            #### 1️⃣ 얻는 이득
            
            - **자식 컴포넌트의 가상 DOM 연산 스킵:** 규모가 크고 복잡한 하위 컴포넌트 트리가 부모 때문에 렌더링되는 것을 차단하여 CPU 연산 비용과 브라우저 부담을 줄인다.
            - **불필요한 데이터 통신/이펙트 방지:** `useEffect`의 의존성에 함수가 들어가 있을 때 함수 주소가 고정되므로 서버 API를 무한으로 호출하는 등의 사이드 이펙트 버그를 예방한다
            
            #### 2️⃣ 남용했을 때의 오버헤드
            
            - **초기 렌더링 시 메모리 및 연산 비용:** `useCallback`을 쓰면 함수를 그냥 만드는 것에 더해 1) 함수 선언문 자체를 실행하고, 2) 가상 메모리에 따로 백업하고, 3) 매번 의존성 배열 내부의 값들을 하나하나 비교(`Object.is`)하는 과정을 거쳐야 한다. 최적화가 필요 없는 가벼운 함수에 쓰면 오히려 느려지는 역효과가 난다.
            - **코드 가독성 저하 및 유지보수 난이도 상승:** 모든 함수에 `useCallback`과 의존성 배열을 사용하면 코드가 복잡해지고 잘못 관리했을 시 옛날 데이터를 참조하는 `Stale Closures` 버그에 노출될 위험이 있다.
    - **`✔️useCallabck`** 기본 사용법 🍠
        
        # **`useCallabck`** 기본 사용법
        
        ---
        
        - **`useCallabck`**은 어떻게 사용하나요? (코드)
            
            `useCallback`은 컴포넌트 최상단에서 호출하고 첫 번째 인자로 캐싱할 **함수 정의**를 전달하고, 두 번째 인자로 **의존성 배열**을 전달한다
            
            ```tsx
            import { useState, useCallback } from 'react';
            import ProductList from './ProductList';
            
            export default function ShoppingCartApp() {
              const [cartItems, setCartItems] = useState<string[]>([]);
              const [theme, setTheme] = useState<'light' | 'dark'>('light');
            
              // 하위 컴포넌트로 전달할 함수를 useCallback으로 감싸줌
              const handleAddItem = useCallback((newItem: string) => {
                setCartItems((prevItems) => [...prevItems, newItem]);
              }, []); // 의존성 배열이 비어있으므로 최초 1회만 생성 후 메모리 주소 고정
            
              return (
                <div className={theme === 'dark' ? 'bg-black text-white' : 'bg-white'}>
                  <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                    테마 변경 ({theme})
                  </button>
                  
                  {/* handleAddItem의 참조 주소가 고정되어 테마가 바뀔 때 ProductList는 리렌더링되지 않습니다. */}
                  <ProductList onAddItem={handleAddItem} />
                </div>
              );
            }
            
            /*➡️ 테마 상태(theme)가 바뀌면 부모 컴포넌트인 ShoppingCartApp은 리렌더링된다. 
            만약 useCallback이 없었다면 handleAddItem 함수는 매번 새 주소를 할당받아 
            자식인 <ProductList />를 리렌더링 했을거지만 
            useCallback 덕분에 주소가 고정되어 자식의 가상 DOM 연산을 완벽히 방어하였다
            */
            ```
            
        - `deps` 배열에 무엇을 넣어야 하는지 규칙
            
            함수 본문 내부에서 참조하는 모든 컴포넌트 범위의 값(Props, State, 변수들)은 반드시 의존성 배열(deps)에 포함되어야 한다
            
            ```tsx
            // ❌ 내부에서 text 상태를 읽고 있지만 deps를 비워둠
            const handleLog = useCallback(() => {
              console.log(text); // 옛날 텍스트(Stale State)만 출력되는 오류
            }, []); 
            
            // ⭕ 내부에서 참조하는 모든 반응형 값을 deps에 명시
            const handleLog = useCallback(() => {
              console.log(text);
            }, [text]);
            ```
            
        - 의존성 변경 시 콜백이 어떻게 다시 만들어지는지
            
            컴포넌트가 리렌더링될 때마다 두 번째 인자로 넘어온 의존성 배열의 현재 값들과 저번 렌더링 때 저장해 둔 이전 값들을 `Object.is` 비교 알고리즘을 통해 대조한다
            
            1. **대조 결과 값이 모두 같다면:** 메모리에 보관 중이던 **기존 함수의 참조 주소**를 그대로 컴포넌트에 반환한다
            2. **하나라도 값이 다르다면:**  이전 캐시 주소를 파기한다. 그리고 현재 리렌더링 시점의 최신 Props나 State가 반영된 새로운 함수 객체를 메모리에 재등록하고, 그 새 주소를 반환한다.
    - **`useCallabck`**에서 중요한 개념 🍠
        
        # **`useCallabck`**에서 중요한 개념
        
        ---
        
        - **참조 동일성(reference equality)** 이 왜 중요한지 (=== 비교)
            
            리렌더링 여부를 결정할 때 성능 최적화를 위해 객체의 메모리 주소만을 비교하는 엄격한 대등 비교(Strict Equality Comparison, `===` 또는 `Object.is`)를 수행합니다.
            
            참조 동일성이 중요한 이유는, 리액트 내부의 `React.memo`나 훅의 의존성 배열(deps)이 이 `===` 비교 결과만을 보고 "데이터가 바뀌었는지"를 판단하기 때문입니다. 주소값이 다르면 내부에 담긴 함수 코드가 100% 동일하더라도 완전히 다른 값으로 인지하여 불필요한 렌더링이나 이펙트 재실행을 트리거합니다.
            
            ```tsx
            const handleAdd1 = () => console.log("add");
            const handleAdd2 = () => console.log("add");
            
            console.log(handleAdd1 === handleAdd2); // ❌ false
            ```
            
            자바스크립트 엔진에게 위 두 함수는 모양만 같은 뿐, 전혀 다른 아파트(메모리 주소)에 사는 별개의 존재입니다. `useCallback`은 이 두 함수의 메모리 주소를 `0x101`로 **동일하게 유지(Referential Equality)** 시켜줌으로써, 리액트 내부의 `===` 가드 시스템이 "어, 저번이랑 같은 함수네! 렌더링 건너뛰자!"라고 안심하고 패스할 수 있도록 만드는 열쇠입니다.
            
        - 클로저와 상태: 콜백 안에서 state, props를 사용할 때 주의할 점
            
            리액트의 컴포넌트는 함수형이며, 매 렌더링마다 그 시점의 상태(`state`, `props`)를 담은 고유의 스냅샷(Snapshot)을 가집니다.
            
            `useCallback` 내부에서 이 스냅샷 변수들을 참조할 때 주의할 점은, 자바스크립트의 **클로저(Closure)** 특성 때문에 함수는 "자신이 생성되었던 당시의 렌더링 시점의 상태"만을 꽉 붙잡고 기억한다는 점입니다. 컴포넌트가 리렌더링되어 새로운 상태 스냅샷이 찍히더라도, `useCallback`이 함수를 새로 동기화해 주지 않으면 함수는 과거의 스냅샷만 바라보는 치명적인 데이터 격리 현상이 발생합니다.
            
            ✔️
            
            함수는 정의되는 순간 주변 환경을 주머니에 쏙 집어넣는데, 이걸 클로저라고 합니다.
            
            컴포넌트의 `count` 상태가 0에서 1로 변했더라도, `useCallback` 내부의 함수가 과거 `count가 0이었던 시절`에 박제되어 있다면 이 함수를 아무리 실행해도 0이라는 옛날 값만 다루게 됩니다. 따라서 함수 내부에서 컴포넌트의 유동적인 반응형 데이터(`state`, `props`)를 다룰 때는 언제나 그 값이 최신 상태인지 클로저의 유효 범위를 극도로 주의해야 합니다.
            
        - **stale closure(낡은 값 캡처)** 문제는 언제 생기는지, 어떻게 피하는지
            
            ### 🚨 언제 생기는가?
            
            `useCallback` 내부에서 컴포넌트의 상태 변수를 사용하고 있으면서, 의존성 배열(deps)에 해당 상태를 누락했을 때 발생합니다.
            
            의존성 배열이 비어있거나(`[]`) 누락되면, React는 상태가 아무리 변해도 함수를 재생성하지 않고 최초 마운트 시점의 렌더링 스냅샷 버전을 계속 재사용합니다. 이때 함수가 과거의 낡은 데이터(Stale State)를 버리지 못하고 그대로 캡처해 두고 있는 상태를 **'Stale Closure(낡은 클로저)'** 버그라고 부릅니다.
            
            ### 🛠️ 어떻게 피하는가?
            
            공식 문서에서는 이 문제를 안전하게 피하기 위해 **2가지 명확한 해결책**을 제시합니다.
            
            **방법 A: 의존성 배열(deps)에 올바르게 동기화할 상태 명시하기**
            함수 내부에서 읽고 있는 변수를 deps에 정직하게 적어주면, 그 값이 바뀔 때마다 최신 스냅샷 환경을 주머니에 새로 차는 최신 함수로 알아서 세대교체(재생성)를 해줍니다.
            
            ```tsx
            // ⭕ text가 바뀔 때마다 최신 text를 캡처한 함수로 재생성됨
            const handleSave = useCallback(() => {
              sendDataToServer(text); 
            }, [text]);
            ```
            
            **방법 B: 함수형 업데이트(Functional Updates) 활용하기 (강력 추천 ✨)**
            
            만약 상태를 '조회'하는 목적이 아니라 단순 '변경(업데이트)'하는 목적인 경우,useState 의 세터 함수에 콜백 형태(prev => ...)를 전달하면 상태를 직접 참조하지 않아도 되므로 deps 배열을 완전히 비워두면서도 Stale 문제를 원천 봉쇄할 수 있습니다.
            
            ```tsx
            // ⭕ count 상태를 직접 읽지 않으므로 deps를 []로 유지하면서도 늘 최신 count 기반으로 동작함
            const handleIncrement = useCallback(() => {
              setCount((prevCount) => prevCount + 1); 
            }, []);
            ```
            
    - **`useCallabck`**을 사용한 콜백 메모이제이션 예시 🍠
        
        # **`useCallabck`**을 사용한 콜백 메모이제이션 예시
        
        ---
        
        - 부모에서 자식으로 콜백을 내려줄 때, `onClick`, `onChange` 같은 핸들러를 **`useCallabck`** 없이 넘겼을 때와 **`useCallabck`**으로 감싸서 넘겼을 때 차이
            
            
            ❌ Case 1: `useCallback` 없이 그냥 넘겼을 때
            
            ```tsx
            import { useState, memo } from 'react';
            
            // 자식 컴포넌트: React.memo로 감싸서 나름 최적화를 시도함
            const HeavyButton = memo(({ onClick }: { onClick: () => void }) => {
              console.log("🚨 HeavyButton이 리렌더링되었습니다! (비효율 발생)");
              return <button onClick={onClick} className="p-4 bg-blue-500 text-white">아이템 추가</button>;
            });
            
            export default function ParentComponent() {
              const [count, setCount] = useState(0);
              const [text, setText] = useState("");
            
              // 🚨 일반 함수로 선언: 부모가 리렌더링될 때마다 매번 새로운 메모리 주소(참조) 생성
              const handleAddItem = () => {
                setCount((prev) => prev + 1);
              };
            
              return (
                <div className="p-6">
                  <h2>카운트: {count}</h2>
                  
                  {/* 장바구니와 아무 상관 없는 인풋창 */}
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="아무거나 입력..." />
            
                  {/* 자식을 memo로 감싸놓았지만, handleAddItem의 주소가 매번 바뀌므로 강제 리렌더링됨 */}
                  <HeavyButton onClick={handleAddItem} />
                </div>
              );
            }
            ```
            
            유저가 인풋창에 텍스트를 한 글자 타이핑할 때마다 `text` 상태가 바뀌어 부모(`ParentComponent`)가 리렌더링됩니다.
            이때 `handleAddItem` 함수는 **새로운 메모리 주소(예: `0x101` ➔ `0x202`)로 재생성**됩니다.
            
            자식인 `HeavyButton`은 `React.memo` 처리가 되어있음에도 불구하고, Props로 넘어온 `onClick` 핸들러의 참조 주소가 달라진 것을 감지하고 **"어? Props가 바뀌었네?"라고 판단하여 아무 상관 없는 텍스트 타이핑 마다 도미노처럼 계속 재렌더링**되는 성능 오버헤드가 발생합니다.
            
            ⭕ Case 2: `useCallback`으로 감싸서 주소를 동결했을 때
            
            ```tsx
            import { useState, useCallback, memo } from 'react';
            
            // 자식 컴포넌트: Props가 변하지 않으면 리렌더링을 건너뜀
            const HeavyButton = memo(({ onClick }: { onClick: () => void }) => {
              console.log("🟩 HeavyButton 렌더링 스킵! (최적화 성공)");
              return <button onClick={onClick} className="p-4 bg-blue-500 text-white">아이템 추가</button>;
            });
            
            export default function ParentComponent() {
              const [count, setCount] = useState(0);
              const [text, setText] = useState("");
            
              // ✨ useCallback 도입: 최초 1회 생성 후 메모리 주소(참조)를 고정시킴
              const handleAddItem = useCallback(() => {
                setCount((prev) => prev + 1);
              }, []); // 함수형 업데이트를 활용해 의존성 배열을 비워 주소 완전 고정
            
              return (
                <div className="p-6">
                  <h2>카운트: {count}</h2>
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="아무거나 입력..." />
            
                  {/* 부모가 아무리 리렌더링되어도 handleAddItem의 주소는 늘 동일하므로 자식은 렌더링을 건너뜁니다! */}
                  <HeavyButton onClick={handleAddItem} />
                </div>
              );
            }
            ```
            
            이제 유저가 인풋창에 아무리 타이핑을 해서 부모 컴포넌트가 수백 번 다시 그려지더라도, `useCallback` 덕분에 `handleAddItem` 함수의 메모리 주소는 늘 **최초의 주소(`0x101`)로 엄격한 대등성(`===`)을 유지**합니다.
            
            자식 컴포넌트인 `HeavyButton`을 감싸고 있는 `React.memo`가Props 비교 시 `이전 onClick(0x101) === 다음 onClick(0x101)`이 성립함을 확인하고, 가상 DOM 연산과 하위 트리 렌더링을 완전히 생략(Skip)합니다. 브라우저의 자원 낭비를 원천 차단하게 되는 것입니다.
            
        
    - 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시 🍠
        
        # 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시
        
        ---
        
        - 버튼 클릭 시 API 호출하는 핸들러를 `useCallback`으로 감싸는 패턴
            
            ```tsx
            import { useState, useCallback, memo } from 'react';
            
            // ⭕ 무거운 검색 결과창 컴포넌트 (React.memo 최적화)
            const SearchResult = memo(({ onFetch }: { onFetch: () => void }) => {
              console.log("SearchResult 렌더링 검사 완료");
              return <button onClick={onFetch} className="btn-primary">데이터 새로고침</button>;
            });
            
            export default function MusicSearchApp() {
              const [keyword, setKeyword] = useState("");
              const [page, setPage] = useState(1);
            
              // 💡 패턴: 비동기 API 페칭 핸들러의 참조 주소 고정
              const handleFetchData = useCallback(async () => {
                try {
                  // page 상태 스냅샷을 안전하게 참조하여 비동기 요청 수행
                  const response = await fetch(`https://api.example.com/songs?page=${page}`);
                  const data = await response.json();
                  console.log("데이터 페칭 성공:", data);
                } catch (error) {
                  console.error(error);
                }
              }, [page]); // 🚨 주의: 비동기 함수 내부에서 참조하는 반응형 변수(page)는 반드시 deps에 포함!
            
              return (
                <div>
                  <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 입력..." />
                  <button onClick={() => setPage((p) => p + 1)}>다음 페이지 ({page})</button>
                  
                  {/* ⭕ keyword가 바뀔 때는 handleFetchData 주소가 같으므로 SearchResult는 리렌더링되지 않습니다. */}
                  <SearchResult onFetch={handleFetchData} />
                </div>
              );
            }
            ```
            
            인풋창에 `keyword`를 칠 때마다 부모가 리렌더링되지만, 정작 API 페칭과 관련된 `page` 상태가 변하지 않았다면 `handleFetchData` 함수의 주소는 유지됩니다. 따라서 자식인 `<SearchResult />` 컴포넌트의 가상 DOM 연산을 방어할 수 있습니다.
            
        - `useEffect` 안에서 의존성으로 콜백을 넣을 때 패턴
            
            ```tsx
            import { useState, useEffect, useCallback } from 'react';
            
            export default function SongDetailApp({ songId }: { songId: string }) {
              const [detail, setDetail] = useState(null);
            
              // 💡 패턴: useEffect 외부의 비동기 함수를 useCallback으로 메모이제이션
              const fetchSongDetail = useCallback(async () => {
                const res = await fetch(`https://api.example.com/songs/${songId}`);
                const data = await res.json();
                setDetail(data);
              }, [songId]); // songId가 변경될 때만 함수의 참조 주소가 새로 바뀜
            
              // 🚨 만약 fetchSongDetail에 useCallback이 없으면 매 렌더링마다 주소가 바뀌어 이펙트가 무한 실행됨!
              useEffect(() => {
                fetchSongDetail();
              }, [fetchSongDetail]); // ⭕ 안전하게 동기화 흐름 제어
            
              return <div>{detail ? JSON.stringify(detail) : "로딩 중... 🍠"}</div>;
            }
            ```
            
            컴포넌트 내부에 선언된 비동기 함수를 `useEffect` 내부에서 호출할 때, ESLint는 이 함수를 `useEffect` 뒤의 의존성 배열에 넣으라고 강제합니다(`exhaustive-deps`). 하지만 일반 함수를 그냥 넣으면 렌더링 ➔ 함수 재생성 ➔ 이펙트 실행 ➔ 상태 변경 ➔ 리렌더링 ➔ 함수 재생성...의 무한 루프에 빠져 서버가 터지게 됩니다. 이때 `useCallback`으로 주소를 묶어주면 오직 `songId`가 바뀔 때만 이펙트가 깔끔하게 격발됩니다.
            
        - 폼 제출 핸들러, 디바운스/스로틀 함수와 함께 사용할 때
            
            ```tsx
            import { useState, useCallback, useMemo } from 'react';
            import debounce from 'lodash/debounce'; // 실무용 lodash 디바운스 라이브러리 가정
            
            export default function SearchAutoComplete() {
              const [searchQuery, setSearchQuery] = useState("");
            
              // 💡 패턴: 디바운스된 서버 요청 함수를 컴포넌트 일생 동안 딱 '한 번'만 생성하여 고정
              const sendQueryToServer = useCallback(
                debounce((query: string) => {
                  console.log(`📡 [API 요청 격발] 서버로 '${query}' 검색 쿼리 전송!`);
                }, 500), // 유저가 타이핑을 멈추고 0.5초 뒤에 실행
                [] // 의존성이 없으므로 마운트 시 단 한 번만 디바운스 인스턴스 고정
              );
            
              const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setSearchQuery(value);
                sendQueryToServer(value); // ⭕ 타이핑 칠 때마다 호출되지만 동일한 디바운스 타이머가 유지됨!
              };
            
              return (
                <div className="p-4">
                  <input type="text" value={searchQuery} onChange={handleInputChange} placeholder="가수를 검색하세요..." />
                </div>
              );
            }
            ```
            
            많은 개발자가 디바운스(`debounce`)나 스로틀 함수를 리액트에서 구현할 때 실패하는 원인이 바로 **"참조 깨짐 현상"** 때문입니다.
            
            `useCallback` 없이 일반 함수 내부에 디바운스를 감싸두면, 타이핑을 칠 때마다 컴포넌트가 리렌더링되면서 **디바운스의 독립된 내부 타이머(Timer) 인스턴스까지 매번 새로 초기화**됩니다. 결국 디바운스가 먹통이 되어 타이핑 칠 때마다 API 요청이 수십 번 날아가게 되죠.
            
            이때 위 코드처럼 `useCallback(debounce(() => {}, 500), [])` 형태로 타이머 스코프를 가진 메모이즈드 함수를 딱 하나로 묶어두어야만, 리렌더링의 거센 파도 속에서도 타이머가 리셋되지 않고 0.5초 가드를 완벽하게 지켜내며 유저의 키보드 난타로부터 서버를 안전하게 구출해낼 수 있습니다

---
# memo
- **`memo`**에 대하여 정리해주세요!🍠
    
    # **`memo`**에 대하여 정리해주세요!🍠
    
    ---
    
    - **`memo`**가 무엇인지? 🍠
        
        # **`memo`**가 무엇인지?
        
        ---
        
        `React.memo`는 컴포넌트의 Props가 변경되지 않았다면 리렌더링을 건너뛰게(Skip) 해주는 고차 컴포넌트(Higher-Order Component, HOC)입니다.
        
        React는 기본적으로 부모 컴포넌트가 리렌더링되면 자식 컴포넌트의 Props 변경 여부와 상관없이 하위 트리를 무조건 다시 렌더링하지만, 컴포넌트를 `React.memo`로 감싸두면 React가 해당 컴포넌트의 이전 Props와 새로운 Props를 얕은 비교(Shallow Compare)하여 값이 같다면 가상 DOM 연산과 리렌더링 과정을 완전히 생략하고 기존에 메모이제이션된 렌더링 결과를 재사용합니다.
        
    - 왜 **`memo`**를 사용하는지? 🍠
        
        # 왜 **`memo`**를 사용하는지?
        
        ---
        
        `React.memo`를 사용하는 궁극적인 이유는 **부모 컴포넌트의 빈번한 상태 변경으로 인해 하위의 무거운 자식 컴포넌트가 불필요하게 렌더링 스택에 쌓이고 가상 DOM(Virtual DOM) 연산을 반복하는 성능 낭비를 막기 위함**입니다.
        
        부모 컴포넌트와 화면 구조상 종속되어 있지만, 전달받는 데이터(Props)가 독립적이고 정적인 자식 컴포넌트의 렌더링 결과를 메모리에 캐싱하여 애플리케이션 전체의 CPU 자원과 브라우저 페인팅 자원을 아끼기 위해 사용합니다.
        
        ✔️ 
        리액트의 대원칙은 "부모가 리렌더링되면 자식은 Props가 같든 다르든 무조건 가상 DOM을 새로 만들고 비교 연산을 돌린다"입니다. 컴포넌트 트리 구조가 깊고 복잡한 실무 프로젝트에서는 이 '도미노 리렌더링'이 화면 버벅임의 주범이 됩니다. `React.memo`는 이 연산의 흐름을 중간에서 단절시켜, 오직 **나와 관련된 데이터가 변했을 때만 일하게 만드는 효율성 제어 장치**입니다.
        
    - **`memo`** 기본 사용법 🍠
        
        # **`memo`** 기본 사용법
        
        ---
        
        컴포넌트 정의부를 `memo()` 고차 컴포넌트로 감싸주기만 하면 됩니다. 내보낼 때(export) 감싸거나 선언할 때 직접 감쌀 수 있습니다.
        
        ```tsx
        import { memo } from 'react';
        
        interface SongItemProps {
          title: string;
          singer: string;
        }
        
        // 💡 기본 사용법: 컴포넌트 전체를 memo()로 래핑합니다.
        const SongItem = memo(function SongItem({ title, singer }: SongItemProps) {
          console.log(`🟩 [SongItem 렌더링] ${title} - ${singer}`);
          return (
            <div className="flex justify-between p-3 border-b">
              <h4 className="font-bold">{title}</h4>
              <p className="text-gray-500 text-sm">{singer}</p>
            </div>
          );
        });
        
        export default SongItem;
        ```
        
        ### ⚙️ 커스텀 비교 함수(ArePropsEqual) 활용 패턴
        
        기본적으로 `React.memo`는 `Object.is`를 이용한 얕은 비교를 하지만, 두 번째 인자에 커스텀 비교 함수를 수동으로 넘겨주어 렌더링 조건을 정밀 제어할 수도 있습니다.
        
        ```tsx
        // 이전 Props와 다음 Props를 비교하여 true를 반환하면 리렌더링을 건너뜁니다.
        const EqualSongItem = memo(SongItem, (prevProps, nextProps) => {
          return prevProps.title === nextProps.title; // 제목이 같으면 가수로직 불문하고 렌더링 스킵!
        });
        ```
        
    - **`memo`**를 언제 쓰면 좋은지 / 안 좋은지 🍠
        
        # **`memo`**를 언제 쓰면 좋은지 / 안 좋은지
        
        ---
        
        공식 문서에서는 `React.memo`를 아무 데나 붙이는 '남용'을 강력히 경고하며, 명확한 가이드라인을 제시합니다.
        
        ### 🟢 언제 쓰면 좋은가요? (권장 상황)
        
        1. **부모 컴포넌트가 아주 자주 리렌더링될 때:** (예: 타이핑 인풋 상태, 애니메이션 타이머, 마우스 트래킹 등 부모의 상태가 쉴 새 없이 변할 때)
        2. **자식 컴포넌트 구조가 무겁고 복잡할 때:** 가상 DOM 트리가 거대해서 리렌더링 한 번에 소모되는 CPU 연산 비용이 유의미하게 클 때
        3. **전달받는 Props가 대개 일정할 때:** 자식 컴포넌트가 정적인 UI 아이템이거나, 넘어오는 데이터가 자주 바뀌지 않는 구조일 때
        
        ### 🔴 언제 쓰면 안 좋은가요? (남용 시 오버헤드)
        
        1. **전달받는 Props가 매번 바뀌는 컴포넌트일 때:**
        Props가 어차피 계속 바뀌는 컴포넌트라면 리렌더링 가드를 태워봤자 무조건 렌더링이 일어납니다. 이 경우 "1) 이전 Props와 다음 Props를 대조하는 얕은 비교 연산 비용"만 헛되이 쓰고 결국 "2) 리렌더링 연산"까지 이중으로 처리하게 되어 성능이 오히려 저하됩니다.
        2. **컴포넌트 구조가 매우 가볍고 단순할 때:**
        단순히 `<h1>{text}</h1>` 정도만 그리는 가벼운 컴포넌트는 리액트가 가상 DOM을 새로 파는 속도가 너무 빨라서, 굳이 메모리에 이전 렌더링 결과를 백업하고 Props 주소를 대조하는 `React.memo` 오버헤드 비용이 더 클 수 있습니다.
        3. **`useCallback` / `useMemo`로 주소 고정을 안 한 Props를 넘겨받을 때:**
        부모가 자식에게 일반 객체(`{}`)나 일반 함수를 Props로 내려주고 있다면, `React.memo` 보초병은 매번 주소가 바뀐 것을 보고 무조건 검문소 문을 열어 리렌더링을 허용합니다. 즉, 최적화 효과는 전혀 보지 못하고 Props 비교 비용만 낭비하게 됩니다.
---
# useMemo
- **`useMemo`** 에 대하여 정리해주세요! 🍠
    
    # **`useMemo`** 에 대하여 정리해주세요! 🍠
    
    ---
    
    - **`useMemo`**가 무엇인지? 🍠
        
        # **`useMemo`**가 무엇인지? 🍠
        
        ---
        
        `useMemo`는 **리렌더링 사이에 계산된 값(Value)의 결과를 캐싱(메모이제이션)할 수 있게 해주는 React Hook**입니다.
        
        컴포넌트가 리렌더링될 때마다 내부의 복잡한 알고리즘이나 무거운 데이터 파싱 연산이 불필요하게 처음부터 다시 실행되는 것을 방지하고, 이전 렌더링에서 이미 계산해 둔 결과값을 메모리 저장소에서 그대로 꺼내와 재사용할 수 있도록 돕는 역할을 합니다.
        
        ✔️ `useCallback`과 작동 원리는 100% 동일하지만 대상이 다릅니다. `useCallback(fn, deps)`은 함수 자체를 그대로 반환하는 반면, `useMemo(() => fn(), deps)`은 **함수를 실행한 '결과물(값, 객체, 배열 등)'을 반환**합니다. 리액트에게 "이 수식이나 배열 필터링은 조건이 안 바뀌었으면 다시 계산하지 말고, 저번에 메모해 둔 정답지에서 결과만 쏙 꺼내와줘!"라고 요청하는 영리한 임시 저장소입니다.
        
    - 왜 **`useMemo`**를 사용하는지? 🍠
        
        # 왜 **`useMemo`**를 사용하는지? 🍠
        
        ---
        
        `useMemo`를 사용하는 주된 이유는 **두 가지**입니다.
        
        1. **CPU 집약적인 복잡한 연산 비용 절감:** 데이터가 수만 개가 넘는 배열을 필터링, 정렬, 변형하는 로직이 아무 상관 없는 상태 변경 때문에 매번 다시 돌아가 유저 화면을 버벅이게 만드는 현상을 막기 위함입니다.
        2. **참조 대등성(Referential Equality) 유지를 통한 자식 컴포넌트 최적화:** 매 렌더링마다 새 주소로 선언되는 객체(`{}`)나 배열(`[]`)의 참조 메모리 주소를 고정시켜, 이를 Props로 받는 하위 `React.memo` 컴포넌트의 불필요한 도미노 리렌더링을 방어하기 위함입니다.
    - **`useMemo`** 기본 사용법 🍠
        
        # **`useMemo`** 기본 사용법 🍠
        
        ---
        
        첫 번째 인자로 **값을 계산하여 반환하는 팩토리 함수**를 넣고, 두 번째 인자로 의존성 배열(deps)을 넘겨줍니다.
        
        ```tsx
        import { useMemo, useState } from 'react';
        
        export default function TodoApp() {
          const [todos, setTodos] = useState<{ id: number; text: string; completed: boolean }[]>([]);
          const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all');
        
          // 💡 기본 사용법: todos나 tab이 바뀔 때만 필터링 연산을 수행하고 결과를 캐싱합니다.
          const filteredTodos = useMemo(() => {
            console.log("⏳ [useMemo 내부 연산 격발] 고비용 필터링 진행 중...");
            return todos.filter((todo) => {
              if (tab === 'all') return true;
              if (tab === 'active') return !todo.completed;
              if (tab === 'completed') return todo.completed;
            });
          }, [todos, tab]); // 🚨 규칙: 내부에서 참조하는 모든 반응형 상태를 deps에 명시!
        
          return (
            <div>
              {/* filteredTodos를 일반 변수처럼 매핑하여 사용 */}
              {filteredTodos.map(todo => <p key={todo.id}>{todo.text}</p>)}
            </div>
          );
        }
        ```
        
    - **`useMemo`**에서 중요한 개념 🍠
        
        # **`useMemo`**에서 중요한 개념 🍠
        
        ---
        
        ### 🟢 언제 성능적 이득을 얻나요?
        
        - **연산 래퍼 툴:** 루프 개수가 대단히 많거나(예: 수천 번의 루프), 정규식을 이용한 복잡한 스트링 파싱 등 체감할 수 있을 정도의 무거운 연산일 때
        - **종속 최적화:** 내가 연산한 결과 객체/배열을 다른 하위 최적화 컴포넌트(`React.memo`)의 Props로 전달하거나, 다른 `useEffect`의 의존성 배열에 가드로 넣어주어야 할 때
        
        ### 🔴 남용했을 때의 오버헤드 (Cons)
        
        - **초기 비용 발생:** 값을 그냥 변수에 담는 것은 자바스크립트 엔진에게 눈 깜짝할 새 끝나는 일입니다. 반면 `useMemo`를 쓰면 **1) 가상 메모리 공간 할당, 2) 리렌더링마다 의존성 배열의 모든 인자를 `Object.is`로 일일이 동등 비교**하는 레이어가 추가되므로, `a + b` 같은 단순 연산에 쓰면 오히려 앱의 첫 구동 속도와 메모리를 낭비하게 됩니다.
    - **`useMemo`** 실전 예시 🍠
        
        # **`useMemo`** 실전 예시 🍠
        
        ---
        
        ```tsx
        import { useState, useMemo, memo } from 'react';
        
        // ⭕ React.memo로 최적화된 무거운 회원 가입 현황판 컴포넌트
        const DashboardInfo = memo(({ config }: { config: { theme: string; userRole: string } }) => {
          console.log("🚨 DashboardInfo 검문 통과 (config 주소가 같으면 리렌더링 스킵!)");
          return <div className={`p-4 ${config.theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>권한: {config.userRole}</div>;
        });
        
        export default function UserAdminPage() {
          const [userRole, setUserRole] = useState("Admin");
          const [dummyCount, setDummyCount] = useState(0); // 이 카운트가 올라가도 대시보드는 평온해야 함
        
          // ❌ 비효율 코드: 리렌더링할 때마다 새로운 객체 주소(0x101 -> 0x202)가 만들어져 DashboardInfo가 강제 렌더링됨
          // const dashboardConfig = { theme: "dark", userRole };
        
          // ⭕ 실전 useMemo 가드 패턴: userRole이 바뀔 때만 새로운 객체 주소를 생성하고 그 외엔 주소 완전 동결!
          const dashboardConfig = useMemo(() => {
            return {
              theme: "dark",
              userRole: userRole
            };
          }, [userRole]);
        
          return (
            <div className="p-6">
              <button onClick={() => setDummyCount(d => d + 1)}>무관한 버튼 연타 ({dummyCount})</button>
              <button onClick={() => setUserRole("User")}>권한 변경</button>
              
              {/* useMemo 덕분에 dummyCount 버튼을 아무리 연타해도 DashboardInfo는 절대 불필요하게 다시 그려지지 않습니다! */}
              <DashboardInfo config={dashboardConfig} />
            </div>
          );
        }
        ```

---
- **추가로 본인이 학습한 내용에 대해서 정리해주세요** 🍠
    
    # **추가로 본인이 학습한 내용에 대해서 정리해주세요** 🍠
    
    ---
    
    ### 1. SPA(Single Page Application) 배포 시 404 라우팅 에러와 서버 재지정(Rewrite) 원리
    
    React, Vite 등 CSR(Client Side Rendering) 기반의 SPA 프로젝트를 배포했을 때, 메인 페이지(`/`)가 아닌 상세 페이지(예: `/cart`, `/myforest`) 주소로 유저가 직접 접속하거나 브라우저를 새로고침하면 **404 Not Found 에러**가 발생하는 인프라적 이슈와 해결책을 학습했습니다.
    
    - **원인:** SPA는 오직 하나의 `index.html` 파일만 가집니다. 브라우저에서 `/cart`로 직접 접속하면, Vercel 등의 호스팅 서버는 실제 레포지토리 내부에 `cart`라는 폴더나 `cart.html` 파일이 있는지 찾게 되고, 파일이 없으니 404 에러를 뱉는 것입니다. (실제 페이지 이동은 리액트 라우터가 브라우저 내부에서 자바스크립트로 흉내 내는 것이기 때문입니다.)
    - **해결 방법 (`vercel.json`):** 어떤 하위 주소(`/...`)로 요청이 들어오더라도, 서버단에서 무조건 최상위 루트의 `index.html`로 요청을 다시 돌려보내 주는(Rewrite) 설정 파일을 루트 경로에 추가해 주어야 안전한 클라이언트 라우팅이 보장된다는 점을 배웠습니다.
    
    ```tsx
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```
    
    ### 2. 빌드 타임(Build Time) 환경 변수(`Environment Variables`) 관리와 보안 가드
    
    API 키, 백엔드 주소 등 오픈소스인 GitHub에 절대 올리면 안 되는 민감한 정보를 보호하기 위해 환경 변수(`.env`)를 주입하고 관리하는 보안 파이프라인을 학습했습니다.
    
    - **이해한 점:** Vite 기반의 React 프로젝트는 환경 변수 앞에 반드시 `VITE_` 접두사를 붙여야 프론트엔드 코드 내부에 노출됩니다(`import.meta.env.VITE_API_URL`).
    - **CI/CD와의 연동:** 로컬 컴퓨터에 있는 `.env` 파일은 `.gitignore`에 의해 GitHub에 업로드되지 않으므로, Vercel로 자동 빌드(CD)가 돌아갈 때 환경 변수가 누락되어 API 통신이 터지는 버그가 발생할 수 있습니다. 이를 방지하기 위해 Vercel 대시보드(Settings -> Environment Variables)에 직접 키와 값을 사전에 등록해 두고, 빌드 타임에 로봇이 전역 변수를 안전하게 주입하도록 설계하는 인프라 보안의 중요성을 깨달았습니다.
    
    ### 3. CDN(콘텐츠 전송 네트워크)과 Edge Server를 통한 프론트엔드 최적화
    
    Vercel이 전 세계 사용자에게 물리적으로 왜 그렇게 압도적으로 빠른 속도로 웹사이트를 서빙할 수 있는지 그 내부 구동 원리인 CDN(Content Delivery Network)을 학습했습니다.
    
    - **이해한 점:** 만약 배포 서버 컴퓨터가 미국 서울(AWS ap-northeast-2 등)에만 덩그러니 놓여있다면, 해외에 있는 사용자는 데이터가 바다를 건너오느라 화면이 느리게 뜰 것입니다.
    - **Vercel의 캐싱 전략:** Vercel은 전 세계 주요 거점마다 캐시 서버인 **Edge Node**를 촘촘하게 깔아두고 있습니다. CI/CD 파이프라인을 타고 한 번 빌드가 완료되면, 압축된 HTML/JS/CSS 정적 파일들이 전 세계 배포 거점으로 즉시 복사(Cashing)됩니다. 덕분에 사용자는 전 세계 어디에 있든 자신과 물리적으로 가장 가까운 엣지 서버에서 데이터를 1ms만에 받아보게 되어 극한의 사용자 경험(UX)을 누릴 수 있음을 이해했습니다.