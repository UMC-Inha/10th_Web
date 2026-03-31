- JSX 사용시 유의 사항 (기초) 🍠
    - JSX는 반드시 하나의 태그만 반환해야 한다.
        
        ## JSX는 반드시 하나의 태그만 반환해야 한다
        
        React 컴포넌트에서 JSX를 반환할 때는 **무조건 하나의 부모 태그**로 감싸야 해요.
        
        ---
        
        ### **⭕ 가능한 경우**
        
        ```tsx
        function App() {
          return (
             <strong>상명대학교</strong>
          )
        }
        export default App
        ```
        
        ### **❌ 불가능한 경우**
        
        ```tsx
        function App() {
          return (
             <strong>상명대학교</strong>
             <p>매튜/김용민</p>
          )
        }
        export default App
        ```
        
        ---
        
        <aside>
        🍠
        
        그러면, 위와 같이 **여러 개의 태그를 동시에 반환하려고 할 때**는 어떻게 해야 할까요?
        
        </aside>
        
        - 답변 🍠
            
            **1️⃣ `<div>`로 감싸기**
            
            ```tsx
            // 코드 아래 첨부
            function App() {
            	return (
            		<div>
            			<strong>인하대학교</strong>
            			<p>동동/채부경</p>
            		</div>
            	)
            }
            export default App
            ```
            
            - **단점** : `<div>`나 `<span>`태그를 사용하여 감싸면 실제 DOM에 불필요한 태그가 추가되어 레이아웃이 깨지거나 HTML 구조가 지저분해질 수 있다
            
            **2️⃣ React Fragment 사용하기**
            
            불필요한 태그를 생성하지 않고 여러 요소를 묶어주기 위해 리액트에서 제공하는 기능
            
            ```tsx
            import { Fragment } from 'react';
            
            function App() {
              return (
                <Fragment>
                  <div>인하대학교</div>
                  <p>동동/채부경</p>
                </Fragment>
              );
            ```
            
            - **장점:** 브라우저의 실제 DOM에는 나타나지 않으면서 논리적으로만 그룹화한다.
            
            3️⃣ **빈 태그 (`<>` `</>`) 사용**
            
            ```tsx
            function App() {
            	return (
            		<>
            			<div>인하대학교</div>
            			<p>동동/채부경</p>
            		</>
            	);
            }
            ```
            
            - **장점** : 별도의 import 없이 사용 가능하다.
            - ⚠️ JSX가 하나의 태그만 반환해야 하는 이유
                
                **가상 DOM(Virtual DOM)의 트리 구조 때문**
                
                리액트는 효율적인 화면 업데이트를 위해 가상 DOM 트리를 만든다. 이 트리는 하나의 뿌리(Root)에서 시작하여 가지가 뻗어 나가는 구조여야 한다. 컴포넌트가 여러 개의 뿌리를 가지게 되면, 리액트가 어떤 부분이 바뀌었는지 비교(Reconciliation)하고 업데이트하는 과정이 매우 복잡하고 비효율적으로 변하기 때문이다.
                
            
            <aside>
            🍠
            
            이유: 
            JSX에서 여러 태그를 반환하고 싶을 때는 **하나의 부모 요소로 감싸야 한다.**
            
            왜냐하면 자바스크립트 함수는 하나의 값만 반환할 수 있고, 리액트의 가상 DOM이 단일 루트 트리 구조를 지향하기 때문이다.
            
            </aside>
            
        - 해설
            
            ```jsx
            function App() {
              return (
                 <>
                  <strong>상명대학교</strong>
                  <p>매튜/김용민</p>
                 </>
              )
            }
            
            export default App
            
            ```
            
            많은 분들이 `<> 빈 태그(Fragment)`의 존재를 잘 모르시는 경우가 있어요.
            
            여러 개의 태그를 반환해야 하지만, 특별히 **스타일링이나 레이아웃을 위해 부모 태그가 필요하지 않을 때**, 굳이 불필요한 `<div>` 같은 태그를 추가할 필요가 없어요.
            
            이럴 때는 `<> </>` **Fragment**를 사용하면, **추가적인 DOM 요소 없이** 여러 태그를 묶어서 반환할 수 있습니다.
            
            즉, 화면에는 불필요한 태그가 생기지 않고 코드도 훨씬 깔끔해져요.
            
    - React에서 스타일링 방법
        
        ### React에서 스타일링 방법
        
        ---
        
        ### 1. `className`을 활용한 스타일링
        
        HTML에서는 **`class`**를 쓰지만, React의 JSX에서는 **`className`**을 사용해야 해요.
        
        ```tsx
        import './App.css'
        
        function App() {
          return (
             <>
              <strong className='school'>상명대학교</strong>
              <p>매튜/김용민</p>
             </>
          )
        }
        
        export default App
        ```
        
        위 코드에서 `App.tsx` 상단에 `./App.css` 파일을 불러오고 있죠.
        
        이제 `App.css` 안에 스타일을 아래처럼 작성해줍니다.
        
        ```css
        .school {
          background-color: blue;
          color: white;
          font-size: 10rem;
        }
        ```
        
        ![스크린샷 2025-09-11 오후 6.07.44.png](attachment:cb7f1e68-239d-4bf6-a63a-120dcfc567d2:스크린샷_2025-09-11_오후_6.07.44.png)
        
        ---
        
        ### 2. Inline 스타일링을 활용한 방법
        
        JSX에서는 `style` 속성을 객체 형태로 작성해야 합니다.
        
        즉, **중괄호를 두 번** 쓰고, CSS 속성은 **카멜 표기법**을 따라야 해요.
        
        ```tsx
        import './App.css'
        
        function App() {
          return (
             <>
              <strong className='school'>상명대학교</strong>
              <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>매튜/김용민</p>
             </>
          )
        }
        
        export default App
        ```
        
        ---
        
        **중괄호를 두 번 쓰는 이유**
        
        1. 바깥쪽 `{}` → 자바스크립트 문법임을 알려줍니다.
        2. 안쪽 `{}` → 자바스크립트의 객체임을 의미합니다.
        
        ---
        
        **HTML과 JSX 비교**
        
        ```html
        <!-- HTML 방식 (케밥 표기법) -->
        <div style="background-color: purple">
          고구마
        </div>
        ```
        
        ```jsx
        // JSX 방식 (카멜 표기법)
        <div style={{backgroundColor: 'purple'}}>
          고구마
        </div>
        ```
        
        ---
        
        ### 3. 로컬 변수(local variable) 선언
        
        컴포넌트 안에서 변수를 선언하고 JSX 안에서 활용할 수 있어요.
        
        ```tsx
        import './App.css'
        
        function App() {
          return (
             <>
              <strong className='school'>상명대학교</strong>
              <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>매튜/김용민</p>
             </>
          )
        }
        
        export default App
        
        ```
        
        여기서 `"매튜"`라는 문자열을 직접 쓰는 대신, `nickname`이라는 변수를 만들어서 사용해보겠습니다.
        
        ```tsx
        import './App.css'
        
        function App() {
          const nickname = '매튜'
          return (
             <>
              <strong className='school'>상명대학교</strong>
              <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>매튜/김용민</p>
             </>
          )
        }
        
        export default App
        
        ```
        
        만약 `"매튜/김용민"`을 그대로 `"nickname/김용민"`이라고 쓰면 단순 문자열로 인식돼요.
        
        변수의 값을 출력하려면 **중괄호 `{}`**를 사용해야 합니다.
        
        ```tsx
        import './App.css'
        
        function App() {
          const nickname = '매튜'
          return (
             <>
              <strong className='school'>상명대학교</strong>
              <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>
                {nickname}/김용민
              </p>
             </>
          )
        }
        
        export default App
        
        ```
        
        이제 `nickname` 안의 값을 바꾸면 화면에 표시되는 내용도 같이 바뀌는 걸 확인할 수 있어요.
        
