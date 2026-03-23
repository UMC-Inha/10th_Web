- 기타 태그 추가 정리해보기 🍠
    **추가적인 폼 관련 태그들:**

    - `<label>` : input 요소에 이름을 붙혀줌
    - `<fieldset>` : 폼 요소를 그룹화
    - `<legend>` : fieldset 요소에 제목을 붙혀줌

    **추가적인 텍스트 관련 태그들:**

    - `<span>` :텍스트의 특정 부분만 지정하는 인라인 태그
    - `<a>` :특정한 경로로 이동시켜주는 하이퍼 링크 태그
    - `<p>` : 단락 태그로 텍스트를 표시해줌
    - `<br>` : 줄 바꿈 태그
    - `<h1~h6>` : 제목 태그(숫자가 커질수록 텍스트의 크기와 중요도가 줄어듦)
    - `textarea` : 여러 줄의 긴 텍스트 입력 창

    리스트 관련 태그들:

    - `<ul>` : 순서가 없는 리스트
    - `<ol>` : 순서가 있는 리스트
    - `<li>` : 리스트의 각 항목

    표(테이블) 관련 태그들:

    - `<table>` : 표를 나타내는 최상위 태그
    - `<caption>` : 표 자체의 제목 혹은 설명
    - `<thead>` : 표의 제목 행 그룹
    - `<tbody>` : 표의 본문 그룹
    - `<tfoot>` : 표의 하단 영역 그룹
    - `<tr>` : 표의 한 행
    - `<th>` : 표의 열이나 행의 제목(텍스트가 굵고 중앙 정렬됨)
    - `<td>` : 표에 들어가는 데이터

- border vs outline의 차이점 🍠

    `border` : border는 박스 요소에 포함되는 테두리로서 공간을 점유하여 레이아웃에 영향을 주며 상, 하, 좌, 우 를 개별 설정이 가능합니다.
    
    `outline` : border와는 다르게 테두리 바로 밖에 그려지는 선으로서 레이아웃에 영향을 주지 못하며 개별 설정이 불가능 합니다.

- 아래 반응형 background 관련 키워드를 정리해보세요 🍠
    - background-image
        
        요소의 배경에 이미지를 넣을 때 사용하는 속성 
        - `background-image: url("images/UMC.png");` 처럼 url을 통해 이미지 경로를 지정하여 사용합니다.

    - background-repeat

        배경을 반복할지 결정하는 속성
        - `background-repeat: repeat;` (기본값) 이미지가 타일처럼 가로 세로 모두 반복됩니다.
        - `background-repeat: no-repeat;` 반복 없이 이미지를 하나만 표시합니다.
        - `background-repeat: repeat-x;` 가로 방향으로만 반복해서 보여줍니다.
        - `background-repeat: repeat-y;`  세로 방향으로만 반복해서 보여줍니다.

    - background-position
        
        이미지의 시작 위치를 지정합니다.
        - `background-position: top;` 이미지 상단을 요소 상단에 배치
        - `background-position: bottom;` 이미지 하단을 요소 하단에 배치
        - `background-position: left;`  이미지 좌측을 요소 좌측에 배치
        - `background-position: right;` 이미지 우측을 요소 우측에 배치
        - `background-position: center;` 이미지를 요소 중앙에 배치

    - background-size
        
        이미지가 요소를 어떻게 채울지 지정합니다.
        - `background-size: contain;` 이미지가 잘리지 않게 크기를 조절하여 요소에 맞춥니다
        - `background-size: cover;` 이미지가 잘리더라도 비율을 유지하며 요소의 영역을 모두 채우도록 크기를 조절 합니다

        해당 키워드를 제외하더라도 px단위로 크기를 지정하거나 %로 요소의 크기 비율을 토대로 이미지의 크기를 조절 할 수 있습니다
        - `background-size: 200px 100px;` 가로 200px 세로 100px
        - `background-size: 50% 50%;` 요소의 가로 크기의 50% 세로 크기의 50%

    - 축약형
        - `background: color image repeat position / size;`
        
        일반적으로 해당 순서로 사용하며 필수가 아닌 속성은 생략이 가능합니다.
        
        이때 position과 size는 둘다 px를 사용할 수 있기에 이 둘을 구분 하기 위해 
        position을 작성하고 / 이후 size를 명시하도록 약속을 하였기에 
        
        size를 사용하기 위해선 앞에 position 과 / 가 필수입니다

