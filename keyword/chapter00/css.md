# CSS

### 선택자 활용

1. 태그
2. 아이디
3. 클래스

### CSS 우선순위

1. 사용자 스타일

- 브라우저에 기본적으로 지정되어 있는 스타일

2. 코드 스타일

- 개발자가 작성한 스타일

3. 사용자 지정 스타일

- 웹브라우저에서 유저가 지정한 스타일

### 코드 스타일 우선순위

1. !important
2. 인라인
3. 아이디
4. 클래스
5. 태그

> 동일 레벨에서는 후에 작성된 스타일이 적용됨

### box-sizing

- 100 x 100 박스 요소에 padding, border를 추가할 경우, 140 x 140처럼 전체 요소 크기가 늘어남
- 기본적으로 `box-sizing: content-box;`으로 설정되어 있어서 앞선 문제 발생함
- `box-sizing: border-box;`로 변경하면 의도대로 100 x 100을 유지할 수 있음

### border vs outline

- border: 박스 모델의 공간을 일부러 차지함 즉 박스의 실제 크기에 포함됨 border가 두꺼워지면 주변 요소들을 밀어내거나(box-sizing: content-box일 때), 안쪽 콘텐츠 영역을 좁힘(box-sizing: border-box일 때)
- outline: 공간을 차지하지 않는 그래픽적 요소일 뿐임 박스 모델의 가장 바깥 쪽인 margin 영역 위나 그 바깥에 그려짐 outline은 아무리 두꺼워져도 주변의 다른 요소를 절대 밀어내지 않음

### relative

- Document Flow에 따라 원래 본인이 있어야 할 위치를 기준으로, 좌표 프로퍼티(top / bottom / left / right) CSS 스타일을 통해 위치를 이동시키는 속성
- 위 → 아래로 이동: `top` CSS 적용
- 왼쪽 → 오른쪽으로 이동: `left` CSS 적용
- 아래 → 위로 이동: `bottom` CSS 적용
- 오른쪽 → 왼쪽으로 이동: `right` CSS 적용

### absolute

- Document Flow에서 완전히 제외되며, position: static이 아닌 부모/조상 요소를 기준으로 위치가 결정됨
- 기준이 되는 부모/조상 요소
  - `position: relative`
  - `position: absolute`
  - `position: fixed`
- 이 중 가장 가까운 조상을 기준으로 삼고, 만약 아무것도 position이 설정되어 있지 않다면 최상위 요소인 `<body>`를 부모로 여김
- 그렇기 때문에 부모 요소를 기준으로 위치를 정하고 싶다면 반드시 그 부모 요소에 `position: relative`를 선언해야 함

### fixed

- 부모 요소와 관계없이 viewport를 기준으로 위치가 고정
- Document Flow에서 완전히 빠져나옴

### sticky

- relative와 fixed의 하이브리드 속성
- Document Flow를 유지함
- 스크롤 임계점에 도달하면 고정됨
- 부모 요소의 범위를 벗어나지 않음

### 가운데 정렬

- text-align

  ```css
  text-align: left; /* 왼쪽 정렬 (기본값) */
  text-align: right; /* 오른쪽 정렬 */
  text-align: center; /* 가운데 정렬 */
  text-align: justify; /* 양쪽 정렬 */
  text-align: start; /* 문서 시작 방향 */
  text-align: end; /* 문서 끝 방향 */
  ```

  - 텍스트
  - 인라인 요소
  - 인라인 블록(`display: inline-block`)

- margin

  ```css
  /* 개별 설정 */
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;

  /* 단축 속성 */
  margin: 10px; /* 모든 방향 10px */
  margin: 10px 20px; /* 상하 10px, 좌우 20px */
  margin: 10px 20px 30px; /* 상 10px, 좌우 20px, 하 30px */
  margin: 10px 20px 30px 40px; /* 상 우 하 좌 (시계방향) */

  /* 특수 값 */
  margin: 0 auto; /* 좌우 자동 여백 (가운데 정렬) */
  margin: inherit; /* 부모 요소로부터 상속 */
  ```

  - 인접한 블록 요소의 상하 마진은 겹칠 수 있음
  - 음수 값 사용 가능함