- TSX 사용시 유의 사항 (심화) 🍠
    - 문자열과 함께 변수 사용하기
        
        ### 문자열과 함께 변수 사용하기
        
        **`중괄호 {}`**와 **`백틱( ` )`**을 활용해서, 문자열과 변수를 함께 사용할 수 있어요.
        
        아주 자주 쓰는 패턴이라 꼭 익숙해지시면 좋아요!
        
        ```tsx
        import './App.css'
        
        function App() {
          const nickname = '매튜'
          const sweetPotato = '고구마'
          return (
             <>
              <strong className='school'>상명대학교</strong>
              <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김용민</p>
              <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
             </>
          )
        }
        
        export default App
        ```
        
        ![스크린샷 2024-09-09 오후 5.16.19.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/da56da7b-3210-4644-b4fd-4872afd15bad/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.16.19.png)
        
    - 배열의 요소를 나타내는 방법
        
        ### 2. 배열의 요소를 나타내는 방법
        
        배열의 각 요소를 화면에 그리려면 **`map`**을 활용해요.
        
        **`map`**이 낯설다면 JS 워크북을 다시 보시거나 간단히 구글링해 보셔도 좋아요!
        
        ```tsx
        import './App.css'
        
        function App() {
          const nickname = '매튜'
          const sweetPotato = '고구마'
          const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE']
          return (
             <>
              <strong className='school'>상명대학교</strong>
              <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김용민</p>
              <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
              <ul>
                {array.map((yaho, idx) => {
                  return <li key={idx}>{yaho}</li>
                })}
              </ul>
             </>
          )
        }
        
        export default App
        ```
        
        **`map`**은 각 요소(**`yaho`**)를 받아서 새 값을 반환해요.
        
        **`중괄호 {}`** 블록을 쓰면 **반드시 `return`**을 적어야 화면에 보여져요.
        
        ```tsx
        <ul>
          {array.map((yaho, idx) => {
            return <li key={idx}>{yaho}</li>
          })}
        </ul>
        ```
        
        소괄호 **`()`**를 쓰면 **`return`**을 생략할 수 있어요.
        
        ```tsx
        <ul>
          {array.map((yaho, idx) => (
             <li key={idx}>{yaho}</li>
          ))}
        </ul>
        ```
        
        `map`을 쓸 때는 **반드시 `key` props**를 넣어야 해요. `key`는 각 원소의 **고유값**이어야 하고요.
        
        예제에서는 임시로 `index`를 썼지만, 실제 앱에서는 **서버에서 내려주는 고유 `id`**를 쓰는 걸 권장해요.
        
        변수 이름은 자유예요. 다만 가독성을 위해 **복수/단수**를 구분하면 좋아요.
        
        ```tsx
        // 복수/단수 네이밍을 권장해요
        const numbers = [1, 2, 3, 4, 5]
        
        numbers.map((number, index) => {
          return <li key={index}>{number}</li>
        })
        ```
        
        ![스크린샷 2024-09-09 오후 5.27.56.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/7a3741ba-5f49-4af9-95a1-0c773825accf/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.27.56.png)
        
- 첫 컴포넌트 만들어보기 🍠
    
    ### 첫 컴포넌트 만들어보기
    
    `React`에서는 컴포넌트로 UI를 재사용 가능한 조각들로 나눠서 각각 관리할 수 있어요.
    
    위에서 순서를 따라오셨다면, 현재 코드는 아래와 같아요.
    
    ```tsx
    import './App.css'
    
    function App() {
      const nickname = '매튜'
      const sweetPotato = '고구마'
      const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE']
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김용민</p>
          <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
          <ul>
            {array.map((yaho, idx) => (
               <li key={idx}>{yaho}</li>
            ))}
          </ul>
         </>
      )
    }
    
    export default App
    ```
    
    이제 `yaho`를 렌더링하던 `<li>` 부분을 **`List` 컴포넌트**로 분리해볼게요.
    
    ```tsx
    <li key={idx}>{yaho}</li>
    ```
    
    **`src` 폴더** 안에 **`components`** 폴더를 만들고, 그 안에 **`List.tsx`** 파일을 생성해줘요.
    
    ![스크린샷 2025-09-12 오전 6.41.08.png](attachment:55194880-e733-433d-912c-60fb64c80e41:스크린샷_2025-09-12_오전_6.41.08.png)
    
    > 우리가 궁극적으로 만들 모습은 아래와 같아요.
    > 
    
    ![스크린샷 2024-09-09 오후 5.37.05.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/e20d1131-591b-4581-802f-03a75ebb4fa2/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.37.05.png)
    
    `App.tsx`에서 `List`를 불러와서 교체해줘요.
    
    ```jsx
    import './App.css'
    // 1) List 컴포넌트를 import해요.
    import List from './components/List';
    
    function App() {
      const nickname = '매튜'
      const sweetPotato = '고구마'
      const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE']
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김용민</p>
          <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
          <ul>
            {array.map((yaho, idx) => (
              // 2) <li key={idx}>{yaho}</li> → <List />로 교체해요.
              <List />
            ))}
          </ul>
         </>
      )
    }
    
    export default App
    
    ```
    
    컴포넌트는 props로 데이터를 전달받을 수 있어요.
    `map`으로 반복 렌더링한 요소들이 있으면, React는 **"어떤 요소가 추가/삭제/변경되었는지"를 구분**해야 합니다. 
    
    이를 위하여 `key`가 필요하니, `List`에도 `key`를 넘겨줄게요.
    
    ```tsx
    <List key={idx} />
    ```
    
    그리고 각 항목의 텍스트도 넘겨야 하니, 의미 있는 이름으로 **`tech`**라는 props로 전달할게요.
    
    ```tsx
    <List key={idx} tech={yaho} />
    ```
    
    이 상태에서 실행해보면 아직 `List`가 아무것도 반환하지 않아서 화면에 안 보여요.
    
    ![스크린샷 2024-09-09 오후 5.41.47.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/7bd5e857-40f6-401f-b9fa-178e46ce149e/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.41.47.png)
    
    ```tsx
    const List = () => {
      return (
        <>
          
        </>
      )
    }
    
    export default List
    ```
    
    전달된 props를 확인해볼게요.
    
    ```tsx
    const List = (props) => {
      console.log(props)
      return (
        <>
          
        </>
      )
    }
    
    export default List
    ```
    
    개발할 때는 **`console.log()`**로 값을 수시로 확인하는 습관이 좋아요.
    
    브라우저에서 **Chrome → F12** 개발자도구를 열어 `props`를 확인해보세요.
    
    ![스크린샷 2024-09-09 오후 5.43.17.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/99ecfc9e-0a76-462f-8174-a3fd8a0a6a41/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.43.17.png)
    
    `<List key={idx} tech={yaho} />`로 넘겼으니 `{ tech: 'REACT' }` 같은 형태가 보여요.
    
    이 말은 값을 쓸 때 **`{tech}`가 아니라 `{props.tech}`**로 접근해야 한다는 뜻이에요.
    
    ```tsx
    // props를 직접 사용해요.
    const List = (props) => {
      return (
        <li>
          {props.tech}
        </li>
      )
    }
    
    export default List
    ```
    
    ![스크린샷 2024-09-09 오후 5.46.22.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/765780fd-dd7d-483a-a8c4-cba2f856fae9/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.46.22.png)
    
    <aside>
    ⚠️
    
    잘 따라오셨다면, List.tsx에서 이런 에러가 발생할거에요!! 일단은 뒤에서 우리가 해당 에러를 어떻게 해결하는지 배워볼 예정이니 무시하고 넘어가주세요!
    
    ![스크린샷 2025-09-12 오전 6.45.58.png](attachment:a067cd30-2ae3-4ec0-ab34-5dc268ee5426:스크린샷_2025-09-12_오전_6.45.58.png)
    
    </aside>
    
    다만, props가 많아지면 `props.tech`, `props.name`처럼 계속 적기 번거로워요.
    그래서 우리가 이전에 핸드북 자바스크립트때 학습한 **구조 분해 할당**을 쓰면 코드가 훨씬 깔끔해져요.
    
    <aside>
    🍠
    
    여러분들이, 직접 한번 구조분해 할당을 활용해서 어떻게 깔끔하게 코드를 작성할 수 있을지 고민해보세요!! 
    저는 두가지 방식이 크게 떠오르는데요, 여러분들이 생각하는 방식으로 한번 해결해보세요! 저는 해설로 한번 저의 생각을 공유드릴테니 여러분들도 한번 직접 고민해보세요
    
    </aside>
    
    - 구조분해 할당 활용
        
        **1️⃣ 함수의 매개변수(Parameter) 단계에서 분해**
        
        ```tsx
        const List = (props) => {
          return <li>{props.tech}</li>;
        };
        ```
        
        - **장점** : 전달 받는 데이터가 무엇인지 함수의 첫 줄의 정의 부분만 보고도 바로 알 수 있다
        
        2️⃣ **함수 내부(Body)에서 변수로 선언**
        
        ```tsx
        const List = (props) => {
          const { tech, nickname, name } = props;
          
          return (
            <li>
              <strong>{tech}</strong> - {nickname} ({name})
            </li>
          );
        };
        ```
        
        - **장점** : `props`의 양이 너무 많아서 매개변수 자리가 너무 길어질 때 쓰기 좋은 방식이다
    - 해설 🍠
        
        **방식 1) 매개변수에서 바로 구조 분해해요.**
        
        ```tsx
        const List = ({ tech }) => {
          return <li>{tech}</li>
        }
        
        export default List
        ```
        
        ---
        
        **방식 2) 함수 내부에서 구조 분해해요.**
        
        ```tsx
        const List = (props) => {
          const { tech } = props
          return <li>{tech}</li>
        }
        
        export default List
        ```
        
    
    ---
    
    이제 한번, 스타일링을 해볼려고해요.
    
    일단은 저는 먼저 리스트 점(•)이 거슬리기에 이를 인라인 스타일을 활용하여 제거할려고해요.
    
    ```tsx
    const List = ({ tech }) => {
      return (
        <li style={{ listStyle: 'none' }}>
          {tech}
        </li>
      )
    }
    
    export default List
    ```
    
    여기까지가 컴포넌트 분리·스타일링의 기본 흐름이에요. 구조 분해 할당으로 가독성도 챙길 수 있어요.
    
    ---
    
    ![Screenshot 2025-02-16 at 5.48.19 PM.png](attachment:9b137465-7bf2-400f-8ee8-6c1aca8e93a8:Screenshot_2025-02-16_at_5.48.19_PM.png)
    
    이제 **TypeScript** 관점에서 중요한 차이가 등장해요.
    우리는 `array`를 `map`으로 돌면서 `List`에 값을 넘기고 있어요.
    
    ```tsx
    const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE'];
    ```
    
    `array.map((yaho) => <List tech={yaho} />)`에서 `yaho`는 **string** 타입이에요.
    JS였다면 틀린 타입을 넘겨도 바로 에러가 안 날 수 있지만, TS는 **컴파일 단계에서** 막아줘요.
    
    ```tsx
    <List key={idx} tech={42} /> // ❌ TS 에러: tech는 string이어야 해요.
    ```
    
    그래서 `List`가 받는 **props 타입을 명확히 선언**해줘야 해요. 보통 **인터페이스**를 써요.
    
    ```tsx
    interface ListProps {
      tech: string;
    }
    
    // 구조 분해 할당 사용!
    const List = ({ tech }: ListProps) => {
      return (
        <li style={{ listStyle: 'none' }}>
          {tech}
        </li>
      )
    };
    
    export default List;
    ```
    
    ![스크린샷 2025-09-12 오전 7.05.40.png](attachment:c8dcb2db-c39f-4786-b203-83e165d325aa:스크린샷_2025-09-12_오전_7.05.40.png)
    
    이렇게 타입을 선언하면, 에디터에서 **타입 힌트**도 잘 나오고, 실수로 다른 타입을 넘기는 버그를 미리 방지할 수 있어요.
    
    ---
    
    ### 특정 문자열만 받을 수 있도록 제한하기
    
    보통 `interface`만으로는 구체적인 값 제한을 주기 어렵지만, `type`과 조합하면 **union 타입**을 활용해서 보다 엄격한 타입을 정의할 수 있어요.
    
    즉, **타입 별칭(`type`)과 인터페이스(`interface`)를 적절히 조합하면 안전하고 가독성 높은 타입 설계를 할 수 있어요.**
    
    참고로, 언제 **타입 별칭(`type`)과 인터페이스(`interface`)를 활용하는지에 대한** 저의 고민을 ****다룬 블로그 글을 **Chapter 01**에서 함께 확인하셨을 거에요.
    
    [개발자 매튜 | type vs interface 어떤 것을 사용해야 할까?](https://www.yolog.co.kr/post/ts-interface-type)
    
    지금은 `tech`라는 props가 단순히 `string` 타입이 아니라, 실제 사용하는 기술 스택만 받을 수 있도록 `유니온 타입`으로 제한했어요.
    
    ```tsx
    type Tech = 'REACT' | 'NEXT' | 'VUE' | 'SVELTE' | 'ANGULAR' | 'REACT-NATIVE';
    
    interface ListProps {
      tech: Tech;
    }
    
    const List = (props: ListProps) => {
      return (
        <li style={{ listStyle: 'none' }}>
          {props.tech === 'REACT' ? '고구마와 함께하는 리액트' : props.tech}
        </li>
      )
    };
    
    export default List;
    ```
    
    `tech: string`이 아니라, `'REACT' | 'NEXT' | ...` 처럼 **유니온 타입**으로 제한했기 때문에 안정성이 높아져요.
    
    → 잘못된 문자열을 props로 넘기면 TypeScript가 컴파일 단계에서 에러를 발생시켜요.
    
    ![스크린샷 2025-09-12 오전 7.15.35.png](attachment:e605e06f-e208-473a-a967-9a86e8dbe461:스크린샷_2025-09-12_오전_7.15.35.png)
    
    이런 식으로 한다면, 결괏값이 어떻게 될 줄 예측되시나요?
    
    ---
    
    ### 예상 결과
    
    1. **`REACT`를 전달했을 때**
        - 조건문에 따라 `"고구마와 함께하는 리액트"`라는 문자열이 렌더링돼요.
        - 즉, `props.tech`가 `"REACT"`라면 특별한 문구로 대체되는 거예요.
        
        ```tsx
        <List tech="REACT" />
        ```
        
        → 결과:
        
        ```tsx
        고구마와 함께하는 리액트
        ```
        
    2. **다른 기술 스택(`NEXT`, `VUE`, `SVELTE`, `ANGULAR`, `REACT-NATIVE`)을 전달했을 때**
        - 조건문이 false가 되므로 그대로 해당 값이 출력돼요.
            
            ```tsx
            <List tech="NEXT" /> // VUE, SVELTE, ANGULAR, REACT-NATIVE도 동일
            ```
            
            → 결과:
            
            ```
            NEXT
            ```
            
    
    ![스크린샷 2025-09-12 오전 7.19.00.png](attachment:728ed5a2-d8ee-4e1e-8b3c-e6498324ce9b:스크린샷_2025-09-12_오전_7.19.00.png)
    
    ---
    
    마지막으로, 실제 개발에서는 `key={idx}` 대신 서버에서 내려주는 **고유 id**를 쓰는 걸 권장해요.
    
    삭제/정렬 같은 변경이 발생할 때 인덱스 키는 예기치 않은 리렌더 문제가 생길 수 있어요.
    
    여기까지 따라오셨다면, 여러분의 **첫 컴포넌트 분리 + 타입 지정**을 성공하신 거예요. 축하해요! 🎉

    - **useState** 기초 🍠
    
    ### useState 기초
    
    `useState`는 함수형 컴포넌트 안에서 **상태(state)**를 정의하고, 이 상태를 관리할 수 있게 해주는 훅이에요.
    
    가장 기본적인 사용법은 아래와 같아요.
    
    ```tsx
    import { useState } from 'react';
    
    // <> 안에는 초기값에 해당하는 타입을 넣어주면 돼요!
    // 초기값 자리에 1을 넣는 경우 → <number>
    // useState<number>(1)
    
    // 초기값 자리에 ['오', '타', '니']를 넣는 경우 → <string[]>
    // const [state, setState] = useState<string[]>(['오', '타', '니']);
    
    const [state, setState] = useState<초기값에 해당하는 타입>(초기값);
    ```
    
    - `useState`는 배열을 반환해요.
    - 첫 번째 원소는 **현재 상태 값(state)**, 두 번째 원소는 **상태를 변경하는 함수(setState)**예요.
    - `state`는 처음엔 `useState`의 괄호 안에 넣어준 초기값을 그대로 가지고 있어요.
    - `setState`를 호출하면 상태 값이 바뀌고, **상태가 바뀌면 React는 컴포넌트를 다시 렌더링해요.**
        
        → 이 원리를 꼭 이해해 두는 게 중요합니다!
        
    
    ---
    
    ### useState 실습 진행
    
    글로만 보면 와닿지 않으니까, 간단한 **카운터(counter)** 예제를 만들어볼게요.
    
    `App.tsx`를 아래처럼 수정해 주세요.
    
    ```tsx
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState<number>(0);
      return (
        <>
          <h1>{count}</h1>
        </>
      );
    }
    
    export default App;
    ```
    
    여기서 `count`의 초기값을 `0`으로 설정했으니, 웹을 실행하면 당연히 화면에는 `0`이 출력돼요.
    
    그럼 이제 버튼을 눌렀을 때 이 숫자를 증가시켜 볼게요.
    
    React에서는 JS의 `onclick`처럼 **`onClick` 이벤트 핸들러**를 제공해요.
    
    ```tsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
      return (
         <>
          <h1>{count}</h1>
          <button onClick={() => {}}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    ```
    
    여기서 중요한 점은, **상태를 바꾸고 싶을 땐 반드시 `useState`가 반환해주는 두 번째 값(`setState`)을 사용해야 한다는 것**이에요.
    
    그래서 버튼 클릭 시 `setCount(count + 1)`을 실행해 줄게요.
    
    ```tsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
      return (
         <>
          <h1>{count}</h1>
          <button onClick={() => setCount(count + 1)}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    ```
    
    ![스크린샷 2024-09-09 오후 6.24.59.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/5862b26a-8b90-4d41-86de-dc6801be00e9/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.24.59.png)
    
    버튼을 누를 때마다 `setCount`가 실행돼서 `count` 값이 1씩 증가하고,
    
    React는 새로운 값으로 컴포넌트를 리렌더링해요. 그래서 화면에 증가된 값이 보이게 돼요.
    
- **useState** 심화 🍠
    
    ### useState 심화
    
    앞에서 `useState`의 기초를 다뤘다면, 이번에는 조금 더 깊이 들어가 볼게요.
    
    ---
    
    ### 1. 타입 추론과 제네릭
    
    `TypeScript`에서는 `useState`에 타입을 명시하지 않아도, 초기값을 보고 자동으로 타입을 추론해요.
    
    ```tsx
    const [count, setCount] = useState(0);
    // count → number로 추론됨
    setCount(5);       // ✅ 정상
    setCount("hello"); // ❌ 오류 (number 타입이라 문자열 불가)
    ```
    
    즉, **초기값이 명확하다면 타입을 생략해도 안전해요.**
    
    ---
    
    하지만 초기값이 `null`이나 `undefined`라면, 타입을 제대로 추론하지 못할 수 있어요.
    이때는 **제네릭**을 명시해 주는 게 좋아요.
    
    ```tsx
    const [value, setValue] = useState<string | null>(null);
    // 초기값이 null → 타입 추론 불가 → 직접 지정
    
    setValue("Hello"); // ✅ 정상
    setValue(123);     // ❌ 오류 (string | null 타입만 허용)
    ```
    
    ---
    
    ### 2. onClick 함수 분리하기
    
    간단한 예제에서는 `onClick={() => setCount(count + 1)}`로 써도 돼요.
    
    하지만 기능이 복잡해지면, 함수로 따로 분리하면 더 읽기 좋아요.
    
    ```tsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
    
      const handleIncreaseNumber = () => {
        setCount(count + 1)
      }
    
      return (
         <>
          <h1>{count}</h1>
          <button onClick={handleIncreaseNumber}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    ```
    
    이제 `handleIncreaseNumber`만 봐도 “숫자를 증가시키는 함수구나” 하고 이해할 수 있죠.
    
    ---
    
    ### 3. setState를 여러 번 호출하면?
    
    아래 코드의 동작을 예측해볼까요?
    
    ```tsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
    
      const handleIncreaseNumber = () => {
        setCount(count + 1)
        setCount(count + 1)
        setCount(count + 1)
        setCount(count + 1)
        setCount(count + 1)
        setCount(count + 1)
      }
    
      return (
         <>
          <h1>{count}</h1>
          <button onClick={handleIncreaseNumber}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    ```
    
    버튼을 누르면 **6씩 증가할 것 같지만, 실제로는 1만 증가해요.**
    
    **왜 그런 걸까? (Lexical Environment)**
    
    React는 상태를 즉시 업데이트하지 않아요.
    대신 함수가 실행될 당시의 상태(`count`)를 기억해 두고, 그 값으로 계산해요.
    
    즉, `handleIncreaseNumber` 안에서 `count`는 항상 **0으로 고정된 것처럼 동작**해요.
    
    ```tsx
    setCount(count + 1); // 0 + 1
    setCount(count + 1); // 0 + 1
    setCount(count + 1); // 0 + 1
    setCount(count + 1); // 0 + 1
    setCount(count + 1); // 0 + 1
    setCount(count + 1); // 0 + 1
    
    // 최종 결과: 1
    ```
    
    이건 자바스크립트의 **클로저**와 관련이 있어요.
    
    → 함수가 실행될 때의 **변수 환경(Lexical Environment)**을 기억하기 때문이에요.
    
    (참고: [MDN 클로저](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures))
    
    ![스크린샷 2024-09-09 오후 6.35.30.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/2bb27390-3b77-4ae1-9781-7713b9189b88/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.35.30.png)
    
    **해결 방법: setState의 함수형 업데이트**
    
    `setState`는 두 가지 방식으로 쓸 수 있어요.
    
    1. 직접 값을 업데이트
    
    ```tsx
    setCount(count + 1);
    ```
    
    1. **이전 상태 값을 인자로 받아서 업데이트**
    
    ```tsx
    setCount(prev => prev + 1);
    ```
    
    두 번째 방식이 바로 문제 해결의 핵심이에요!
    
    ```tsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
    
      const handleIncreaseNumber = () => {
        setCount(prev => prev + 1)
        setCount(prev => prev + 1)
        setCount(prev => prev + 1)
        setCount(prev => prev + 1)
        setCount(prev => prev + 1)
        setCount(prev => prev + 1)
      }
    
      return (
         <>
          <h1>{count}</h1>
          <button onClick={handleIncreaseNumber}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    ```
    
    이제는 버튼을 한 번 누를 때마다 **6씩 증가**해요.
    
- **useState** 객체 상태 업데이트 🍠
    
    ### useState로 객체 상태 변화하기
    
    `useState`는 숫자뿐만 아니라 **객체 상태**도 관리할 수 있어요.
    
    하지만 객체는 **참조 타입**이기 때문에, 상태를 변경할 때 **얕은 복사**와 **깊은 복사** 개념을 이해하고 전개 연산자(`...`)를 잘 활용하는 게 중요합니다.
    
    ---
    
    - 얕은 복사
        
        ### 얕은 복사
        
        얕은 복사는 **한 단계까지만 복사**하는 방식이에요.
        
        복사된 객체는 원본 객체와 내부 참조를 공유하기 때문에, 중첩 객체가 있다면 원본도 같이 바뀔 수 있어요.
        
        ```tsx
        const [person, setPerson] = useState({
          name: "김용민",
          age: 26,
          nickname: "매튜"
        });
        
        const newPerson = { ...person }; // 얕은 복사
        newPerson.nickname = "야호";
        
        console.log(person.nickname); // "매튜" (원본은 그대로 유지)
        ```
        
    - 깊은 복사
        
        ### 깊은 복사
        
        깊은 복사는 **중첩된 값까지 전부 새로운 복사본**을 만드는 방식이에요.
        
        복사본을 수정해도 원본 객체에는 영향을 주지 않아요.
        
        ```tsx
        const newPersonDeep = JSON.parse(JSON.stringify(person)); // 깊은 복사
        ```
        
        - 장점: 원본과 완전히 독립된 객체가 생성됨
        - 단점: `undefined`, 함수 같은 값은 복사되지 않음 → 라이브러리(`lodash.cloneDeep`)를 쓰는 게 더 안전할 수 있어요.
    - 실습: **useState**로 객체 업데이트하기
        
        ### 실습: useState로 객체 업데이트
        
        ```tsx
        import { useState } from 'react';
        
        function App() {
          // 초기 상태: name, age, nickname, city를 가진 객체
          const [person, setPerson] = useState({
            name: '김용민',
            age: 26,
            nickname: '매튜',
            city: '', // city 키를 미리 넣어둬야 타입이 추론됨
          });
        
          // city 업데이트
          const updateCity = () => {
            setPerson((prevPerson) => ({
              ...prevPerson,   // 기존 상태 복사
              city: '서울',    // city 값만 덮어쓰기
            }));
          };
        
          // age 1 증가
          const increaseAge = () => {
            setPerson((prevPerson) => ({
              ...prevPerson,           // 기존 상태 복사
              age: prevPerson.age + 1, // age만 +1
            }));
          };
        
          return (
            <>
              <h1>이름: {person.name}</h1>
              <h2>나이: {person.age}</h2>
              <h3>닉네임: {person.nickname}</h3>
              {person.city && <h4>도시: {person.city}</h4>}
              <button onClick={updateCity}>도시 추가</button>
              <button onClick={increaseAge}>나이 증가</button>
            </>
          );
        }
        
        export default App;
        ```
        
        ![스크린샷 2024-09-09 오후 7.03.11.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/510e5b89-e5c0-4da9-baa6-01ad4d4ca7ab/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_7.03.11.png)

        - **위의 영상과 블로그를 보고 Lazy Initialization(게으른 초기화)**에 대해 설명해주세요 🍠
    
    1️⃣ 게으른 초기화란?
    
    `useState`의 초기값으로 값(Value) 대신 함수(Function)를 전달하는 기법이다. 리액트는 이 함수를 오직 첫 번째 렌더링(Mount) 시에만 호출하고, 이후의 재렌더링 할 떄는 무시한다.
    
    2️⃣ 게으른 초기화 사용하는 이유
    
    리액트 컴포넌트는 상태가 업데이트 될 때마다 함수 전체가 재실행된다.
    
    - **문제점** : 만약 useState의 초기값을 구하는 로직이 복잡하면 화면이 바뀔 때마다 초기값을 계산하느라 불필요한 리소스(CPU  또는 메모리)를 낭비하게 된다.
        
        ⇒ 게으른 초기화를 사용하면, 리액트에게 이 값은 처음 한번만 계산하면 되니까 나중에 진짜 필요할 때만 이 함수를 실행해 달라고 요청 하는 것 
        
    
    3️⃣ 초기화 vs 게으른 초기화
    
    | 구분 | 일반적인 초기화 | 게으른 초기화 |
    | --- | --- | --- |
    | 코드 | `useState(heavyWork())` | `useState(()⇒ heavyWork())` |
    | 실행 시점 | 매 랜더링 마다 `heavyWork`실행 | 최초 렌더링 할 때 한번만 실행 |
    | 비용 | 높음 | 낮음 |
    
    **일반적인 방식** : 리렌더링 될 때마다 getLargeData()가 호출 된다. 리액트는 호출된 결과를 받아오지만, 첫 렌더링 이후엔 그 결과를 버리는 낭비가 발생한다.
    
    ```tsx
    const [data, setData] = useState(getLargeData());
    ```
    
    **게으른 초기화 방식** : 함수 자체를 전달 했기에 리액트는 첫 렌더링 때만 이 함수를 실행한다. 이후 리렌더링 할때는 이 함수를 사용하지 않는다.
    
    ```tsx
    const [data, setData] = useState(() => {
    	const saveData = getLargeData();
    	return saveData;
    });
    ```
    
    4️⃣ 언제 사용하면 될까?
    
    모든 곳에서는 쓰지 않고 비싼 비용이 드는 경우에만 사용한다.
    
    1. 브라우저 저장소 접근
    2. 복잡한 계산 : filter, map 등으로 가공하여 초기 상태를 만든다.
    3. 날짜 / 시간 생성
    4. 클래스 생성
    
    ✅ **정리**
    
    게으른 초기화는 함수를 전달 함으로써 실행 시점을 리액트에게 위임하는 기술이다.
    
- **App.tsx** 파일에 직접 카운터가 1씩 증가, 1씩 감소하는 기능을 만들어주세요 🍠
    - 직접 작성한 코드 **App.tsx** 파일을 올려주세요!
        
        ```tsx
        import { useState } from 'react';
        
        function App() {
          const [count, setCount] = useState(0);
        
          const increase = () => {
            setCount(count + 1);
          };
        
          const decrease = () => {
            setCount(count - 1);
          };
        
          return (
            <>
              <h2>{count}</h2>
              <div>
                <button onClick={increase}>+1 증가</button>
                <button onClick={decrease}>-1 감소</button>
              </div>
            </>
          );
        }
        
        export default App;
        ```
        
    - 정답 (스스로 혼자 해보고 꼭 열어서 확인해주세요!)
        
        ```tsx
        import { useState } from 'react';
        
        function App() {
          const [count, setCount] = useState(0);
        
          const handleIncrement = () => {
            setCount(count + 1);
          };
        
          const handleDecrement = () => {
            setCount(count - 1);
          };
        
          return (
            <>
              <h1>{count}</h1>
              <div>
                <button onClick={handleIncrement}>+1 증가</button>
                <button onClick={handleDecrement}>-1 감소</button>
              </div>
            </>
          );
        }
        
        export default App;
        
        ```
        
- 영상을 보고 실습을 하면서 몰랐던 개념들을 토글을 열어 정리해주세요 🍠
    
    1️⃣ 상태(State)와 `useState` 훅
    
    상태는 시간이 지남에 따라 변하는 데이터를 의미한다.
    
    - 변수와의 차이는 일반 변수는 값이 바뀌어도 화면이 자동으로 바뀌지 않지만 `useState`로 만든 상태는 값이 바뀌면 화면을 다시 그려준다.
    - 구조 분해 할당 : [count, setCount]처럼 배열의 형태로 받아 현재 값과 그 값을 수정할 함수를 한 쌍으로 제공한다.
    
    2️⃣ 이벤트 핸들링
    
    사용자의 동작을 감지하고 로직을 실행하는 방법이다.
    
    - `onClick` 속성 : HTML에서는 `onlick`이지만 리액트에서는 카멜 케이스를 사용해서 `onclick`으로 작성한다.
    - 함수 전달 : `onClick={increase}`처럼 함수의 이름만 전달해야 한다. 만약 `onClick={increase()}`라고 적으면 페이지가 로드되자마자 함수가 실행되니 유의해야한다.
    
    3️⃣ 리렌더링의 원리
    
    1. 사용자가 버튼을 클릭한다.
    2. `setCount` 함수가 실행되어 상태값이 바뀐다.
    3. 리액트가 상태가 변했으니 다시 그려하는 상황을 판단한다.
    4. `App` 함수를 다시 실행하여 바뀐 `count` 값이 적용된 새로운 HTML(JSX)을 화면에 보여준다.
    
    4️⃣ JSX 문법의 특징
    
    - 중괄호 `{ }` 사용: JSX 안에서 자바스크립트 변수나 함수를 사용할 때는 반드시 중괄호로 감싸야 리액트가 문자열이 아닌 코드로 인식한다.

    