- transform 🍠
    - translate
        
        요소를 현재 위치를 기준으로 x축(가로)이나 y축(세로)으로 이동시킬때 사용합니다
        
        **`transform: translate(x축,y축);`** 으로 사용합니다.

    - scale
        
        요소의 크기를 해당 비율만큼 조절합니다.
        
        **`transform: scale(비율);`** 으로 사용합니다.

    - rotate
        
        요소를 특정 각도만큼 회전 시킵니다.
        
        **`transform: rotate(각도);`** 으로 사용합니다.

    - skew
        
        요소를 비틀 때(기울일 때) 사용합니다.
        
        **`transform: skew(x축 각도, y축 각도);`  :** 가로와 세로를 동시에 기울입니다.
        **`transform: skewX(각도);`  :**  가로 방향으로 기울입니다.
        **`transform: skewY(각도);`  :**  세로 방향으로 기울입니다.
        
    - matrix
        
        6개의 인자를 받아 변형 속성(**이동, 확대, 회전, 비틀기**)을 하나로 표현한 속성
        `transform: matrix(a, b, c, d, e, f);` 
        
        - `a = scaleX` : 가로 크기 조절
        - `b = skewY`  : 세로 기울기
        - `c = skewX`  : 가로 기울기
        - `d = scaleY`  : 세로 크기 조절
        - `e = translateX`  : 가로 이동
        - `f = translateY`  : 세로 이동
        
        matrix는 수학 행렬이기에 Number 만 인수로 받음
        
        → 기울기는 tan (값), px는 생략, 비율은 % 대신 1.2, 0.3 형태

- transition 🍠
    - transition-property
        
        어떤 속성에 애니메이션을 줄 것인가 지정합니다.
        
        `transition-property: 속성값(ex:background-color);`
        
    - transition-duration
        
        애니메이션이 완료될 때까지의 시간을 지정합니다.(초, ms단위)
        
        `transition-duration: 시간(ex:10s, 100ms);`
        
    - transition-timing-function
        
        애니메이션이 진행되는 속도의 가속도를 조절합니다
        
        `transition-timing-function: ease;` : (기본값) 약간 느리게 시작하여 중간은 빠르게 끝 다시 느리게 진행됩니다
        
        `transition-timing-function: linear;`: 일정한 속도로 진행됩니다
        
        `transition-timing-function: ease-in;`: 느리게 시작하여 점점 가속도가 붙습니다
        
        `transition-timing-function: ease-out;`: 빠르게 시작하여 점점 느려집니다.
        
        `transition-timing-function: ease-in-out;`: **** ease와 비슷하지만 시작과 끝의 속도가 좀 더 느려집니다
        
    - transition-delay
        
        애니메이션이 시작되기 전 대기 시간을 지정합니다
        
        `transition-delay: 시간(ex: 10s, 100ms);` 
        
    - transition-behavior
        
        변하는 중간 단계가 없는 `display: none;`  →  `display: block;`  같은 속성에도 애니메이션을 적용할 수 있게 합니다

