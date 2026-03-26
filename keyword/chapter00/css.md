- border vs outline의 차이점 🍠
    
    border은 공간을 차지하고 outline은 공간차지 없이 위로 겹쳐서 그려집니다.
    
    border은 위아래오른쪽왼쪽 각각 두께나 색상을 다르게 마음대로 꾸밀 수 있습니다만 outline은 무조건 사방을 다 둘러싸야만 합니다.


    <!DOCTYPE html>
<html lang="en">

- 고구마 상자 이동 

여러분의 코드를 아래에 첨부하세요 🍠
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .box {
      width: 100px;
      height: 100px;
      background-color: purple;
      color: white;
      box-sizing: border-box;
      position: relative;
      bottom: -150px;
      right: 0px;
    }
  </style>
</head>

<body>
  <div class="box">BOX</div>
  <h1>고구마 상자</h1>
</body>

</html>

- text-align
    
    ```jsx
    <div style="background: #ffeaa7; padding: 20px; text-align: center;">
      <h2>텍스트 중앙 정렬!</h2>
      <p>text-align은 내 안의 글자나 인라인 요소를 정렬합니다.</p>
    </div>
    ```
    
- margin
    
    ```jsx
    <div style="width: 200px; height: 100px; background: #fab1a0; margin: 50px auto;">
      <p style="text-align: center;">위아래 50px 띄우고,<br>가로 중앙 정렬된 박스</p>
    </div>
    ```
    
- flex
    
    ```jsx
    <div style="display: flex; justify-content: space-between; align-items: center; background: #74b9ff; padding: 20px;">
      <div style="background: white; padding: 10px;">아이템 1</div>
      <div style="background: white; padding: 10px;">아이템 2 (양끝 배치)</div>
      <div style="background: white; padding: 10px;">아이템 3</div>
    </div>
    ```
    
- translate
    
    ```jsx
    <div style="background: #55efc4; padding: 20px; width: 200px;">
      <p>원래 위치</p>
    </div>
    <div style="background: #00b894; padding: 20px; width: 200px; transform: translate(50px, -20px);">
      <p>오른쪽 50px, 위로 20px 이동!</p>
    </div>
    ```
    
- grid
    
    ```jsx
    <div style="display: grid; grid-template-columns: 150px 150px 150px; gap: 10px; background: #dfe6e9; padding: 20px;">
      <div style="background: #a29bfe; padding: 20px;">1번 방</div>
      <div style="background: #a29bfe; padding: 20px;">2번 방</div>
      <div style="background: #a29bfe; padding: 20px;">3번 방</div>
      <div style="background: #a29bfe; padding: 20px;">4번 방 (자동 줄바꿈)</div>
      <div style="background: #a29bfe; padding: 20px;">5번 방</div>
    </div>
    ```
    
- 반응형 background 🍠

### 아래 반응형 background 관련 키워드를 정리해보세요 🍠

<aside>
💡

아래 키워드에 대해 정리한 후,  코드와 실행 영상을 남겨주세요!

</aside>

- background-image
    
    요소의 배경으로 들어갈 이미지를 지정합니다.
    
- background-repeat
    
    이미지가 반복될지 말지를 결정합니다.
    
- background-position
    
    이미지의 기준점(어디를 보여줄 것인가)을 정합니다.
    
- background-size
    
    배경 이미지의 크기를 결정합니다.
    
- 축약형
    
    위에서 배운 속성들을 한 줄에 다 몰아서 씁니다. 
    
    작성 순서: `color image reapeat position/size`

### transform 🍠

CSS **`transform`** 속성으로, 요소에 회전 크기 조절, 기울이기, 이동 효과를 부여할 수 있어요.

 `transform`은 CSS [시각적 서식 모델](https://developer.mozilla.org/en-US/docs/Web/CSS/Visual_formatting_model)의 좌표 공간을 변경해요.

<aside>
💡 아래 키워드에 대해 정리한 후, 코드와 실행 영상을 남겨주세요!

</aside>

- translate
    
    요소를 현재 위치에서 X축(가로) 또는 Y축(세로)으로 이동시킵니다.
    
- scale
    
    요소를 배수로 확대 또는 축소합니다.
    
- rotate
    
    요소를 주어진 각도만큼 회전시킵니다.
    
- skew
    
    요소를 X축 또는 Y축 방향으로 비틀어서 평행사변형 모양으로 만듭니다.
    
- matrix
    
    위에서 배운 이동, 크기, 회전, 기울이기 효과를 하나의 수학적 행렬로 합쳐서 표현합니다.
    
    사용법: `matrix(a, b, c, d, e, f)`

- transition 🍠
    
    ### transition  🍠
    
    <aside>
    💡 아래 키워드에 대해 정리한 후, 실습을 진행해주시고, 코드와 실행 영상을 남겨주세요!
    
    </aside>
    
    - transition-property
        
        어떤 CSS 속성에 스르륵 변하는 효과를 줄지 콕 집어서 정합니다.
        
    - transition-duration
        
        변화가 시작해서 끝날 때까지 걸리는 **시간**을 정합니다.
        
    - transition-timing-function
        
        애니메이션의 속도를 정합니다. 처음엔 느렸다가 빨라질지, 일정한 속도로 갈지 결정합니다.
        
    - transition-delay
        
        변화를 주라는 명령이 떨어졌을 때, 얼마나 뜸을 들인 후에 애니메이션을 시작할지 대기 시간을 정합니다.
        
    - transition-behavior
        
        원래 CSS에서는 `display: none`에서 `display: block`으로 변할 때 중간 과정 없이 '짠!' 하고 나타나기 때문에 `transition`이 안 먹힙니다. 하지만 이 속성을 쓰면 그런 불연속적인 속성도 부드럽게 전환되도록 도와줍니다.


### animation 🍠

<aside>
💡 아래 키워드에 대해 학습한 후, 실습을 진행하시고 코드와 실행 영상을 남겨주세요!

</aside>

- animation-name
    
    어떤 대본(`@keyframes` 이름)을 가져와서 연기할지 지정합니다.
    
- animation-duration
    
    애니메이션 1회가 재생되는 시간
    
- animation-delay
    
    시작하기 전 대기 시간
    
- animation-direction
    
    재생 방향
    
- animation-iteration-count
    
    반복 횟수
    
- animation-play-state
    
    현재 재생 상태
    
- animation-timing-function
    
    속도감
    
- animation-fill-mode
    
    애니메이션이 끝난 후의 상태 유지
    
- @keyframes
    
    애니메이션의 시작부터 끝까지 어떤 장면을 연출할지 프레임을 만듭니다.
    
- 축약형
    
    작성 예시: `animation: my-move 2s ease-in-out 1s infinite alternate;` 
    
    시간 값이 2개 들어가면 첫번째가 `duration` 두번째가 `delay`


    