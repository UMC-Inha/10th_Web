# Javascript

- [원시 타입 vs 객체 타입] (https://devowen.com/481)

### 원시 타입 (Primitive Type)

- 불변성 (immutable)을 지니고 있음
- 원시 값을 변수에 할당하면 변수(확보된 메모리 공간)에는 실제 값이 저장됨

- boolean: 참과 거짓을 가질 수 있는 데이터 타입
- null: 값이 아직 없거나 비어 있음을 표현할 때 사용함
  - typeof null을 실행하면 'object'가 반환됨
- undefined: 변수를 선언했지만 아직 값을 할당하지 않았을 때 나타나는 값
  - 객체에 없는 프로퍼티를 접근할 때도 undefined가 반환됨
- number: -(2^53 - 1)부터 2^53 - 1 사이의 값
- string: 텍스트 데이터를 표현하는 타입
- symbol: 고유한 값을 만들 때 사용함
- bigint: 아주 큰 정수를 표현할 수 있는 타입
  - bigint는 number와 직접 섞어 쓸 수 없음

### 객체 타입 (Object Type)

- 7개 원시 타입을 제외한 모든 것이 객체 타입임
- 객체 타입은 값을 직접 저장하는 게 아니라, 참조(reference)를 통해 접근함
- 객체를 변수에 할당하면 변수(확보된 메모리 공간)에는 참조 값이 저장됨
- 객체 타입을 참조 타입이라고도 부름

- 배열 (Array)
- 함수 (function): 일급 객체이기에 변수에 담을 수 있고, 인자로 넘기거나 반환값으로 돌려줄 수 있음
- 클래스 (class): 객체를 만들기 위한 청사진

### React에서 자주 사용하는 자바스크립트 문법

- 구조 분해 할당(Destructuring assignment)
- 전개 연산자 (Spread Operator)
- 객체 초기자(Object shorthand assignment)
- Array 프로토타입의 메서드(map, filter, reduce, forEach, length)
- 삼항 조건 연산자 (Ternary Operator)

### DOM(Document Object Model)

- HTML 문서를 JavaScript가 이해하고 조작할 수 있도록 만든 구조(인터페이스)
- 브라우저는 HTML을 그대로 쓰는 게 아니라, 이를 메모리 상에 “트리 구조”로 변환해서 관리함
- 이때 각각의 태그(div, p, span 등)는 하나의 **노드(객체)**가 됨

### DOM이 왜 필요한가

- HTML만으로는 정적인 화면만 만들 수 있음
- 하지만 DOM이 있기 때문에 JavaScript가 문서 구조에 접근해서 1) 버튼 클릭 시 내용 변경 2) 입력값에 따라 UI 업데이트 3) 동적인 인터랙션 처리 등이 가능해짐

### DOM 조작

- 태그 가져오기
  - getElementById('id')
  - querySelector('선택자')
  - querySelectorAll('선택자')
- 이벤트 리스너 추가하기
  - addEventListener
- 이벤트 리스너 제거하기
  - removeEventListener
- 키보드와 마우스 이벤트
  - click
  - mouseover / mouseout
  - keydown / keyup
  - input
- 태그 속성 다루기
  - setAttribute
  - getAttribute
  - removeAttribute
- 부모와 자식 태그 찾기
  - parentElement
  - children
  - firstElementChild
  - lastElementChild
- 새로운 태그 만들기
  - document.createElement
  - appendChild
  - append
- 태그 복제하기
  - cloneNode(true/false)
  - true: 자식 요소까지 함께 복사
  - false: 태그만 복사
