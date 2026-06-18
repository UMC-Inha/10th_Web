# Referential Equality (참조 동일성)

## Referential Equality는 무엇인가요?

간단히 말하면, **참조 동일성**은 “두 변수가 **완전히 같은 객체를 가리키고 있는가**?”를 보는 개념이다.

- “같은 값이냐?”가 아니라 “같은 **메모리 주소(같은 객체 인스턴스)**를 가리키냐?”를 묻는 것
- **“두 객체가 진짜로 같은 녀석이냐?”** 를 확인할 때 쓰는 기준

---

## 1. 자바스크립트에서 값 vs 참조

### 1-1. 값(primitive) 타입

- `number`, `string`, `boolean`, `null`, `undefined`, `bigint`, `symbol`
- 변수 안에 **값 자체**가 들어 있다.

```js
let a = 10;
let b = 10;

console.log(a === b); // true (값 비교)
```

### 1-2. 참조(object) 타입

- `object`, `array`, `function`, `Date`, `Map` 등
- 변수 안에는 “객체가 저장된 메모리 위치(참조)”가 들어 있다.

```js
const obj1 = { x: 1 };
const obj2 = { x: 1 };
const obj3 = obj1;

console.log(obj1 === obj2); // false (서로 다른 객체)
console.log(obj1 === obj3); // true  (같은 객체를 가리킴)
```

- `obj1`과 `obj2`는 모양은 같지만 **서로 다른 객체**
- `obj1`과 `obj3`는 **정확히 같은 객체**를 공유 → 참조 동일

---

## 2. `==`, `===`, `Object.is`

### `==` (느슨한 동등)

- 타입을 **암묵적으로 변환**하면서 비교
- 예측하기 어려운 경우가 많아 **실무에서는 거의 사용하지 않는 것이 좋다**

```js
0 == false;          // true
"" == false;         // true
null == undefined;   // true
```

### `===` (엄격한 동등)

- 타입 변환 없이 **그대로 비교**
- primitive → “값 동일성”
- 객체/배열/함수 → “참조 동일성”

```js
// primitive
1 === 1;       // true
"hi" === "hi"; // true

// object
const a = { x: 1 };
const b = { x: 1 };
const c = a;

a === b; // false
a === c; // true
```

### `Object.is`

- 기본적으로 `===`와 비슷하지만 `NaN`, `+0` vs `-0` 같은 특수 케이스에서만 다름
- **객체에 대해서는 `===`와 동일하게 참조 동일성**을 비교

```js
NaN === NaN;           // false
Object.is(NaN, NaN);   // true

+0 === -0;             // true
Object.is(+0, -0);     // false
```

---

## 3. 객체 / 배열 / 함수 예제

### 객체

```js
const user1 = { name: "kim" };
const user2 = { name: "kim" };
const user3 = user1;

console.log(user1 === user2); // false
console.log(user1 === user3); // true
```

### 배열

```js
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const arr3 = arr1;

console.log(arr1 === arr2); // false
console.log(arr1 === arr3); // true
```

“배열 **내용**이 같은지”를 보려면 직접 비교 로직이 필요하다.

```js
const isArrayEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

console.log(isArrayEqual(arr1, arr2)); // true (값 동일성)
```

### 함수

```js
function foo() {}
const bar = function () {};
const baz = foo;

console.log(foo === bar); // false (다른 함수 객체)
console.log(foo === baz); // true  (같은 함수 객체)
```

함수도 **객체**이므로 참조 단위로 비교된다.

---

## 4. 참조 동일성이 중요한 이유

### 4-1. 가변 객체 공유로 인한 사이드 이펙트

```js
const state = { count: 0 };

function increment(s) {
  s.count += 1;
  return s;
}

const a = state;
const b = increment(state);

console.log(a === b);     // true
console.log(state.count); // 1
```

`state`, `a`, `b`가 **같은 객체를 공유**하므로 한 곳에서 수정하면 전부 같이 바뀐다.

### 4-2. 불변 객체 + 참조 동일성

```js
const state = { count: 0 };

function incrementImmutable(s) {
  return { ...s, count: s.count + 1 };
}

const a = state;
const b = incrementImmutable(state);

console.log(a === b); // false (새 객체)
console.log(a.count); // 0
console.log(b.count); // 1
```

원본은 그대로 두고 **새 객체를 반환**하면, “참조가 바뀌었는지”만으로 변경 여부를 감지할 수 있다.

리액트에서 `useMemo`, `useCallback`, `React.memo`, Redux 상태 비교 등이 **“참조가 바뀌었냐?”** 를 기준으로 최적화하는 이유가 여기에 있다.

