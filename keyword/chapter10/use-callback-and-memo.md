# useCallback과 memo

> 참고: [useCallback 공식 문서](https://react.dev/reference/react/useCallback) · [memo 공식 문서](https://react.dev/reference/react/memo)

---

## useCallback

### useCallback이 무엇인지?

`useCallback`은 **함수를 메모이제이션**하는 React Hook이다.

```tsx
const cachedFn = useCallback(fn, dependencies);
```

- **메모이제이션**: `dependencies` 배열의 값이 이전 렌더와 **모두 같으면** 이전에 만들어 둔 **같은 함수 참조**를 재사용한다.
- **하나라도 바뀌면** 새 함수를 만들어 반환한다.

렌더마다 `const fn = () => {}` 를 작성하면 **매번 새 함수 객체**가 생기지만, `useCallback`으로 감싸면 deps가 같을 때 **참조가 유지**된다.

### 왜 useCallback을 사용하는지?

#### 1. 불필요한 리렌더링 방지

`React.memo`로 감싼 자식에게 콜백을 props로 넘길 때, 부모가 리렌더되어도 **함수 참조가 같으면** 자식은 리렌더를 건너뛸 수 있다.

#### 2. useEffect / useMemo 등의 deps 안정화

effect나 다른 훅의 dependency array에 함수를 넣을 때, 참조가 매번 바뀌면 **effect가 불필요하게 재실행**된다. `useCallback`으로 참조를 고정하면 이를 방지할 수 있다.

#### 3. Context value에 함수를 넣을 때

Context Provider의 value에 함수를 포함하면, 참조가 바뀔 때마다 **모든 consumer가 리렌더**된다. `useCallback`으로 login/logout 같은 함수를 고정하는 패턴이 흔하다.

#### 이득 vs 오버헤드

| 이득 | 오버헤드 |
|---|---|
| memo된 자식의 불필요한 리렌더 감소 | deps 비교 비용 |
| effect 재실행 감소 | 클로저 유지로 인한 메모리 |
| 대규모 리스트·무거운 자식에서 효과적 | 단순 컴포넌트에서는 체감 거의 없음 |

React 공식 문서도 **“모든 함수에 무조건 useCallback을 쓰지 말 것”** 을 권장한다. Profiler로 실제 병목을 확인한 뒤 적용하는 것이 좋다.

### useCallback 기본 사용법

```tsx
import { useCallback, useState } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(() => {
    console.log('검색:', query);
  }, [query]); // query가 바뀔 때만 새 함수 생성

  return <SearchForm onSearch={handleSearch} />;
}
```

#### deps 배열 규칙

- 콜백 **안에서 사용하는** props, state, context, 다른 함수를 deps에 넣는다.
- eslint-plugin-react-hooks의 `exhaustive-deps` 규칙을 따르는 것이 안전하다.
- deps가 `[]`이면 **마운트 시점의 값만** 캡처한다 → stale closure 주의.

#### 의존성 변경 시 동작

```tsx
const [count, setCount] = useState(0);

const increment = useCallback(() => {
  setCount(count + 1); // count를 deps에 넣어야 최신값 사용
}, [count]);
```

`count`가 0 → 1로 바뀌면 `increment` 함수 참조도 새로 만들어진다.

### useCallback에서 중요한 개념

#### 참조 동일성

```tsx
const fn1 = useCallback(() => {}, []);
const fn2 = useCallback(() => {}, []);

console.log(fn1 === fn2); // false (서로 다른 useCallback 호출)
```

같은 렌더 안에서 `useCallback`을 두 번 호출하면 **각각 다른 함수**다. 하나의 변수에 담아 재사용해야 한다.

#### stale closure (낡은 값 캡처)

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const log = useCallback(() => {
    console.log(count); // deps에 count가 없으면 항상 0
  }, []); // ❌ stale closure

  return <button onClick={log}>로그</button>;
}
```

**해결 방법**

1. deps에 `count` 추가
2. functional update 사용: `setCount(c => c + 1)` → count를 deps에서 제거 가능
3. `useRef`로 최신값 보관

```tsx
const increment = useCallback(() => {
  setCount((c) => c + 1); // count를 deps에 넣지 않아도 됨
}, []);
```

### useCallback 콜백 메모이제이션 예시

#### useCallback 없이/comparison

```tsx
function Parent() {
  const [sort, setSort] = useState('desc');

  return (
    <>
      <button onClick={() => setSort('asc')}>정렬</button>
      {items.map((item) => (
        // ❌ 렌더마다 새 함수 → memo 무력화
        <Item key={item.id} onClick={() => handleClick(item.id)} />
      ))}
    </>
  );
}
```

#### useCallback + memo

```tsx
const Item = memo(function Item({
  item,
  onSelect,
}: {
  item: Item;
  onSelect: (id: number) => void;
}) {
  return <div onClick={() => onSelect(item.id)}>{item.name}</div>;
});

