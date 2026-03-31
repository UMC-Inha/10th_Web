# 여러 개의 태그를 동시에 반환하려고 할 때
1. `div`로 감싸기

```jsx
// 코드 아래 첨부
function App() {
    return (
        <div>
            <strong>상명대학교</strong>
            <p>매튜/김용민</p>
        </div>
    )
}
```

2. `<>`로 감싸기

`<>`, `</>` 를 Fragment라고 하는데, 이는 실제 HTML에 `div` 같은 태그를 추가하지 않고 묶어주는 역할을 함

```jsx
function App() {
    return (
        <>
            <strong>상명대학교</strong>
            <p>매튜/김용민</p>
        <>
    )
}
```

<aside>
🍠

이유: React는 `return`에서 딱 하나의 루트 요소를 원하기 때문

</aside>

# 구조분해 할당 활용 방법
## 상황

예를 들어 아래와 같은 컴포넌트가 있다고 하면

```jsx
function Profile(props) {
	return (
		<div>
			<h1>{props.name}</h1>
			<p>{props.tect}</p>
			<p>{props.age}</p>
		</div>
	);
}
```

이렇게 쓰면 

- `props.name`
- `props.tech`
- `props.age`

여러 `props`를 꺼낼 때 계속 앞에 `props`를 붙여야 해서 번거로움

## 구조분해할당

그래서 구조분해할당을 쓰게 됨

구조분해할당은 객체 안에 있는 값을 꺼내서 바로 변수처럼 쓸 수 있게 해주는 문법

```jsx
const person {
	name: '서현',
	age: 25
};

const { name, age } = person;
```

## React에서 구조분해할당을 쓰는 두 가지 방법

### 1. 함수 안에서 구조분해할당하기

```jsx
function Profile(props) {
	const { name, tech, age } = props;
	
	return (
		<div>
			<h1>{name}</h1>
			<p>{tech}</p>
			<p>{age}</p>
		</div>
	);
}
```

이 방식의 의미

- 일단 `props` 전체를 가져오고,
- 그 안에서 필요한 값만 꺼내는 것

```jsx
const { name, tech, age } = props;
```

위 한 줄 덕분에 [`props.name`](http://props.name) 대신 `name`으로 쓸 수 있음

### 2. 매개변수에서 바로 구조분해할당하기

이게 더 많이 쓰이는 방식

```jsx
function Profile({ name, tech, age }) {
	return (
		<div>
			<h1>{name}</h1>
			<p>{tect}</p>
			<p>{age}</p>
		</div>
	);
}
```

이 방식의 의미

함수를 시작하자마자 props를 바로 뜯어서 받는 것

원래는

```jsx
function Profile(props)
```

인데, 이걸

```jsx
function Profile({ name, tech, age })
```

이렇게 바꿔서 함수 안에서 바로 `name`, `tech` , `age`를 바로 쓸 수 있음

### 왜 매개변수에서 구조분해할당하는 방식을 많이 쓸까?

1. **코드가 짧음**
    
    함수 안에서 구조분해할당하는 방법
    
    ```jsx
    function Profile(props) {
    	const { name, tech, age } = props;
    	
    	return (
    		<div>
    			<h1>{name}</h1>
    			<p>{tech}</p>
    			<p>{age}</p>
    		</div>
    	)
    };
    ```
    
    매개변수에서 구조분해할당하는 방법
    
    ```jsx
    function Profile({ name, tech, age }) {
    	return (
    		<div>
    			<h1>{name}</h1>
    			<p>{tech}</p>
    			<p>{age}</p>
    		</div>
    	)
    };
    ```
    
2. **컴포넌트가 뭘 받는지 바로 보임**
    
    `function Profile({ name, tech })` 이렇게 쓰면 함수 시작에서부터
    
    > 아 이 컴포넌트는 `name`, `tech`를 받는구나
    > 
    
    가 바로 보임

# Lazy Initialization
초기값을 미리 계산하지 말고, 처음 필요할 때 딱 한 번만 계산하자!

## useState 방식

예를 들어 이런 코드가 있다고 하면

```jsx
const [value, setValue] = useState(100);
```

초기값이 100인 코드이기에 처음 화면이 뜰 때 value가 100으로 시작하게 됨

### 초기값이 계산이 필요하다면?

예를 들어 이런 함수가 있다고 하고,

```jsx
function getInitialValue() {
	console.log('초기값 계산..');
	return 100;
}
```

이 함수를 아래처럼 쓰면

```jsx
const [value, setValue] = useState(getInitialValue());
```

함수를 바로 실행한 결과값을 넣는 것

즉,

- `getInitialValue()`를 먼저 실행하고
- 그 결과인 `100`을 `useState`에 넣는 것

### 문제

이렇게 쓰면 컴포넌트가 다시 렌더링될 때마다 `getInitialValue()`가 계속 실행됨

근데 state의 초기값은 사실 처음 한 번만 필요한데, 이렇게 되면 React 입장에서는

- state 초기값은 이미 정해졌는데
- 함수는 또 실행되고 결과는 버려지는

낭비가 생길 수 있음

## lazy initialization

이러한 문제를 없애기 위해 lazy initialization을 씀

```jsx
const [value, setValue] = useState(() => getInitialValue());
```

```jsx
const [value, setValue] = useState(getInitialValue);
```

위와 같은 코드가 있으면, React에

> 지금 바로 실행하지 말고, 처음 state를 만들 때만 이 함수를 실행해서 초기값을 가져와줘
> 

라고 하는 게 **lazy initialization**임

## 차이

### 일반 방식

```jsx
useState(getInitialValue());
```

이 함수를 당장 실행하라는 의미

### lazy initialization

```jsx
useState(() => getInitialValue())
```

이 함수는 나중에 React가 필요할 때 한 번만 실행하라는 의미