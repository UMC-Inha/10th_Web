# JSX

## JSX란

- JSX(JavaScript XML)는 JavaScript 파일 안에서 HTML과 유사한 마크업을 작성할 수 있게 해주는 JavaScript 구문 확장임
- React에서 UI를 선언적으로 표현하기 위해 사용하며, 컴포넌트의 렌더링 로직과 마크업을 같은 위치에 둘 수 있게 해줌
- JSX는 브라우저가 직접 이해할 수 없으므로, Babel이나 SWC 같은 트랜스파일러를 통해 `React.createElement()` 호출로 변환됨

```tsx
// JSX 작성
const element = <h1>안녕하세요</h1>;

// 트랜스파일 결과
const element = React.createElement('h1', null, '안녕하세요');
```

## JSX 규칙

React 공식 문서에서 제시하는 JSX의 핵심 규칙은 다음과 같음

### 1. 하나의 루트 엘리먼트만 반환해야 함

컴포넌트는 반드시 하나의 루트 엘리먼트만 반환해야 함. JSX가 내부적으로 JavaScript 객체로 변환되기 때문에, 하나의 함수에서 두 개의 객체를 배열로 감싸지 않고는 반환할 수 없기 때문임

```tsx
// 올바른 방식
function App() {
  return <strong>인하대학교</strong>;
}

export default App;
```

```tsx
// 잘못된 방식: 두 개의 루트 엘리먼트를 반환하고 있음
function App() {
  return (
    <strong>인하대학교</strong>
    <p>김해원</p>
  );
}

export default App;
```

여러 엘리먼트를 반환해야 하지만 불필요한 DOM 노드를 추가하고 싶지 않을 때는 <strong>Fragment(`<> </>`)</strong>를 사용함

```tsx
function App() {
  return (
    <>
      <strong>인하대학교</strong>
      <p>김해원</p>
    </>
  );
}

export default App;
```

- Fragment는 실제 DOM에 아무런 엘리먼트를 추가하지 않고, 여러 자식 엘리먼트를 그룹화할 수 있음
- `<React.Fragment>`의 축약 문법이 `<> </>`임. `key`가 필요한 경우에는 `<React.Fragment key={id}>`를 사용해야 함

### 2. 모든 태그는 닫아야 함

JSX에서는 HTML과 달리 모든 태그를 명시적으로 닫아야 함. `<img>`, `<br>`, `<input>` 같은 self-closing 태그도 반드시 `<img />`, `<br />`, `<input />`으로 작성해야 함

### 3. 대부분의 속성은 camelCase로 작성함

JSX의 속성(attribute)은 JavaScript 객체의 키가 되므로 camelCase 표기법을 따름

- `class` -> `className`
- `for` -> `htmlFor`
- `tabindex` -> `tabIndex`
- `onclick` -> `onClick`

`class`와 `for`는 JavaScript의 예약어이기 때문에 `className`, `htmlFor`로 대체함

## JSX에서의 스타일링

### className을 활용한 스타일링

외부 CSS 파일을 import하고, `className` 속성으로 클래스를 지정하는 방식임

```tsx
import './App.css';

function App() {
  return (
    <>
      <strong className="school">인하대학교</strong>
      <p>김해원</p>
    </>
  );
}

export default App;
```

```css
.school {
  background-color: blue;
  color: white;
  font-size: 10rem;
}
```

### Inline 스타일링

JSX에서 `style` 속성은 문자열이 아닌 JavaScript 객체를 받음. CSS 속성명은 camelCase로 작성해야 함

```tsx
function App() {
  return (
    <>
      <strong className="school">인하대학교</strong>
      <p style={{ color: 'purple', fontWeight: 'bold', fontSize: '3rem' }}>김해원</p>
    </>
  );
}

export default App;
```

중괄호가 두 번 쓰이는 이유는 다음과 같음

1. 바깥쪽 `{}` -- JSX 안에서 JavaScript 표현식을 사용하겠다는 의미
2. 안쪽 `{}` -- JavaScript 객체 리터럴

HTML과 JSX의 스타일 문법 비교:

```html
<!-- HTML: 문자열, kebab-case -->
<div style="background-color: purple">인하대학교</div>
```