function Parent() {
  const handleSelect = useCallback((id: number) => {
    navigate(`/item/${id}`);
  }, [navigate]);

  return items.map((item) => (
    <Item key={item.id} item={item} onSelect={handleSelect} />
  ));
}
```

- `handleSelect` 참조가 안정적 → `Item`은 `item`이 바뀌지 않으면 리렌더 스킵
- `onSelect(item.id)`처럼 **자식 내부에서 id를 넘기는 패턴**이 `(id) => () => navigate(...)` 팩토리보다 memo와 잘 맞는다

### 이벤트 핸들러 / 비동기 로직 예시

#### API 호출 핸들러

```tsx
const handleSubmit = useCallback(async () => {
  await createLp({ title, content });
}, [title, content]);
```

#### useEffect dependency

```tsx
const fetchData = useCallback(async () => {
  const res = await getLps({ order: sort });
  setData(res);
}, [sort]);

useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData 참조가 sort 변경 시에만 바뀜
```

#### 디바운스와 함께

```tsx
const debouncedSearch = useMemo(
  () => debounce((q: string) => searchApi(q), 300),
  [],
);

const handleChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  },
  [debouncedSearch],
);
```

---

## memo

### memo가 무엇인지?

`memo`는 **컴포넌트를 메모이제이션**하는 고차(Higher-Order) API다.

```tsx
const MemoizedComponent = memo(Component, arePropsEqual?);
```

- 부모가 리렌더되어도 **props가 이전과 같으면** 해당 컴포넌트의 리렌더를 **건너뛴다**.
- props 비교는 기본적으로 **얕은 비교(shallow compare)** — 각 prop에 `Object.is` (거의 `===`) 적용.

### 왜 memo를 사용하는지?

- **렌더 비용이 큰** 자식(복잡한 UI, 긴 리스트 아이템)의 불필요한 재렌더 방지
- 부모 state 변경(정렬, 페이지네이션 등)과 **무관한 자식**을 보호
- 무한 스크롤 리스트처럼 **동일 아이템이 많이 반복**되는 UI에서 효과적

### memo 기본 사용법

```tsx
import { memo } from 'react';

type LpCardProps = {
  lp: LpDto;
  onNavigate: (id: number) => void;
};

const LpCard = memo(function LpCard({ lp, onNavigate }: LpCardProps) {
  return (
    <div onClick={() => onNavigate(lp.id)}>
      {lp.thumbnail ? (
        <img src={lp.thumbnail} alt={lp.title} />
      ) : null}
      <p>{lp.title}</p>
    </div>
  );
});

export default LpCard;
```

#### 커스텀 비교 함수 (선택)

```tsx
const LpCard = memo(
  LpCardComponent,
  (prev, next) => prev.lp.id === next.lp.id && prev.lp.title === next.lp.title,
);
```

기본 shallow compare로 충분한 경우가 많고, 커스텀 compare는 **실제로 필요할 때만** 사용한다.

### memo를 언제 쓰면 좋은지 / 안 좋은지

#### 쓰면 좋은 경우

- 리스트 아이템 컴포넌트 (수십~수백 개)
- 차트, 지도, 에디터 등 **렌더 비용이 큰** UI
- props가 자주 같고, 부모만 자주 리렌더되는 구조
- `useCallback` / `useMemo`와 **함께** props 참조를 안정화한 경우

#### 과하거나 효과 없는 경우

- props가 **매 렌더마다 바뀌는** 경우 (새 객체·새 함수를 계속 넘김)
- 컴포넌트가 **매우 가벼운** 경우 (비교 비용 > 렌더 비용)
- 거의 모든 props가 매번 변경되는 경우
- **memo만 쓰고 useCallback은 안 쓰는** 경우 (함수 props 때문에 memo 무효)

#### React 공식 입장

> “memo는 성능 문제가 **측정·확인된 후**에 추가하세요.”

Profiler(React DevTools)로 “왜 이 컴포넌트가 자주 리렌더되지?”를 먼저 확인하는 것이 좋다.

---

## useCallback + memo 함께 쓰는 패턴 정리

```
부모 리렌더
  ↓
useCallback → onNavigate 참조 유지
  ↓
memo(LpCard) → lp, onNavigate 같으면 스킵
  ↓
불필요한 카드 N개 리렌더 방지
```

| 없을 때 | 있을 때 |
|---|---|
| 부모 state 변경 → 모든 자식 리렌더 | 변경 없는 props의 자식은 스킵 |
| 함수 props 매번 새 참조 | 함수 참조 안정 |
| 긴 리스트에서 체감 지연 | 스크롤·정렬 시 UX 개선 |

---

## 🍠 실습 1. 기록하기

- **깃허브 주소**: _(본인 레포 URL 작성)_
- **실습 내용**: `LpsPage`의 `LpCard`에 `memo` + `useCallback` 적용, React DevTools Profiler로 리렌더 횟수 비교
- **실행 영상**: _(Profiler Before/After 캡처 또는 영상 링크 작성)_
