# HTML

### div로만 페이지를 구조화하는 게 좋을까?

- 과거에는 class, id 속성을 부여해 각 영역의 역할을 대신 지정함
- 하지만 이렇게 하면 몇 가지 문제가 있음

  1. 헤더, 푸터 등 구분하기 어려움
  2. 검색엔진이 웹사이트를 파악하기 어려움
  3. 스크린 리더가 내용을 제대로 읽기 어려움

### 시맨틱 태그

- 위의 문제를 **시맨택 태그**를 통해 해결할 수 있음
- 주요 시맨틱 태그
  - header
  - nav
  - main
  - article
  - section
  - aside
  - footer

### 멀티미디어 태그

- 주요 멀티미디어 태그
  - img
  - video
  - audio
  - canvas

### 기타 태그

- 폼 관련 태그

  - form
  - input
  - button
  - select, option

- 텍스트 관련 태그

  - strong
  - em
  - mark

- 추가 태그
  - br
  - code
  - h1 ~ h6
  - iframe
  - label
  - link
  - menu
  - meta
  - p
  - script
  - span
  - style
  - table
  - textarea
  - title

### HTML 구성 요소

1. HTML 요소는 한 쌍으로 이루어짐
2. 속성도 부여할 수 있음
3. 중첩으로 사용 가능함
4. 콘텐츠가 없어도 태그 사용 가능함

### `<head>` 태그란?

- 페이지에 대한 메타 데이터를 포함
- `<body>`와는 달리 사용자 눈에 보이지 않음

1. 문서 타입 선언
2. HTML 태그 언어 정의
3. 문자 인코딩 등

### `<body>` 태그란?

- 서비스 목적에 따라 내부 구조가 달라짐
- 사용자 눈에 실제로 보임

### block vs inline

- **block**
  - width, height, margin, padding 속성 모두 반영
  - 아래로 정렬 즉, 혼자 한 줄을 다 차지함
- **inline**
  - 콘텐츠 크기만큼 공간 차지
  - width, height 무시됨
  - margin, padding 좌우 간격만 반영
  - 다른 요소들과 나란히 배치
- **inline-block**
  - inline처럼 다른 요소들과 나란히 배치
  - block처럼 width, height, margin, padding 속성 모두 반영
  - 즉, 내부적으로는 block, 외부적으로는 inline처럼 동작함
