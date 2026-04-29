# Custom Hook

## React 훅과의 관계

- React <strong>내장 훅</strong>(<code>useState</code>, <code>useEffect</code>, <code>useRef</code>, <code>useContext</code> 등)은 함수 컴포넌트에서 <strong>상태·부수 효과·참조·전역 값</strong>을 선언적으로 다루기 위한 표준 도구임
- <strong>Custom Hook</strong>은 이런 훅들을 <strong>조합해 특정 로직을 함수 하나로 묶은 것</strong>임
- 규칙: 이름은 <strong><code>use</code>로 시작</strong>해야 하며, 다른 훅과 마찬가지로 <strong>컴포넌트 최상위에서 조건부 호출 없이</strong> 호출해야 함

---

## Custom Hook을 쓰는 이유

1. <strong>중복 제거</strong> — 여러 화면에서 같은 패턴의 상태·이펙트를 반복하지 않음
2. <strong>관심사 분리</strong> — UI와 데이터·동기화 로직을 나누어 읽기·수정이 쉬움
3. <strong>유지보수</strong> — 동작 변경 시 훅 파일 한곳을 고치면 연결된 컴포넌트에 반영하기 쉬움
4. <strong>테스트</strong> — UI 없이 로직만 검증하기 수월한 편임
5. <strong>의존성 표현</strong> — <code>useEffect</code> 의존성 배열 등으로 <strong>언제 실행·정리할지</strong>를 한곳에 모을 수 있음

---

## 파일 위치 관례

- 재사용 훅은 보통 <code>src/hooks/</code> 아래에 둠

```
src/
├── components/
├── hooks/
│   ├── useFetch.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useAuth.ts
│   └── useTheme.ts
├── pages/
└── App.tsx
```

- 실제 프로젝트에서는 팀 규칙에 따라 <code>features/</code> 단위로 두기도 함

---

## 기본 문법

```tsx
import { useState } from 'react';

function useCustomHook() {
  const [value, setValue] = useState('');

  const updateValue = (newValue: string) => setValue(newValue);

  return { value, updateValue };
}

export default useCustomHook;
```

- 함수 이름은 <strong><code>use</code> 접두사</strong> 필수
- 내부에서 다른 훅을 <strong>항상 같은 순서</strong>로 호출해야 함

---

## 예시: useToggle

### useState만 쓸 때의 아쉬운 점

- 토글마다 <code>setState((prev) => !prev)</code> 패턴이 반복됨
- 나중에 <strong>모든 토글에 로깅</strong>을 넣어야 하면 파일마다 수정해야 함

### Custom Hook으로 분리

```tsx
import { useState } from 'react';

function useToggle(initialValue: boolean = false) {
  const [state, setState] = useState(initialValue);

  const toggle = () => setState((prev) => !prev);

  return [state, toggle] as const;
}

export default useToggle;
```

### 사용

```tsx
import useToggle from '../hooks/useToggle';

const ToggleExample = () => {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div>
      <h1>{isOpen ? '열림' : '닫힘'}</h1>
      <button type="button" onClick={toggle}>
        토글
      </button>
    </div>
  );
};

export default ToggleExample;
```

### 기대 효과

- 토글 구현이 <strong>한 파일에 모임</strong> → 로깅·추적 로직을 <code>useToggle</code> 안에만 추가하면 됨
- 컴포넌트는 <code>const [isOpen, toggle] = useToggle(false)</code> 한 줄로 의도가 드러남

---

## 참고 자료

- <a href="https://react.dev/learn/reusing-logic-with-custom-hooks">React — Reusing Logic with Custom Hooks</a>
- <a href="https://react.dev/reference/rules/rules-of-hooks">React — Rules of Hooks</a>
