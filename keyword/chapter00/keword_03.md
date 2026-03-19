# JavaScript 키워드 정리

## [객체 타입 - 함수] 호이스팅 (Hoisting) 🍠

### 호이스팅이란?

👉 **선언문이 코드의 최상단으로 끌어올려진 것처럼 동작하는 JavaScript의 특징**

---

### 왜 발생할까?

👉 JavaScript는 코드를 실행하기 전에

<b>1️⃣ 평가 단계 (Creation Phase)</b>에서 <br>
→ 모든 선언을 먼저 처리하고

<b>2️⃣ 실행 단계 (Execution Phase)</b>에서 <br>
→ 코드를 실행하기 때문

---

### 동작 과정

```js
console.log(score); // undefined
var score = 10;
```

👉 JS 내부 동작

```js
// 평가 단계
var score; // 선언 먼저 처리됨 (undefined로 초기화)

// 실행 단계
console.log(score); // undefined
score = 10;
```

- 선언은 끌어올려짐 (Hoisting)
- 할당은 그대로 위치에서 실행됨

🔹 그래서 결과가 `undefined`

---

### 변수 종류별 호이스팅

**1️⃣ var**

```js
console.log(a); // undefined
var a = 10;
```

✔ 특징

- 선언 + 초기화(undefined)까지 호이스팅
- 에러 없음

---

**2️⃣ let / const**

```js
console.log(b); // ❌ ReferenceError
let b = 10;
```

✔ 특징

- 선언은 호이스팅됨
- **초기화는 안됨**
- TDZ(Temporal Dead Zone) 존재

---

### TDZ (Temporal Dead Zone)

👉 선언은 되었지만 초기화되기 전 구간

```js
{
  console.log(x); // ❌ 에러
  let x = 10;
}
```

이 구간이 TDZ

---

### 함수 호이스팅

**1️⃣ 함수 선언문**

```js
hello();

function hello() {
  console.log("hi");
}
```

✔ 정상 실행됨

👉 함수 전체가 호이스팅됨

---

**2️⃣ 함수 표현식**

```js
hello(); // ❌ 에러

var hello = function () {
  console.log("hi");
};
```

👉 내부적으로

```js
var hello; // undefined

hello(); // ❌ TypeError: hello is not a function
```

- 실행 시점의 hello는 undefined이고
- 함수가 아니라 undefined를 호출하려 해서 에러가 발생함

---

### 정리

| 구분        | 호이스팅       | 초기화    | 접근     |
| ----------- | -------------- | --------- | -------- |
| var         | O              | undefined | 가능     |
| let         | O              | X         | TDZ 에러 |
| const       | O              | X         | TDZ 에러 |
| 함수 선언문 | O              | O         | 가능     |
| 함수 표현식 | 변수 규칙 따름 | -         | 제한     |

---

## DOM 조작 🍠

### DOM이란?

👉 **DOM (Document Object Model)**

- HTML 문서를 트리 구조 객체로 변환한 것
- JavaScript가 HTML을 읽고 / 수정 / 삭제 / 생성할 수 있게 해줌

구조:

```html
<body>
  <div>
    <p>카사</p>
  </div>
</body>
```

👉 내부적으로

```plain
Document
 └── body
      └── div
           └── p
                └── "카사"
```

🔹 즉, **모든 요소 = 객체 (Node)**

---

### DOM 조작이란?

👉 JS로 DOM 트리를 변경하는 것

- 요소 선택
- 내용 변경
- 스타일 변경
- 이벤트 처리
- 요소 생성 / 삭제

---

### 요소 선택 (Selector)

```JavaScript
document.getElementById('id')
document.querySelector('selector')
document.querySelectorAll('selector')
```

📄 예시 코드

```html
<div id="title">저녁 메뉴</div>
<ul>
    <li class="item">간장게장</li>
    <li class="item"> 콰삭킹 </li>
</ul>

<script>
    const title = document.getElementById('title');      // #title 하나
    const firstItem = document.querySelector('.item');   // 첫 번째 .item
    const allItems = document.querySelectorAll('.item'); // 모든 .item
```

- querySelector는 CSS 선택자를 그대로 사용

👉 비교
| 메서드 | 반환값 | 특징 |
| ---------------- | -------- | --------- |
| getElementById | Element | 빠름, id 전용 |하나하나
| querySelector | Element | CSS 선택자 |
| querySelectorAll | NodeList | 여러 개 |

<br>

> 이때 NodeList는 배열 같지만 배열이 아님

---

**NodeList vs Array**

```JavaScript
const items = document.querySelectorAll('.item');

items.forEach() // 가능
items.map()     // ❌ 안됨
```

👉 해결

```JavaScript
[...items].map()
```

---

### 이벤트 리스너 추가하기

`addEventListener`를 사용하면 특정 동작이 일어날 때 실행할 함수를 등록할 수 있음

기본 구조:

```javascript
element.addEventListener("click", handler);
```

📄 예시 코드

```html
<button id="btn">꾸욱</button>
<script>
  const btn = document.querySelector("#btn");

  btn.addEventListener("click", () => {
    console.log("버튼이 눌렸어요");
  });
</script>
```

---

**이벤트 객체**

```javascript
btn.addEventListener("click", (e) => {
  console.log(e.target); // 실제 클릭된 요소
});
```

---

**이벤트 버블링**

