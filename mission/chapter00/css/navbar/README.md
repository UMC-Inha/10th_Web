## 반응형을 구현하며 알게 된 개념
1. 반응형 디자인이란 단순히 요소 크기만 줄이는 것이 아니라 레이아웃 구조 자체를 화면 크기에 맞게 바꾸는 것이고,  

2. 화면이 작아질 수록 우선순위에 따라 높은 것부터 보여주는 식으로 설계해야 함

### 선택자 스타일링
직계 자식을 선택할 때에는 `>`를 사용할 수 있음
```.nav-right > .text-grey```
`nav-right` 바로 아래에 있는 `text-grey`만 선택

## 사용한 CSS 속성
### @media
화면 크기에 따라 다른 스타일링을 적용하는 반응형 문법

```
@media (max-width: 768px) {
  .nav-right > .text-grey,
  .nav-right > .text-orange {
    display: none;
  }
}
```

### display: none
화면이 작아졌을 때 메뉴를 숨기기 위해
```
.text-grey {
  display: none;
}
```

### flex
네브바 내부 요소를 가로 정렬할 때
```
nav {
    display: flex;
}
```

### justify-content
flex 내부 요소의 주축 정렬 방식
```
justify-content: space-between;
justify-content: center;
```
- space-between : 양쪽 끝으로 벌려 배치
- center : 가운데 정렬


### align-items
flex 내부 요소의 교차축 정렬 방식
```
align-items: center;
```

### gap
flex, grid 내부 요소 사이의 간격을 설정할 때
```
gap: 20px;
gap: 10px;
```

### width
요소의 너비를 설정할 때
```
width: 100%;
width: 200px;
```

### margin
요소 바깥쪽 여백을 설정할 때
```
margin: 30px;
```

### padding
요소 안 쪽의 여백을 줄 때
```
padding: 10px;
padding: 10px 20px;
```

### border 
네브바 버튼의 테두리를 설정할 때 (두께, 선 종류, 색상을 한 번에 설정할 수 있음)
```
border: 3px solid black;
```

### border-radius
네브바 버튼의 테두리 모서리를 둥글게 설정할 때
```
border-radius: 30px;
```

### box-shadow
그림자를 줄 떄

### background-color
배경색을 지정할 때 
```
background-color: #fcf7f7;
background-color: white;
```

### font-size, color
텍스트의 크기, 색상을 조절할 때
```
font-size: 35px;
color: #ffffff
```

### white-space: nowrap
텍스트가 줄바꿈되지 않도록 하기 위해
- 공백 여러 개 -> 한 칸으로 처리
- 자동 줄바꿈 -> 안 함

```
white-space: nowrap;
```
- 기본값은 `normal`
    - 공백 여러 개 -> 한 칸으로 처리
    - 엔터 -> 무시
    - 글자가 길면 -> 자동 줄바꿈


### flex-shrink: 0
화면이 줄어들 때 요소 모양을 유지하기 위해

## :focus
버튼이 선택된 상태일 때의 스타일링을 지정하기 위해
```
button:focus {
    background-color: #fc552f;
    color: white;
}
```