- flex

  - 1차원 레이아웃 시스템
  - **부모 속성**

  ```css
  /* Flex 컨테이너 선언 */
  display: flex;
  display: inline-flex;

  /* 방향 설정 */
  flex-direction: row; /* 가로 방향 (기본값) */
  flex-direction: column; /* 세로 방향 */
  flex-direction: row-reverse; /* 가로 역방향 */
  flex-direction: column-reverse; /* 세로 역방향 */

  /* 줄바꿈 설정 */
  flex-wrap: nowrap; /* 한 줄에 배치 (기본값) */
  flex-wrap: wrap; /* 여러 줄 허용 */
  flex-wrap: wrap-reverse;

  /* 주축 정렬 */
  justify-content: flex-start; /* 시작점 정렬 */
  justify-content: center; /* 중앙 정렬 */
  justify-content: flex-end; /* 끝점 정렬 */
  justify-content: space-between; /* 양 끝 배치 */
  justify-content: space-around; /* 균등 여백 */
  justify-content: space-evenly; /* 완전 균등 */

  /* 교차축 정렬 */
  align-items: stretch; /* 늘리기 (기본값) */
  align-items: center; /* 중앙 정렬 */
  align-items: flex-start; /* 시작점 정렬 */
  align-items: flex-end; /* 끝점 정렬 */
  align-items: baseline; /* 텍스트 기준선 */

  /* 여러 줄 정렬 */
  align-content: stretch;
  align-content: center;
  align-content: space-between;

  /* 간격 설정 */
  gap: 20px; /* 모든 간격 20px */
  row-gap: 10px; /* 행 간격 */
  column-gap: 20px; /* 열 간격 */
  ```

  - **자식 속성**

  ```css
  /* 크기 조절 */
  flex-grow: 1; /* 늘어나는 비율 */
  flex-shrink: 1; /* 줄어드는 비율 */
  flex-basis: 200px; /* 기본 크기 */

  /* 단축 속성 */
  flex: 1; /* grow: 1, shrink: 1, basis: 0 */
  flex: 1 1 200px; /* grow shrink basis */

  /* 개별 정렬 */
  align-self: center; /* 자신만 다르게 정렬 */

  /* 순서 변경 */
  order: 1; /* 표시 순서 (음수 가능) */
  ```

- translate

  - 현재 위치에서 요소를 이동시키는 변환 함수
  - Document Flow에 영향을 주지 않음

  ```css
  /* 2D 이동 */
  transform: translateX(100px); /* X축 이동 */
  transform: translateY(50px); /* Y축 이동 */
  transform: translate(100px, 50px); /* X, Y 동시 */
  transform: translate(50%, 50%); /* 백분율 사용 */

  /* 3D 이동 */
  transform: translateZ(100px); /* Z축 이동 */
  transform: translate3d(x, y, z); /* 3D 이동 */

  /* 다른 transform과 조합 */
  transform: translate(50px, 100px) rotate(45deg);
  transform: translate(-50%, -50%) scale(1.2);
  ```

  - 성능 우수
  - 백분율 기준
  - transition, animation과 함께 자주 사용됨
  - `position: absolute`와 함께 가운데 정렬에 활용됨
  - 관련 속성

  ```css
  /* 변환 기준점 */
  transform-origin: center; /* 중앙 (기본값) */
  transform-origin: top left; /* 좌상단 */
  transform-origin: 50% 50%; /* 백분율 */

  /* 3D 설정 */
  transform-style: preserve-3d; /* 3D 공간 유지 */
  perspective: 1000px; /* 원근감 */
  ```

- grid

  - 2차원 레이아웃 시스템
  - **부모 속성**

  ```css
  /* Grid 컨테이너 선언 */
  display: grid;
  display: inline-grid;

  /* 열 정의 */
  grid-template-columns: 200px 200px 200px; /* 고정 크기 */
  grid-template-columns: 1fr 2fr 1fr; /* 비율 */
  grid-template-columns: repeat(3, 1fr); /* 반복 */
  grid-template-columns: minmax(100px, 1fr); /* 최소/최대 */
  grid-template-columns: auto-fit; /* 자동 맞춤 */

  /* 행 정의 */
  grid-template-rows: 100px 200px;
  grid-template-rows: repeat(3, minmax(100px, auto));

  /* 영역 정의 */
  grid-template-areas:
    'header header header'
    'sidebar main main'
    'footer footer footer';

  /* 간격 설정 */
  gap: 20px; /* 모든 간격 */
  row-gap: 10px; /* 행 간격 */
  column-gap: 20px; /* 열 간격 */

  /* 자동 배치 */
  grid-auto-flow: row; /* 행 방향 자동 배치 */
  grid-auto-flow: column; /* 열 방향 자동 배치 */
  grid-auto-flow: dense; /* 빈 공간 채우기 */

  /* 자동 크기 */
  grid-auto-rows: 100px; /* 자동 생성 행 크기 */
  grid-auto-columns: 1fr; /* 자동 생성 열 크기 */

  /* 정렬 (전체) */
  justify-content: center; /* 수평 정렬 */
  align-content: center; /* 수직 정렬 */
  place-content: center; /* 수평 + 수직 단축 */

  /* 정렬 (아이템) */
  justify-items: center; /* 아이템 수평 정렬 */
  align-items: center; /* 아이템 수직 정렬 */
  place-items: center; /* 아이템 정렬 단축 */
  ```

  - **자식 속성**

  ```css
  /* 위치 지정 */
  grid-column: 1 / 3; /* 1번째부터 3번째 라인까지 */
  grid-column: span 2; /* 2개 열 차지 */
  grid-row: 2 / 4; /* 2번째부터 4번째 라인까지 */

  /* 단축 속성 */
  grid-area: 2 / 1 / 4 / 3; /* row-start / col-start / row-end / col-end */
  grid-area: header; /* template-areas 이름 사용 */

  /* 개별 정렬 */
  justify-self: center; /* 자신만 수평 정렬 */
  align-self: center; /* 자신만 수직 정렬 */
  place-self: center; /* 자신만 정렬 단축 */
  ```

  - 유용한 함수들

  ```css
  /* repeat(): 반복 */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

  /* minmax(): 최소/최대값 */
  grid-template-columns: minmax(100px, 300px);
  grid-template-rows: minmax(50px, auto);

  /* fr 단위: 비율 */
  grid-template-columns: 1fr 2fr 1fr; /* 1:2:1 비율 */
  ```