- animation 🍠

    - animation-name
        
        미리 만들어둔 대본 `@keyframes` 과 요소를 연결하여 대본에 따라 움직이게 합니다
        
    - animation-duration
        
        애니메이션이 얼마만큼의 시간동안 지속될지 결정합니다
        
        `animation-duration: 시간(ex: 10s, 100ms);`
        
    - animation-delay
        
        애니메이션이 시작되기까지의 지연시간을 결정합니다.
        
        `animation-delay: 시간(ex: 10s, 100ms);`
        
    - animation-direction
        
        애니메이션이 어떤 방향으로 움직일 지 결정합니다.
        
        `animation-direction: normal;` from(0%) 에서 to(100%) 방향으로 재생 하며 한 사이클이 끝나면 다시 처음으로 돌아가서 시작합니다.
        
        `animation-direction: reverse;`**:** 항상 거꾸로 재생합니다. `to(100%)`에서 시작해서 `from(0%)` 방향으로 움직입니다.
        `animation-direction: alternate;`**:**  첫 번째는 정방향(`0%`→`100%`), 두 번째는 역방향(`100%`→`0%`)으로 번갈아가며 재생합니다
        `animation-direction: alternate-reverse`**:** `alternate` 반대로 역방향(`100%`→`0%`)으로 시작해서 번갈아 재생합니다.
        
    - animation-iteration-count
        
        애니메이션의 반복 횟수를 결정합니다.
        
        `animation-iteration-count: 횟수(ex: 1, infinite);`
        
    - animation-play-state
        
        애니메이션을 잠시 멈추거나 다시 재생할 때 사용합니다.
        
        `animation-play-state: running;` : (기본값) 정상적으로 재생됩니다.
        
        `animation-play-state: paused;` : 애니메이션이 일시정지됩니다.
        
    - animation-timing-function
        
        `@keyframes` 애니메이션이 진행되는 속도의 가속도를 조절합니다
        
        `animation-timing-function: ease;` : (기본값) 약간 느리게 시작하여 중간은 빠르게 끝 다시 느리게 진행됩니다
        
        `animation-timing-function: linear;`: 일정한 속도로 진행됩니다
        
        `animation-timing-function: ease-in;`: 느리게 시작하여 점점 가속도가 붙습니다
        
        `animation-timing-function: ease-out;`: 빠르게 시작하여 점점 느려집니다.
        
        `animation-timing-function: ease-in-out;`: **** ease와 비슷하지만 시작과 끝의 속도가 좀 더 느려집니다.
        
    - animation-fill-mode
        
        애니메이션이 실행되기 전이나 끝난 후의 스타일의 유지 방식을 지정합니다.
        
        `animation-fill-mode: none;` : (기본값) 애니메이션이 끝나면 애니메이션 시작 전 스타일로 돌아갑니다.
        
        `animation-fill-mode: forwards;`: 애니메이션이 끝난 지점의 스타일을 그대로 유지합니다. (마지막 장면에서 멈춤)
        
        `animation-fill-mode: backwards;`: 시작 전 대기 시간 동안 애니메이션의 첫 번째 프레임(0%)을 미리 적용하고 대기합니다.
        
        `animation-fill-mode: both;`: `forwards`와 `backwards`를 모두 적용합니다. 대기할 때는 첫 프레임 스타일로, 끝난 후에는 마지막 프레임 스타일로 유지합니다.
        
    - @keyframes
        
        애니메이션의 시간별 대본을 작성합니다.
        
        ```css
        @keyframes 애니메이션이름 {
            0% { /* 시작 시점 스타일 **/ }
            50% { /** 중간 지점 스타일 **/ }
            100% { /** 종료 시점 스타일 */ }
        }
        ```
        
        `from`: `0%`와 같습니다.
        
        `to`: `100%`와 같습니다.
        
        % 단위: 필요한 만큼 쪼갤 수 있습니다. (예: `25%`, `33%`, `70%` 등)
        
    - 축약형
        
        가장 권장되는 표준 순서 
        
        `animation: name duration timing-function delay iteration-count direction fill-mode play-state`
        
        순서가 엄격하진 않지만 시간을 나타내는 두 값(duration, delay)의 순서는 반드시 지켜야 합니다.
        
        필수로 `name`  과  `duration (0초 이상)` 은 포함 해야 하며 생략된 값은 기본값으로 지정됩니다.

- CSS 방법론 BEM 🍠
    BEM란 Block, Element, Modifier로 구성되어있으며

    ## 1. Block (블록)

    - 정의: 독립적으로 존재할 수 있는 요소 (예: `header`, `menu`, `card`).
    - 특징: 독립적으로 기능을 할 수 있는 요소이며 해당 요소의 이름은 목적(무엇인가)을 나타내야 합니다.
    - 예시: `.card { ... }`

    ## 2. Element (요소)

    - 정의: 블록을 구성하는 부분으로, 블록 의존적입니다 (예: 카드의 제목, 메뉴의 아이템).
    - 규칙: 블록 이름 뒤에 **더블 언더스코어(`__`)**를 붙입니다.
    - 예시: `.card__title { ... }`, `.card__button { ... }`

    ## 3. Modifier (수정자)

    - 정의: 블록이나 요소의 외형, 상태, 동작을 정의합니다 (예: 강조된 카드, 비활성화된 버튼).
    - 규칙: 이름 뒤에 **더블 대시(`-`)**를 붙입니다.
    - 예시: `.card--featured { ... }`, `.card__button--primary { ... }`

    로 정리할 수 있습니다. 여기서 `.card__header__title` 같이 계층을 다 표현하는 것이 아닌

    `card__title` 처럼 평면적 구조를 유지해야합니다