```html
<div id="parent">
  <button id="child">클릭</button>
</div>
```

👉 클릭 시

```
child → parent → document
```

🔹 이벤트가 위로 올라감

---

**이벤트 위임**

```javascript
ul.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    //  HTML에서 element.tagName은 항상 대문자 반환
    console.log("li 클릭됨");
  }
});
```

- 여러 요소에 이벤트를 달지 않고 <br>
  👉 부모 하나에만 달아서 처리

---

### 이벤트 리스너 제거하기

`removeEventListener`를 사용하면 등록된 이벤트를 해제할 수 있음

- 같은 함수 참조를 전달해야 함

📄 예시 코드

```html
<button id="btn">꾸욱</button>
<script>
  const btn = document.querySelector("#btn");

  function handleClick() {
    console.log("클릭했어요");
  }

  btn.addEventListener("click", handleClick);

  setTimeout(() => {
    btn.removeEventListener("click", handleClick);
  }, 5000);
</script>
```

❌ 잘못된 코드

```javascript
btn.addEventListener("click", () => {
  console.log("클릭");
});

btn.removeEventListener("click", () => {
  console.log("클릭");
});
```

- 다른 함수로 인식되어 제거가 안됨

  🔹 **같은 함수를 참조**할 것

---

### 키보드와 마우스 이벤트

자주 쓰이는 이벤트

- `click` : 마우스 클릭
- `mouseover` / `mouseout` : 마우스 올림 / 내림
- `keydown` / `keyup` : 키보드 누름 / 뗌
- `input` : 입력창 값이 바뀜

```javascript
<input id="textInput" placeholder="아무거나 입력해봐요" />

<script>
  const input = document.querySelector('#textInput');

  input.addEventListener('keydown', (e) => {
    console.log(`키를 눌렀어요: ${e.key}`);
  });
</script>
```

```javascript
input.addEventListener("input", (e) => {
  console.log(e.target.value);
});
```

- input 이벤트는 값이 바뀔 때마다 실행

---

### 태그 속성 다루기

```html
<img id="img" src="ddol.png" alt="똘이" />
```

```javascript
const img = document.querySelector("#img");

img.getAttribute("src");
img.setAttribute("alt", "강아지");
img.removeAttribute("src");
```

---

**Attribute vs Property**

```JavaScript
img.getAttribute('src'); // HTML에 적힌 값
img.src;                 // 현재 값 (JS 상태)
```

**차이**

- attribute: 초기값
- property: 현재 상태

---

**class 조작은 classList 사용**

```javascript
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("active");
```

---

### 부모와 자식 태그 찾기

DOM 계층을 따라 올라가거나 내려가며 요소를 찾을 수 있음

- `parentElement` : 부모
- `children` : 자식들 (HTMLCollection)
- `firstElementChild` / `lastElementChild` : 첫 / 마지막 자식

```html
<ul id="list">
  <li>감자</li>
  <li>고구마</li>
</ul>

<script>
  const list = document.querySelector("#list");
  console.log(list.parentElement); // list의 부모
  console.log(list.children[0]); // 첫 번째 자식 (감자)
</script>
```

**children vs childNodes**

- children: 요소만 포함
- childNodes: 텍스트 포함
- ***

### 새로운 태그 만들기

```javascript
const li = document.createElement("li"); // 태그 생성
li.textContent = "새로운 아이템";
list.appendChild(li);
```

**append vs appendChild**

- append: 여러 개 + 문자열 가능
- appendChild: 하나만

---

**위치 지정 삽입**

```javascript
parent.prepend(el); // 맨 앞
parent.append(el); // 맨 뒤

parent.before(el); // 앞
parent.after(el); // 뒤
```

---

### 태그 복제하기

```javascript
const clone = node.cloneNode(true);
```

- `true` → 자식까지 복사
- `false` → 태그만 복사

👉 이벤트는 복사 안됨

```javascript
cloneNode(true); // 이벤트 리스너는 복제되지 않음
```

---

### DOM 변경 (조작)

1️⃣ **텍스트 변경**

```javascript
el.textContent = "카사";
```

👉 HTML 무시 (안전)

```javascript
el.innerHTML = "<b>카사</b>";
```

👉 HTML 포함 (XSS 위험 있음)

2️⃣ 스타일 변경

```javascript
el.style.color = "red";
```

👉 ❌ 단점: inline style

보완:

```javascript
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("active");
```

---

### DOM 탐색

```javascript
el.parentElement;
el.children;
el.firstElementChild;
el.lastElementChild;
```

---

### 렌더링 흐름

**브라우저 과정**

```
HTML → DOM 생성
CSS → CSSOM 생성
→ Render Tree 생성
→ Layout
→ Paint
```

👉 DOM 많이 건드리면 느려짐

❗ 안 좋은 코드

```javascript
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(div);
}
```

👉 1000번 렌더링

**해결 (Fragment)**

```javascript
const fragment = document.createDocumentFragment();

for (...) {
  fragment.appendChild(div);
}

document.body.appendChild(fragment);
```

👉 1번만! 렌더링

---

### React와 DOM 관계

👉 React는

- 실제 DOM 직접 조작 ❌
- Virtual DOM 사용

흐름:

```
상태 변경 → Virtual DOM 비교 → 최소 변경만 실제 DOM 반영
```

🔹 그래서 빠름
