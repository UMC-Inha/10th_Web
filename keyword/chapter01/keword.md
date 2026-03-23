# TypeScript 키워드 정리

## [반환값에 타입을 붙이면 그것이 TypeScript] null과 undefined의 차이점에 대해 직접 작성해주세요 🍠

### 1️⃣ 기본 개념

- `undefined` : 값이 할당되지 않은 상태 (기본값)
- `null` : 값이 의도적으로 비어있음을 표현

---

### 2️⃣ JavaScript 기준 차이

✔️ **undefined**

```javascript
let a;
console.log(a); // undefined
```

👉 변수 선언만 하고 값을 안 넣으면 자동으로 `undefined`

✔️ null

```javascript
let b = null;
```

👉 개발자가 "값이 없다"를 명시적으로 표현

---

### 3️⃣ TypeScript에서의 차이

TypeScript에서는 더 엄격하게 구분됨

```TypeScript
let a: number;
a = undefined; // ❌ strict 모드에서는 에러가 남

let b: number | undefined;
b = undefined; // ✅

let c: number | null;
c = null; // ✅
```

---

### 4️⃣ strictNullChecks

```TypeScript
"strictNullChecks": true
```

이 옵션이 켜지면:

- `null`, `undefined`를 "아무데나 못 넣게 막는다"
- 안정성 ↑

---

✔️ 꺼져있을 때

```TypeScript
let num: number = 10;

num = null;
num = undefined;
```

👉 strictNullChecks = false면 통과됨

---

✔️ 켜져있을 때

```TypeScript
let num: number = 10;

num = null;      // ❌ 에러
num = undefined; // ❌ 에러
```

👉 strictNullChecks = false면 통과됨

---

### 5️⃣ 사용하는 경우

✔️ **undefined 쓰는 경우**

👉 "아직 값이 안 정해짐"

```TypeScript
let user;
```

또는

```TypeScript
type User = {
  name?: string; // undefined 가능
};
```

👉 ? = 값 없어도 됨 → undefined

---

✔️ **null 쓰는 경우**

👉 "일부러 비워둠"

```TypeScript
let selectedUser: string | null = null;
```

👉 예:

- 선택된 유저 없음
- 초기화 상태

---

## [함수에서의 TypeScript] 함수 선언식, 화살표 함수의 특징에 대해 정리해주세요! 🍠

### 함수 선언식의 특징

1️⃣ **호이스팅 가능**

```TypeScript
add(1, 2); // ✅ 가능

function add(a: number, b: number): number{
    return a + b;
}
```

- 함수 선언식은 코드 위에서 먼저 호출해도 실행됨

---

2️⃣ **이름이 있는 함수**

```TypeScript
function minus(x: number, y: number): number{
    return x - y;
}
```

- 함수 이름(`minus`)이 있어서
- 디버깅 시 추적하기 쉬움

---

3️⃣ **this 바인딩이 동적으로 결정됨**
👉 호출 방식에 따라 `this`가 바뀜

```TypeScript
const obj = {
  value: 10,
  getValue: function () {
    return this.value;
  },
};
```

---

### 화살표 함수의 특징

1️⃣ **호이스팅 불가능**

```TypeScript
getSum(1, 2); // ❌ 에러

const getSum = (a: number, b: number): number => {
  return a + b;
};
```

- 변수에 담기기 때문에
- 선언 전에 사용 불가

---

2️⃣ 익명 함수로도 사용됨

**익명함수란?**
👉 이름이 없는 함수

```javascript
() => {
  console.log("hello");
};
```

✔️ 특징

- 함수 이름이 없음
- 변수에 담아서 사용하거나
- 바로 실행하거나 (콜백/이벤트)

**사용 예시**

✔️ 변수에 담기

```javascript
const sum = function (x, y) {
  return x + y;
};
```

✔️ 이벤트 / 콜백

```javascript
btn.addEventListener("click", () => {
  console.log("클릭");
});
```

**화살표 함수로 변환**

👉 위 익명 함수를 더 간단하게 쓴 것이 화살표 함수

```TypeScript
const sum = (x, y) => {
  return x + y;
};
```

```javascript
btn.addEventListener("click", () => {
  console.log("클릭");
});
```

👉 즉, 화살표 함수는
이름 없이 바로 정의해서 사용하는 함수 형태에 적합함

