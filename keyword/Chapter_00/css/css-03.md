# 아래 반응형 background 관련 키워드를 정리해보세요 🍠
## 반응형 background
### background-image
요소의 배경으로 어떤 이미지를 넣을 건지 정하는 속성
```
background-image: url("image.png");
```
- 예시
    ```
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

### 축약형 `background`
위의 속성들을 한 줄로 줄여서 쓰는 방법

```
background: 이미지 repeat 위치 / 크기;
```

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
회전 크기 조절, 기울이기, 이동 효과를 부여
### transform
```
transform: 함수명(값);
```
- 예시
    ```
    transform: translateX(50px);
    transform: scale(1.2);
    transform: rotate(45deg);
    ```
    아래와 같이 바꿔서 쓸 수도 있음
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
    - `-45deg` : 반시계 방향 회전

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
### transition-timing-function
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
``` transition: 속성명 지속시간 타이밍함수 지연시간; ```
- 예시
    ``` 
    .box {
        transition-property: background-color;
        transition-duration: 0.8s;
        transition-timing-function: ease;
        transition-delay: 0s;
    }
    ```
    아래와 같이 바꿔서 쓸 수 있음
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
### animation-timing-function
애니메이션이 어떤 속도로 진행될지 정하는 속성

- 자주 쓰는 값
    - ease
    - linear
    - ease-in
    - ease-out
    - ease-in-out
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

### @keyframes
애니메이션의 중간 단계와 시작/끝 상태를 정의하는 문법
- 예시
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
    퍼센트로도 작성 가능
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
### 축약형
``` animation: 이름 지속시간 타이밍함수 지연시간 반복횟수 방향 채우기모드 재생상태; ```

- 예시
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
    아래와 같이 바꿔서 쓸 수 있음
    ```
    .box {
        animation: move 2s ease 0s infinite alternate;
    }
    ```