### background

- background-image

  - 요소의 배경에 어떤 이미지를 쓸지 지정하는 속성
  - 예시
    - `background-image: url("image.png");`
    - `background-image: none;` (기본값, 이미지 없음)
  - 콤마로 구분해서 여러 장 겹칠 수도 있음
    - `background-image: url("a.png"), url("b.png");`

- background-repeat

  - 배경 이미지를 어떻게 반복(tile)할지 결정하는 속성
  - 주요 값
    - `repeat`: 가로·세로 모두 반복 (기본값)
    - `repeat-x`: 가로만 반복
    - `repeat-y`: 세로만 반복
    - `no-repeat`: 반복 없이 한 번만 그림
    - `space`, `round`: 공간에 맞춰 간격 조절
  - 예시
    ```css
    background-image: url('pattern.png');
    background-repeat: repeat-x;
    ```

- background-position

  - 배경 이미지의 시작 위치(기준 위치)를 지정하는 속성
  - 예시
    - `left`, `center`, `right`
    - `top`, `center`, `bottom`
    - 조합해서 사용할 수 있음
      - `background-position: center center;`
      - `right bottom;`
  - 길이/퍼센트도 가능
    - `background-position: 10px 20px;`
    - `background-position: 50% 50%;` (정가운데)
  - 예시
    ```css
    background-image: url('photo.jpg');
    background-position: center center;
    ```

- background-size

  - 배경 이미지를 얼마나 크게/작게 표시할지 결정하는 속성
  - 주요 값
    - `auto`: 원본 크기(비율 유지, 기본값)
    - `cover`: 요소를 가득 채우도록 확대/축소 (잘려도 됨)
    - `contain`: 이미지 전체가 다 보이도록 맞춤 (빈 여백 생길 수 있음)
    - 직접 숫자로 값 지정할 수 있음
      - `background-size: 100px 50px;`
      - `background-size: 50% auto;`
  - 예시

  ```css
  background-image: url('hero.jpg');
  background-size: cover;
  ```

- 축약형
  **자주 쓰는 `background` 축약형 패턴**
  1. 색 + 이미지 + 반복
  ```css
  background: #f0f0f0 url('bg.png') repeat;
  ```
  2. 색 + 이미지 + 위치 + 반복
  ```css
  background: #fff url('bg.png') no-repeat center top;
  ```
  3. 화면 꽉 채우기
  ```css
  background: url('hero.jpg') no-repeat center center / cover;
  ```
  4. 스크롤해도 고정
  ```css
  background: url('bg.jpg') no-repeat center / cover fixed;
  ```

### transform

- translate
  - 요소를 x, y 방향으로 평행 이동시키는 속성
  - `transform: translate(10px, 20px);` → 오른쪽 10px, 아래로 20px 이동
- scale
  - 요소를 확대/축소하는 속성
  - `transform: scale(2, 0.5);` → 가로 2배, 세로 0.5배
- rotate
  - 요소를 회전시키는 속성
  - `transform: rotate(45deg);` → 중심 기준 45도 회전
- skew
  - 요소를 기울이기(비스듬하게 변형)
  - `transform: skew(20deg, 10deg);` → x축 기준 20도, y축 기준 10도 기울임
- matrix
  - 2D 변형을 한 번에 표현하는 행렬 형태
  - `matrix(a, b, c, d, e, f)` = scale, skew, translate를 조합한 고급 형태

