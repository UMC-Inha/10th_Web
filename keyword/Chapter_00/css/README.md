## content-box와 border-box가 다르게 동작하는 상황
### content-box

 `weight`, `height` 가 내용 크기만을 뜻함

### border-box

`weight`, `height` 가 내용 + padding + border까지 포함된 전체 크기를 뜻함  

- padding, border이 추가되면 지정한 weight, height 안에 넣고, content이 줄어듦




## border vs outline
### border
박스 모델에 포함되는 진짜 테두리  
border는 박스의 일부

- 구성 속성
    - `border-width` : 테두리의 두께
        - 예시
            
            thin, medium, thick
            
    - `border-style` : 테두리의 스타일
        - 예시
            
            none, hidden, dotted, dashed, solid, double, groove, ridge, inset, outset (기본값: none)
            
    - `border-color` : 테두리의 색상
    - `border-radius` : 둥근 모서리
        
        `border-top`, `border-bottom`처럼 한쪽 면에만 적용 가능

### outline

박스 바깥에 그려지는 가짜 테두리 (강조선)  
outline은 박스의 일부가 아님

- 구성 속성
    - `outline-width` : 테두리의 두께
    - `outline-width` : 테두리의 스타일
        - 예시
            
            none, hidden, dotted, dashed, solid, double, groove, ridge, inset, outset (기본값: none)
            
    - `outline-color` : 테두리의 색상
    - `outline-offset` : 요소로부터 얼마나 떨어진 위치에 외곽선을 그릴 것인지 지정

### border과 outline의 차이점

- 현재 요소의 레이아웃에 대한 영향
    - border은 CSS 박스 모델의 일부로 크기와 위치가 현재 요소의 레이아웃 크기 및 정렬에 영향을 줌
    - outline은 CSS 박스 모델의 일부가 아니기에 현재 요소의 레이아웃 크기 및 정렬에 영향을 주지 않음
- 모양과 위치
    - border은 각 요소의 측면에 개별 스타일링을 적용할 수 있음
    - outline은 직사각형 형태로 개별 스타일을 바꿀 수 없음
- 사용 사례
    - border는 카드 레이아웃, 이미지 등에서 각 요소를 시각적으로 구분하기 위해 사용
    - outline은 input 등 현재 요소가 활성화되어 있는 상태를 시각적으로 표시하기 위해 사용


## 다양한 정렬 방식
### text-align
요소 안에 들어있는 텍스트나 inline 요소를 가로 정렬

```css
.box {
	text-align: center;
}
```

- 특징
    - 텍스트 정렬할 때 사용
    - `span`, `a` 글자 같은 inline 요소에도 영향을 줌
    - 요소 자기 자신을 가운데로 보내는 건 아님

### margin
block 요소 자기 자신을 가로 가운데 정렬 

```css
.box {
	width: 200px;
	margin: 0 auto;
}
```

- 특징
    - block 요소를 정렬할 때 사용
    - 요소 자기 자신을 가운데로 보냄

### flex
부모에 주는 속성, 부모 안에 있는 자식 요소들을 정렬

```css
.container {
	display: flex;
	justify-content: center;
	align-items: center;
}
```

- 특징
    - 자식 요소를 정렬할 때 사용
    - 가로, 세로 둘 다 가운데 정렬 가능

### translate
정렬 속성이라기보단 위치 이동

```css
.box {
	position: relative;
	left: 50%
	transform: translateX(-50%)
}	
```

`left: 50%` : 부모 기준으로 왼쪽에서 50% 지점까지 이동

`translateX(-50%)` : 자기 자신의 너비 절반만큼 다시 왼쪽으로 이동

- 특징
    - 위치 계산으로 가운데 맞추는 방식
    - 일반적인 정렬보다는 위치 보정에 가까움

### grid
부모에 주는 속성, 자식 요소를 행, 열 기준으로 배치함

```css
.container {
	display: grid;
}
```

- `place-items: center;`
    
    각 grid item을 자기 셀 안에서 정렬
    
    ```css
    .container {
    	display: grid;
    	place-items: center;
    }
    ```
    
- `justify-content: center; align-content: center;`
    
    grid 전체 묶음을 부모 안에서 가운데 정렬
    
    ```css
    .container {
    	display: grid;
    	justify-content: center;
    	align-contenr: center;
    }
    ```
    
- 특징
    - 2차원 레이아웃에 강함
    - 행, 열을 같이 다루기 좋음
    - `flex`보다 구조적인 배치에 어려움

### 정리
- `text-align` → 글자 정렬
- `margin 0 auto` → block 요소 가운데
- `flex` → 자식 요소들 가로/세로 정렬
- `translate` → 이동으로 위치 맞춤
- `grid` → 행/열 기반 정렬

## 다양한 background 방식
### background-image
요소의 배경으로 어떤 이미지를 넣을 건지 정하는 속성

