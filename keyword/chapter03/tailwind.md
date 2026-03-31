# Tailwind CSS

## Tailwind CSS란?

- Tailwind CSS는 <strong>유틸리티 퍼스트(Utility-First)</strong> 접근 방식을 기반으로 하는 최신 CSS 프레임워크임
- 스타일을 CSS 파일에 따로 작성하는 대신, <strong>미리 정의된 유틸리티 클래스들을 HTML/JSX 코드에서 직접 사용</strong>하여 UI를 구성함
- 짧고 직관적인 클래스 이름들을 조합하여 빠르게 UI를 만들 수 있고, 별도의 CSS 파일 작성량을 크게 줄일 수 있음

### Utility-First 방식

- Tailwind는 `p-4`, `bg-blue-500`, `text-center`와 같은 <strong>유틸리티 클래스</strong>들을 제공함
- 각 클래스는 하나의 역할(하나의 CSS 속성 또는 소수의 관련 속성)에만 집중함
- 개발자는 이 클래스들을 조합해 원하는 UI를 만들고, 커스텀 CSS는 최소화함

```html
<div class="p-4 bg-blue-500 text-center">
  Tailwind CSS Example
</div>
```

- 위 코드에서 실제로 적용되는 스타일은 다음과 같음
  1. `p-4` → `padding: 1rem;` (16px)
  2. `bg-blue-500` → Tailwind가 제공하는 파랑 컬러 팔레트 중 하나 (숫자가 커질수록 더 진한 색)
  3. `text-center` → `text-align: center;`

- 즉, 원래라면 세 줄 이상의 CSS를 별도로 작성해야 하지만, <strong>HTML/JSX 상에서 클래스 조합만으로 UI를 완성</strong>할 수 있음

---

## Tailwind v4의 핵심 특징

### 1. Built-in JIT (Just-In-Time) 엔진

- v3부터 도입된 JIT 모드가 v4에서는 <strong>기본 엔진으로 통합</strong>됨
- 실제 코드에서 사용한 클래스만 빌드 결과물에 포함되므로, <strong>최종 CSS 파일 크기가 매우 작아짐</strong>
- JSX 안에서 `bg-[#123456]`처럼 <strong>임의의 값(임의 색상, 임의 spacing 등)</strong>을 사용해도, JIT 엔진이 해당 유틸리티 클래스를 빌드 시점에 동적으로 생성함

### 2. 모바일 우선(Mobile-First) 반응형 설계

- Tailwind는 기본 스타일을 <strong>모바일 기준</strong>으로 두고, 큰 화면일수록 점진적으로 스타일을 확장하는 구조임
- 반응형 프리픽스: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

```html
<div class="text-sm md:text-base lg:text-lg">
  반응형 텍스트
</div>
```

- 기본(모바일): `text-sm`
- `md:` (보통 768px 이상): `text-base`
- `lg:` (보통 1024px 이상): `text-lg`

### 3. Tailwind 구성 파일 (Configuration)

- v4에서는 설정 방식이 정리되어, <strong>TypeScript 기반의 `tailwind.config.ts` 사용이 권장</strong>됨
- 주요 설정 항목
  - `content`: Tailwind가 클래스 이름을 스캔할 파일 경로
  - `theme`: 색상, 폰트, spacing, 브레이크포인트 등의 커스터마이징
  - `darkMode`: `'class'` 혹은 `'media'` 전략 선택
  - `plugins`: 공식/커뮤니티 플러그인 등록

```tsx
// tailwind.config.ts
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## Content Scanning: purge → content

### purge란?

- Tailwind는 기본적으로 수천 개의 유틸리티 클래스를 가지고 있음
- 실제 프로젝트에서 사용하는 클래스는 그중 일부에 불과함
- `purge` 옵션은 <strong>실제 HTML/JS/TSX 등에서 사용한 클래스만 최종 CSS에 포함시키고, 나머지는 제거</strong>하는 기능이었음

```tsx
// v2 시절 예시
module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
};
```

### content란?

- v3부터는 `purge` 대신 <strong>`content` 필드</strong>로 이름이 바뀜
- 의미는 같지만, "Tailwind가 클래스를 검색할 <strong>콘텐츠 파일 경로</strong>"라는 의도가 더 명확해짐

```tsx
// v4 기준 예시
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
};
```

- 빌드 시 Tailwind는 `content`에 지정된 모든 파일을 스캔하여, 실제로 등장한 클래스만 CSS로 생성함
- 덕분에 프로덕션 번들의 CSS 용량을 크게 줄일 수 있음

---

## 플러그인 시스템

- Tailwind는 공식 및 커뮤니티 <strong>플러그인 시스템</strong>을 제공함
- 반복되는 패턴이나 컴포넌트를 유틸리티로 추상화하거나, 폼/타이포그래피 등 특정 도메인에 특화된 스타일을 쉽게 추가할 수 있음

- 대표적인 공식 플러그인 예시
  - `@tailwindcss/forms`
  - `@tailwindcss/typography`
  - `@tailwindcss/aspect-ratio`

```tsx
// tailwind.config.ts
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [forms, typography],
};
```

---

## 반응형 & 상태 기반 클래스

### 반응형 프리픽스

- Tailwind는 다음과 같은 반응형 프리픽스를 제공함
  - `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- 예시

```html
<button class="px-4 py-2 text-sm md:text-base lg:text-lg">
  반응형 버튼
</button>
```

### 상태 기반 프리픽스

- 상태(인터랙션)에 따라 스타일을 바꾸는 프리픽스
  - `hover:`
  - `focus:`
  - `active:`
  - `disabled:`

```html
<button class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
  버튼
</button>
```

- 반응형 + 상태 조합도 가능함

```html
<button class="bg-blue-500 hover:bg-blue-600 md:bg-green-500 md:hover:bg-green-600">
  반응형 + 상태 조합
</button>
```

---

## 다크 모드 지원

- Tailwind는 `dark:` 프리픽스를 통해 <strong>다크 모드에 따른 스타일 분기</strong>를 간단히 표현할 수 있음

```html
<div class="bg-white text-black dark:bg-black dark:text-white">
  다크 모드 지원
</div>
```

- `tailwind.config.ts`에서 다크 모드 전략 설정
  - `darkMode: 'media'` → OS 시스템 설정을 기준으로 자동 다크 모드
  - `darkMode: 'class'` → 루트 엘리먼트에 `class="dark"`를 수동으로 토글하는 방식

```tsx
export default {
  darkMode: 'class', // 또는 'media'
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## 공식 문서 활용 팁

- Tailwind 공식 문서에는 유틸리티 클래스를 <strong>주제별(레이아웃, 색상, 타이포그래피, spacing 등)</strong>로 잘 정리해 둠
- 특정 속성이 궁금하다면, 문서 검색창에 CSS 속성 이름이나 키워드(예: `height`, `flex`, `grid`, `shadow`)를 입력하면 관련 유틸리티 목록과 예시를 바로 확인할 수 있음
- 실무에서는
  - 문서를 열어두고 필요한 유틸리티를 검색
  - 컴포넌트에 바로 클래스 조합을 붙여 넣으며 시도
  - 괜찮은 패턴은 재사용 가능한 컴포넌트로 추출
  하는 식으로 사용하는 경우가 많음