### transition

- transition-property
  - 어떤 CSS 속성이 애니메이션될지 지정하는 속성 (`opacity`, `transform` 등)
- transition-duration
  - 애니메이션이 진행되는 전체 시간, 얼마 동안 변경될지 초/밀리초로 지정하는 속성 (`0.3s`, `200ms` 등)
- transition-timing-function
  - 변화 속도의 곡선을 정해서 느리게 시작·빠르게 끝나는 등 움직임의 느낌을 조절하는 속성 (`ease`, `linear`, `ease-in-out`, `cubic-bezier` 등)
- transition-delay
  - 상태가 바뀐 후 실제 애니메이션이 시작되기까지 기다리는 시간을 정하는 속성 (`0.5s` 후에 시작 등)
- transition-behavior
  - 사용자가 설정한 트랜지션이 어떤 상황에서 유지될지 제어하는 속성으로, 현재는 대부분의 브라우저에서 지원이 제한적이어서 실무에선 거의 쓰이지 않는 속성

### animation

- animation-name
  - `@keyframes`에서 정의한 애니메이션 이름을 지정하는 속성
- animation-duration
  - 애니메이션 한 번이 진행되는 시간
- animation-delay
  - 실행이 시작되기까지 기다리는 시간
- animation-direction
  - 반복될 때 진행 방향을 바꾸는 방법 (`normal`, `reverse`, `alternate` 등)
- animation-iteration-count
  - 몇 번 반복할지 횟수 또는 `infinite`
- animation-play-state
  - 애니메이션을 재생할지 멈출지 상태로 제어 (`running`, `paused`)
- animation-timing-function
  - 진행 속도 변화를 주는 곡선 (`ease`, `linear` 등)
- animation-fill-mode
  - 애니메이션 시작 전/끝 후에 어떤 스타일을 유지할지 결정 (`forwards`, `backwards`, `both` 등)
- @keyframes
  - 애니메이션의 단계와 중간 상태를 정의하는 규칙으로 보통 `from/to` 또는 `0%/100%` 같은 비율을 사용
- 축약형
  - `animation` 하나로 여러 속성을 한 번에 적는 방법이며 보통 `animation: 이름 지속시간 타이밍함수 지연 반복 재생방향 fill-mode` 순서 조합으로 작성 가능

### CSS 방법론 BEM

- BEM(Block, Element, Modifier)

```css
/* BEM 구조 */
.block {
}
.block__element {
}
.block--modifier {
}
.block__element--modifier {
}
```

- 사용해야 하는 이유
  - 클래스 이름 충돌 → 네임스페이스로 완전히 분리
  - 스타일 덮어쓰기 → 독립적인 블록으로 격리
  - 코드 이해 어려움 → 명확한 관계 표현
  - 재사용 불가능 → 컴포넌트 단위 설계
- Block: 독립적인 컴포넌트
  - 페이지 어디에든 재사용할 수 있는 기능적 단위
  - 특징
    1. **독립성**: 다른 블록에 의존하지 않음
    2. **재사용성**: 어디서든 사용 가능
    3. **이동 가능**: 위치가 바뀌어도 동작
    4. **중첩 가능**: 블록 안에 다른 블록 포함 가능
  ```css
  /* ✅ 좋은 예: 명확한 의미 */
  .header {
  }
  .menu {
  }
  .search-form {
  }
  .user-profile {
  }

  /* ❌ 나쁜 예: 모호하거나 일반적인 이름 */
  .content {
  } /* 너무 일반적 */
  .big-block {
  } /* 스타일 기반 이름 */
  .block1 {
  } /* 의미 없는 이름 */
  ```
- Element: Block의 구성 요소
  - Block 안에서만 의미를 가짐 즉, 독립적으로 사용될 수 없음
  - Block과 Element는 \_\_(더블 언더스코어)로 연결함
  ```css
  /* 절대 이렇게 사용하지 마세요! */
  .card__header__title {
  } /* ❌ Element의 Element */

  /* 대신 이렇게 사용하세요 */
  .card__header {
  }
  .card__title {
  } /* ✅ 모두 card의 직접적인 Element */
  ```
- Modifier: 상태와 테마 변형
  - Block이나 Element의 모양, 상태, 동작을 변경함
  - —(더블 대시)로 연결함
- Modifier 재사용 패턴
  - BEM의 핵심은 기본 스타일을 유지하면서 Modifier로 변형하는 것임
  - 기본 블록의 스타일을 상속 받아 특정 속성만 변경하여 다양한 변형을 만듦
  - 코드 중복을 줄이고 일관성 있는 디자인 시스템을 구축할 수 있음