```css
background-image: url("image.png")
```

```css
.box {
    width: 300px;
    height: 200px;
    background-image: url("cat.jpg");
}
```

### background-repeat
    
배경 이미지가 반복될지 말지 정하는 속성  
배경 이미지는 기본적으로 공간이 남으면 자동으로 반복됨

- 자주 쓰는 값
    - `repeat` : 가로 세로 반복
    - `repeat-x` : 가로로만 반복
    - `repeat-y` : 세로로만 반복
    - `no-repeat` : 반복 안 함
- 예시
    
    ```
    .box {
    width: 400px;
    height: 200px;
    background-image: url("pattern.png");
    background-repeat: repeat-x;
    }
    ```

### background-position
배경 이미지의 위치를 정하는 속성

- 자주 쓰는 값
    - `left`
    - `right`
    - `center`
    - `top`
    - `bottom`
- 예시
    
    ```
    .box {
    width: 400px;
    height: 200px;
    background-image: url("cat.jpg");
    background-repeat: no-repeat;
    background-position: center;
    }
    ```
    
    ```
        background-position: right bottom;
        background-position: 20px 50px;
        background-position: 50% 50%;
        ```
    ```

### background-size
배경 이미지의 크기를 정하는 속성

- 자주 쓰는 값
    - `cover`
    요소를 꽉 채우도록 이미지를 키움
    비율은 유지
    따라서 이미지가 일부 잘릴 수 있음
        
        ```
        background-size: cover;
        ```
        
    - `contain`
    이미지가 전부 보이도록 맞춤
    비율은 유지
    대신 빈 공간이 생길 수 있음
        
        ```
        background-size: contain;
        ```
        
- 예시
    
    ```
    .box {
    width: 400px;
    height: 200px;
    background-image: url("cat.jpg");
    background-size: 100px 100px;
    }
    ```

### 축약형
```background: 이미지 repeat 위치 / 크기;```
- 예시
    
    ```
    .box {
    background-image: url("cat.jpg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    }
    ```
    
    아래와 같이 바꿔서 쓸 수 있음
    
    ```
    .box {
    background: url("cat.jpg") no-repeat center / cover;
    }
    ```



## transform
CSS transform 속성으로, 요소에 회전 크기 조절, 기울이기, 이동 효과를 부여할 수 있음

```transform: 함수명(값);```

- 예시
아래와 같이 바꿔서 쓸 수도 있음
    
    ```
    transform: translateX(50px);
    transform: scale(1.2);
    transform: rotate(45deg);
    ```
    
    ```
    transform: translateX(50px) rotate(45deg) scale(1.2);
    ```

### translate
요소를 현재 위치 기준으로 이동시키는 것

- 예시
    
    ```
    transform: translate(50px, 20px);
    transform: translateX(50px);
    transform: translateY(20px);
    ```
    
    - `translate(50px, 20px)`
    x축으로 50px, y축으로 20px 이동
    - `translateX(50px)`
    오른쪽으로 50px
    - `translateY(20px)`
    아래로 20px

### scale
요소의 크기를 확대/축소 하는 것

- 자주 쓰는 값
    
    ```
    transform: scale(1.5);
    transform: scale(0.8);
    transform: scale(1.2, 0.8);
    transform: scaleX(1.5);
    transform: scaleY(0.5);
    ```
    
    - scale(1) → 원래 크기
    - scale(1.5) → 1.5배 확대
    - scale(0.8) → 0.8배 축소
    - scale(1.2, 0.8) → 가로 1.2배, 세로 0.8배
- 예시
    
    ```
    .box {
    transform: scale(1.5);
    }
    ```

### rotate
요소를 회전시키는 것

- 자주 쓰는 값
    
    ```
    transform: rotate(45deg);
    transform: rotate(-45deg);
    ```
    
    - `45deg` : 시계 방향 회전
    - `45deg` : 반시계 방향 회전
- 예시
    
    ```
    .box {
    transform: rotate(45deg);
    }
    ```

### skew
요소를 기울이는 것

- 자주 쓰는 값
    
    ```
    transform: skew(20deg, 10deg);
    transform: skewX(20deg);
    transform: skewY(10deg);
    ```
    
    - `skewX(20deg)` : 가로 방향으로 기울임
    - `skewY(10deg)` : 세로 방향으로 기울임
- 예시
    
    ```
    .box {
    transform: skewX(20deg);
    }
    ```

### matrix
위의 속성들을 한 줄로 줄여서 쓰는 방법

```
transform: matrix(a, b, c, d, tx, ty);
```

- a, d : scale
- b, c : skew, rotate
- tx, ty : translate


## transition
상태가 바뀔 때 바로 바뀌지 않고, 일정 시간 동안 부드럽게 변하도록 만드는 속성
### transition-property
어떤 속성에 transition 효과를 적용할지 적용하는 속성

- 자주 쓰는 값
    - `all` : 모든 속성
    - `background-color`
    - `transform`
    - `width`
    - `opacity`
- 예시
    
    ```
    .box {
    transition-property: background-color;
    }
    ```
    
### transition-duration
변화가 얼마 동안 일어날지 정하는 속성

- 자주 쓰는 값
    - 0.3s
    - 0.5s
    - 1s
- 예시
    
    ```
    .box {
    transition-duration: 0.8s;
    }
    ```

### trantition-timing-function
변화가 어떤 속도로 진행될지 정하는 속성

- 자주 쓰는 값
    - ease : 처음과 끝이 부드러움
    - linear : 일정한 속도
    - ease-in : 처음 천천히, 뒤로 갈수록 빨라짐
    - ease-out : 처음 빠르게, 끝으로 갈수록 천천히
    - ease-in-out : 처음과 끝이 천천히
- 예시
    
    ```
    .box {
    transition-timing-function: ease;
    }
    ```

### transition-delay
transition이 바로 시작하지 않고, 얼마 뒤에 시작할지 정하는 속성

- 예시
    
    ```
    .box {
        transition-delay: 0.5s;
    }
    ```

### transition-behavior
일부 불연속(discrete) 속성도 transition처럼 처리할지 정하는 속성

이건 비교적 최근 개념이고, 실무에서는 자주 쓰이지 않음

- 자주 쓰는 값
    - normal
    - allow-distance
- 예시
    
    ```
    .box {
        transition-behavior: allow-discrete;
    }
    ```

### 축약형
```transition: 속성명 지속시간 타이밍함수 지연시간;```

- 예시
아래와 같이 바꿔서 쓸 수 있음
    
    ```
    .box {
        transition-property: background-color;
        transition-duration: 0.8s;
        transition-timing-function: ease;
        transition-delay: 0s;
    }
    ```
    
    ```
    .box {
        transition: background-color 0.8s ease 0s;
    }
    ```

## animation
transition은 상태 변화가 있을 때만 동작하고,
animation은 자동으로 계속 움직이게 만들 수 있는 속성

- 예
    - 깜빡이기
    - 회전하기
    - 위아래 움직이기

### animation-name
어떤 @keyframes를 사용할지 정하는 속성

- 예
    
    ```
    .box {
        animation-name: move;
    }
    ```
- `@keyframes`
    애니메이션의 중간 단계와 시작/끝 상태를 정의하는 문법

    - 예시
    퍼센트로도 작성 가능
        
        ```
        @keyframes move {
            from {
                transform: translateX(0);
            }
            to {
                transform: translateX(100px);
            }
        }
        ```
        
        ```
        @keyframes move {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translateX(50px);
            }
            100% {
                transform: translateX(100px);
            }
        }
        ```

### animation-duration
한 번의 애니메이션이 얼마 동안 실행될지 정하는 속성

- 예시
    
    ```
    .box {
        animation-duration: 2s;
    }
    ```

### animation-delay
애니메이션이 언제 시작할지 정하는 속성

- 예시
    
    ```
    .box {
        animation-delay: 1s;
    }
    ```

### animation-direction
애니메이션이 어떤 방향으로 진행될지 정하는 속성

- 자주 쓰는 값
    - normal : 처음부터 끝까지 정상 방향
    - reverse : 끝에서 처음으로 반대로
    - alternate : 정방향, 역방향 번갈아 실행
    - alternate-reverse : 역방향, 정방향 번갈아 실행
- 예시
    
    ```
    .box {
        animation-direction: alternate;
    }
    ```

### animation-iteration-count
애니메이션을 몇 번 반복할지 정하는 속성

- 자주 쓰는 값
    - 1
    - 2
    - infinite : 무한 반복
- 예시
    
    ```
    .box {
        animation-iteration-count: infinite;
    }
    ```

### animation-play-state
애니메이션의 재생 상태를 정하는 속성

- 자주 쓰는 값
    - running : 실행 중
    - paused : 일시정지
- 예시
    
    ```
    .box {
        animation-play-state: paused;
    }
    ```

### animation-timing-function
애니메이션이 어떤 속도로 진행될지 정하는 속성

- 자주 쓰는 값
    - ease : 처음엔 조금 느리고, 중간은 빠르고, 끝은 느리게 (기본값)
    - linear : 처음부터 끝까지 같은 속도
    - ease-in : 처음은 느리고 점점 빨라짐
    - ease-out : 처음은 빠르고 끝으로 갈수록 느려짐
    - ease-in-out : 처음은 더 느리고, 중간은 빠르고, 끝은 천천히 멈춤
- 예시
    
    ```
    .box {
        animation-timing-function: linear;
    }
    ```

### animation-fill-mode
애니메이션 시작 전이나 끝난 후에 어떤 스타일을 유지할지 정하는 속성

- 자주 쓰는 값
    - none : 아무 스타일도 유지 안 함
    - forwards : 끝난 뒤 마지막 상태 유지
    - backwards : 시작 전에도 첫 키프레임 상태 적용
    - both : forwards + backwards 둘 다 적용

### 축약형
```animation: 이름 지속시간 타이밍함수 지연시간 반복횟수 방향 채우기모드 재생상태;```

- 예시
아래와 같이 바꿔서 쓸 수 있음
    
    ```
    .box {
        animation-name: move;
        animation-duration: 2s;
        animation-timing-function: ease;
        animation-delay: 0s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }
    ```
    
    ```
    .box {
        animation: move 2s ease 0s infinite alternate;
    }
    ```

## CSS 방법론 BEM
# BEM이란?
Block, Element, Modifier

## 1. Block
독립적으로 의미가 있는 큰 단위  
다른 블록에 의존하지 않고 재사용이 가능하며 위치가 바뀌어도 동작하는 독립 컴포넌트

- 예시
    - `card`
    - `button`
    - `header`
```
<div class="card">
  ...
</div>
```

## 2. Element
Block 안에 들어가는 부품  
반드시 어떤 Block에 속해야 의미를 가짐  
Block과 Element는 `_`로 연결됨  

- 예시
    - `card_image`
    - `card_title`
    - `menu_item`
```
<div class="card">
  <img class="card__image" />
  <h3 class="card__title">상품 이름</h3>
</div>
```

## 3. Modifier
Block이나 Element의 상태, 모양, 변형을 나타내는 것  
활성 메뉴, 에러 상태 input 같이 Modifier는 `--`으로 연결됨  
기본형에 옵션을 붙이는 것

- 예시
    - `button-large`
    - `button-primary`
    - `menu_item--active`

## 주의할 점
1. Element 안에 Element 만들기
```
/* ❌ 잘못된 예 */
.card__header__title {
}

/* ✅ 올바른 예 */
.card__header {
}
.card__title {
}
```

2. Modifier만 단독 사용
```
<!-- ❌ 잘못된 예 -->
<button class="--primary">버튼</button>

<!-- ✅ 올바른 예 -->
<button class="button button--primary">버튼</button>
```

3. 의미 없는 이름 사용
```
/* ❌ 피해야 할 이름 */
.card__div {
}
.card__span {
}
.card__element1 {
}

/* ✅ 의미 있는 이름 */
.card__wrapper {
}
.card__label {
}
.card__content {
}
```

## 장점
- 클래스명만으로 구조 파악이 가능
- 영향 범위가 명확해서 리팩토링이 쉬워짐
- 일관된 규칙으로 누구나 코드 파악 가능
- CSS 충돌 x

## CSS 방법론 BEM
# BEM이란?

Block, Element, Modifier

## 1. Block

독립적으로 의미가 있는 큰 단위

다른 블록에 의존하지 않고 재사용이 가능하며 위치가 바뀌어도 동작하는 독립 컴포넌트

- 예시
    - `card`
    - `button`
    - `header`

```
<div class="card">
  ...
</div>
```

## 2. Element

Block 안에 들어가는 부품

반드시 어떤 Block에 속해야 의미를 가짐

Block과 Element는 `_`로 연결됨

- 예시
    - `card_image`
    - `card_title`
    - `menu_item`

```
<div class="card">
  <img class="card__image" />
  <h3 class="card__title">상품 이름</h3>
</div>
```

## 3. Modifier

Block이나 Element의 상태, 모양, 변형을 나타내는 것

활성 메뉴, 에러 상태 input 같이 Modifier는 `--`으로 연결됨

기본형에 옵션을 붙이는 것

- 예시
    - `button-large`
    - `button-primary`
    - `menu_item--active`

## 주의할 점

1. Element 안에 Element 만들기

```
/* ❌ 잘못된 예 */
.card__header__title {
}

/* ✅ 올바른 예 */
.card__header {
}
.card__title {
}
```

1. Modifier만 단독 사용

```
<!-- ❌ 잘못된 예 -->
<button class="--primary">버튼</button>

<!-- ✅ 올바른 예 -->
<button class="button button--primary">버튼</button>
```

1. 의미 없는 이름 사용

```
/* ❌ 피해야 할 이름 */
.card__div {
}
.card__span {
}
.card__element1 {
}

/* ✅ 의미 있는 이름 */
.card__wrapper {
}
.card__label {
}
.card__content {
}
```

## 장점

- 클래스명만으로 구조 파악이 가능
- 영향 범위가 명확해서 리팩토링이 쉬워짐
- 일관된 규칙으로 누구나 코드 파악 가능
- CSS 충돌 x