---

## 5. 자주 하는 실수

### “객체 내용이 같은데 왜 false죠?”

```js
const a = { x: 1 };
const b = { x: 1 };

console.log(a === b); // false
```

`===`는 **내용**이 아니라 **같은 객체인지**를 묻는다. 내용 비교는 deepEqual 로직이 필요하다.

### 배열도 마찬가지

```js
[1, 2, 3] === [1, 2, 3]; // false
```

매번 새로 만들어지는 배열은 **다른 객체**다.

### 직접 수정하면 참조 비교로는 변경을 알 수 없음

```js
const state = { x: 1 };

function mutate(s) {
  s.x = 2;
}

mutate(state);
console.log(state === state); // 항상 true
```

참조 비교로 변경을 감지하려면 **불변 패턴(새 객체 생성)**을 써야 한다.

---

## 리액트 렌더링 최적화와 Referential Equality의 관계

### 리렌더링이 일어나는 조건

리액트는 기본적으로 **상태(state)나 props가 바뀌면** 컴포넌트를 다시 렌더링한다.

문제는 props가 “겉보기 값”은 같아도 **참조가 매번 새로 만들어지면** 리액트 입장에서는 “바뀌었다”고 판단한다는 점이다.

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // 렌더마다 새 함수 객체 생성 → 참조가 매번 바뀜
  const handleClick = () => console.log('click');

  return <Child onClick={handleClick} />;
}
```

`count`만 바뀌어도 `handleClick`은 매 렌더마다 새 함수이므로, `Child`는 `onClick` props가 바뀌었다고 인식한다.

### React.memo와의 관계

`React.memo`는 **props를 얕은 비교(shallow compare)** 한다. 즉 `===`로 각 prop을 비교한다.

```tsx
const Child = memo(function Child({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>클릭</button>;
});
```

- `onClick`의 **참조가 같으면** → 리렌더링 스킵
- `onClick`의 **참조가 다르면** → 다시 렌더링

객체·배열·함수 props는 내용이 같아도 참조가 바뀌면 memo 효과가 사라진다.

### useCallback / useMemo와의 관계

| 훅 | 메모이제이션 대상 | 목적 |
|---|---|---|
| `useCallback` | 함수 | 함수 참조를 deps가 같을 때 유지 |
| `useMemo` | 계산 결과(값) | 값/객체/배열 참조를 deps가 같을 때 유지 |

둘 다 **“참조 동일성을 유지해서, memo·useEffect·Context 소비자의 불필요한 재실행을 줄이는 것”** 이 핵심이다.

### 실습 코드에서의 예시 (LpsPage)

무한 스크롤 LP 목록에서 카드가 수십~수백 개일 때, 부모(`LpsPage`)의 `sort` 상태가 바뀌면 모든 `LpCard`가 다시 그려질 수 있다.

```tsx
const LpCard = memo(function LpCard({ lp, onNavigate }: LpCardProps) {
  return (
    <div onClick={() => onNavigate(lp.id)}>
      {/* ... */}
    </div>
  );
});

function LpsPage() {
  const navigate = useNavigate();

  // navigate가 바뀌지 않는 한 같은 함수 참조 유지
  const handleCardClick = useCallback(
    (id: number) => navigate(`/lp/${id}`),
    [navigate],
  );

  return (
    <>
      {lps.map((lp) => (
        <LpCard key={lp.id} lp={lp} onNavigate={handleCardClick} />
      ))}
    </>
  );
}
```

- `memo` → `lp`, `onNavigate` 참조가 같으면 `LpCard` 리렌더 스킵
- `useCallback` → `onNavigate` 참조를 안정적으로 유지
- `onClick={() => navigate(...)}` 처럼 **렌더마다 새 함수를 넘기면 memo가 무력화**된다

### 정리

| 개념 | 역할 |
|---|---|
| Referential Equality | `===`로 “같은 객체/함수인가” 판단 |
| React.memo | props 참조가 같으면 리렌더 스킵 |
| useCallback | 함수 참조 유지 |
| useMemo | 계산 결과 참조 유지 |
| 불변 업데이트 | 상태 변경 시 새 객체/배열 생성 → 변경 감지 가능 |

**참조 동일성은 리액트 최적화의 기반 개념**이다. memo·useCallback·useMemo는 모두 “참조가 불필요하게 바뀌지 않게” 돕는 도구이고, 남용하면 오히려 메모리·비교 비용만 늘어날 수 있으므로 **실제로 리렌더 비용이 큰 구간**에 쓰는 것이 좋다.