```tsx
// JSX: 객체, camelCase
<div style={{ backgroundColor: 'purple' }}>인하대학교</div>
```

## JSX에서 중괄호를 사용한 JavaScript 표현식

### 로컬 변수 참조

컴포넌트 함수 내부에서 선언한 변수를 JSX에서 사용할 때는 중괄호 `{}`로 감싸야 함. 중괄호 없이 작성하면 단순 문자열로 인식됨

```tsx
function App() {
  const name = '김해원';
  return (
    <>
      <strong className="school">인하대학교</strong>
      <p style={{ color: 'purple', fontWeight: 'bold', fontSize: '3rem' }}>{name}</p>
    </>
  );
}

export default App;
```

- 중괄호 안에는 문자열, 숫자, 변수뿐 아니라 함수 호출, 삼항 연산자 등 모든 JavaScript 표현식(expression)을 넣을 수 있음
- 단, if문이나 for문 같은 문(statement)은 넣을 수 없음

### 템플릿 리터럴과 함께 사용

백틱(`` ` ``)을 활용한 템플릿 리터럴도 JavaScript 표현식이므로 중괄호 안에서 사용할 수 있음

```tsx
function App() {
  const name = '김해원';
  const school = '인하대학교';
  return (
    <>
      <strong className="school">{school}</strong>
      <p style={{ color: 'purple', fontWeight: 'bold', fontSize: '3rem' }}>{name}</p>
      <h1>{`${name}은 ${school} 학생입니다`}</h1>
    </>
  );
}

export default App;
```

## 리스트 렌더링

### map을 활용한 배열 렌더링

배열 데이터를 JSX로 렌더링할 때는 `Array.prototype.map()`을 사용함

```tsx
function App() {
  const name = '김해원';
  const school = '인하대학교';
  const techStack = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE'];

  return (
    <>
      <strong className="school">{school}</strong>
      <p style={{ color: 'purple', fontWeight: 'bold', fontSize: '3rem' }}>{name}</p>
      <h1>{`${name}은 ${school} 학생입니다`}</h1>
      <ul>
        {techStack.map((tech, idx) => {
          return <li key={idx}>{tech}</li>;
        })}
      </ul>
    </>
  );
}

export default App;
```

`map`의 콜백에서 중괄호 `{}`를 사용하면 `return`을 명시해야 하고, 소괄호 `()`를 사용하면 암묵적 반환(implicit return)이 됨

```tsx
// 중괄호 사용: return 필요
{
  techStack.map((tech, idx) => {
    return <li key={idx}>{tech}</li>;
  });
}

// 소괄호 사용: return 생략 가능
{
  techStack.map((tech, idx) => <li key={idx}>{tech}</li>);
}
```

### key의 역할

`map`으로 렌더링하는 각 엘리먼트에는 반드시 `key` prop을 전달해야 함

- `key`는 React가 리스트 내 각 엘리먼트를 식별하여 추가/삭제/재정렬을 정확히 처리하기 위해 필요함
- 배열 인덱스를 `key`로 사용하면 항목의 삽입/삭제/재정렬 시 예기치 않은 동작이 발생할 수 있으므로, 서버에서 내려주는 고유 id 같은 안정적인 값을 사용하는 것이 권장됨

```tsx
// 권장: 고유 id 사용
{
  items.map((item) => <li key={item.id}>{item.name}</li>);
}
```

변수 이름은 배열에는 복수형, 개별 항목에는 단수형을 사용하면 가독성이 좋음

```tsx
const frameworks = ['React', 'Vue', 'Svelte'];

frameworks.map((framework) => <li key={framework}>{framework}</li>);
```

## 컴포넌트 분리

### 첫 컴포넌트 만들기

리스트 항목을 별도의 컴포넌트로 분리하면 재사용성과 유지보수성이 높아짐. `src/components/List.tsx` 파일을 생성하고, 기존 `<li>` 부분을 독립 컴포넌트로 추출함

**List.tsx**

```tsx
const List = () => {
  return <li></li>;
};

export default List;
```

**App.tsx**

```tsx
import './App.css';
import List from './components/List';

function App() {
  const name = '김해원';
  const school = '인하대학교';
  const techStack = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE'];

  return (
    <>
      <strong className="school">{school}</strong>
      <p style={{ color: 'purple', fontWeight: 'bold', fontSize: '3rem' }}>{name}</p>
      <h1>{`${name}은 ${school} 학생입니다`}</h1>
      <ul>
        {techStack.map((tech, idx) => (
          <List key={idx} tech={tech} />
        ))}
      </ul>
    </>
  );
}

export default App;
```

### Props 전달과 확인

부모 컴포넌트에서 `<List tech={tech} />`로 전달한 데이터는 자식 컴포넌트의 매개변수에 객체 형태로 전달됨

```tsx
const List = (props) => {
  console.log(props); // { tech: 'REACT' }
  return <li>{props.tech}</li>;
};

export default List;
```

`props`는 객체이므로, `tech` 값에 접근하려면 `props.tech`로 작성해야 함

### 구조 분해 할당(Destructuring)

props가 많아지면 `props.tech`, `props.name`처럼 반복 작성이 번거로워짐. JavaScript의 구조 분해 할당을 활용하면 코드가 간결해짐

**방식 1: 매개변수에서 직접 구조 분해**

```tsx
const List = ({ tech }) => {
  return <li>{tech}</li>;
};

export default List;
```

**방식 2: 함수 내부에서 구조 분해**

```tsx
const List = (props) => {
  const { tech } = props;
  return <li>{tech}</li>;
};

export default List;
```

인라인 스타일을 추가하여 리스트 마커를 제거할 수도 있음

```tsx
const List = ({ tech }) => {
  return <li style={{ listStyle: 'none' }}>{tech}</li>;
};

export default List;
```

## TypeScript와 JSX (TSX)

### Props 타입 정의

TypeScript 환경에서는 컴포넌트가 받는 props의 타입을 명시적으로 선언해야 함. `interface`를 사용하여 props의 구조를 정의함

```tsx
interface ListProps {
  tech: string;
}

const List = ({ tech }: ListProps) => {
  return <li style={{ listStyle: 'none' }}>{tech}</li>;
};

export default List;
```

- 타입을 선언하면 에디터에서 자동 완성과 타입 힌트를 제공받을 수 있음
- 잘못된 타입의 값을 props로 전달하면 컴파일 단계에서 에러가 발생하여 런타임 버그를 사전에 방지할 수 있음

```tsx
<List tech={42} /> // 컴파일 에러: Type 'number' is not assignable to type 'string'
```

### Union 타입을 활용한 Props 제한

`type` 별칭으로 union 타입을 정의하면, props에 전달할 수 있는 값을 특정 문자열로 제한할 수 있음

```tsx
type Tech = 'REACT' | 'NEXT' | 'VUE' | 'SVELTE' | 'ANGULAR' | 'REACT-NATIVE';

interface ListProps {
  tech: Tech;
}

const List = ({ tech }: ListProps) => {
  return (
    <li style={{ listStyle: 'none' }}>
      {tech === 'REACT' ? '인하대학교와 함께하는 리액트' : tech}
    </li>
  );
};

export default List;
```

- `tech: string`으로 선언하면 어떤 문자열이든 전달 가능하지만, union 타입으로 제한하면 허용된 값 외에는 컴파일 에러가 발생함
- `type`은 union, intersection 같은 타입 조합에 유리하고, `interface`는 객체 구조 정의와 확장(`extends`)에 유리하므로 상황에 따라 적절히 조합하여 사용함

**렌더링 결과 예측**

위 코드에서 `tech` 값에 따른 렌더링 결과는 다음과 같음

```tsx
<List tech="REACT" />       // "인하대학교와 함께하는 리액트"
<List tech="NEXT" />        // "NEXT"
<List tech="VUE" />         // "VUE"
<List tech="SVELTE" />      // "SVELTE"
<List tech="ANGULAR" />     // "ANGULAR"
<List tech="REACT-NATIVE" /> // "REACT-NATIVE"
```

- 삼항 연산자(`condition ? A : B`)는 JSX 안에서 조건부 렌더링을 수행하는 가장 기본적인 방법임
- 조건이 많아지면 컴포넌트 외부에서 매핑 객체를 사용하거나, 별도의 함수로 분리하는 것이 가독성 면에서 유리함