---

3️⃣ **this가 고정됨 (Lexical this)**

👉 화살표 함수는 자기 this가 없음<br>
👉 대신 바깥 스코프의 this를 그대로 사용함

```TypeScript
const obj = {
    value: 10,
    getValue: () => {
        return this.value;
    }
}
```

| 구분                   | this 결정 방식                                         |
| ---------------------- | ------------------------------------------------------ |
| 일반 함수 (`function`) | 호출되는 시점에 결정됨 (누가 호출했는지에 따라 달라짐) |
| 화살표 함수 (`=>`)     | 선언되는 시점에 결정됨 (바깥 this 그대로 사용)         |

```javascript
const obj = {
  value: 10,

  normal: function () {
    console.log(this.value);
  },

  arrow: () => {
    console.log(this.value);
  },
};

obj.normal(); // 10
obj.arrow(); // ❌ undefined
```

✔️ 핵심

- 일반 함수 → this가 바뀜 (동적)
- 화살표 함수 → this 고정됨 (정적, Lexical this)

👉 그래서 화살표 함수는
객체 메서드로 사용할 때 주의해야 함

---

4️⃣ 콜백 함수에 자주 사용됨

```TypeScript
arr.map((item) => item * 2)
```

- 짧고, 간단

---

5️⃣ arguments 객체 없음

👉 화살표 함수는 `arguments`를 가지지 않음

```javascript
function normal() {
  console.log(arguments);
}

const arrow = () => {
  console.log(arguments); // ❌ 없음
};
```

👉 대신 나머지 매개변수 (rest parameter) 사용

```javascript
const arrow = (...args) => {
  console.log(args);
};
```

---

6️⃣ 생성자로 사용 불가

👉 화살표 함수는 `new`로 객체 생성 불가능

```javascript
const Person = (name) => {
  this.name = name;
};

const p = new Person("kim"); // ❌ 에러
```

👉 prototype이 없기 때문

---

7️⃣ 언제 사용하면 좋은가

✔️ this를 유지해야 할 때

- 클래스 내부
- 콜백 함수
- 이벤트 핸들러

✔️ 짧은 함수 작성할 때

- 배열 메서드 (map, filter, forEach 등)

---

8️⃣ 사용을 피해야 하는 경우

❌ 객체 메서드 정의할 때

```javascript
const obj = {
  name: "kim",
  getName: () => this.name, // ❌
};
```

👉 일반 함수 사용해야 함

```javascript
getName() {
  return this.name;
}
```

---

## [타입 스크립트에만 존재하는 타입] any, unknown, void, never 🍠

### any

모든 타입을 허용하는 타입 (타입 검사 포기)

```TypeScript
let value: any;

value = 10;
value = "문자열";
value = true;
```

---

✔️ 특징

- 타입 체크를 하지 않음
- JavaScript처럼 동작
- 어떤 값이든 할당 가능

---

⚠️ 문제점

```TypeScript
let value: any = "hello";
value.toFixed(); // ❌ 런타임 에러
```

👉 컴파일 에러 안 나고 실행하다가 터짐

---

### unknown

타입을 모르는 상태 (안전한 any)

```TypeScript
let value: unknown;

value = 10;
value = "문자열";
```

---

✔️ 특징

- 모든 값을 받을 수 있음
- 하지만 바로 사용할 수 없음

---

오류 예시 코드:

```TypeScript
let value: unknown = "hello";
value.toUpperCase(); // ❌ 에러
```

👉 타입 체크 필요로 해결

```TypeScript
if (typeof value === "string") {
  value.toUpperCase(); // ✅
}
```

---

### void

아무것도 반환하지 않는 함수

```TypeScript
function print(): void {
  console.log("hello");
}
```

---

✔️ 특징

- return 값 없음
- undefined만 허용됨

---

오류 예시 코드:

```TypeScript
function test(): void {
  return 123; // ❌
}
```

---

### never

절대 끝나지 않거나, 절대 반환하지 않는 함수

1️⃣ 무한 루프

```TypeScript
function loop(): never {
  while (true) {}
}
```

2️⃣ 에러 발생

```TypeScript
function error(): never {
  throw new Error("에러 발생");
}
```

---

✔️ 특징

- return 자체가 없음
- 함수가 끝나지 않음

---
