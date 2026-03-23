호이스팅 (Hoisting) 🍠 -함수 선언문: 선언 전체가 끌어올려져서 선언 전에 호출 -함수 표현식/화살표 함수: const/let에 담으면 TDZ 때문에 선언 전 접근 시 ReferenceError임
-console.log(a);
var a = 'A';

=> var a;
console.log(a);
a = 'A';
이렇게 var로 두었을 때 concole에서 출력은 nondefined가 됨

DOM 조작🍠 -태그 가져오기

1. getElementById('id'): id 가져옴
   예: const firstItem = document.getElementById('title')
2. querySelector('선택자'): css 선택자로 첫 번째 요소만 가져옴
   -class: querySelector('.class')
   -item: querySelector('#item')
   -tag: querySelector('tag')
3. querySelectorAll('선택자'): 모든 요소만 가져옴
   -class: querySelector('.class')
   -item: querySelector('#item')
   -tag: querySelector('tag') -이벤트 리스너 추가하기
   -addEventListner로 특정 동작이 일어날 때 실행할 함수 등록 가능
4. 클릭: btn.addEventListner('click', () {})
5. 엔터: input.addEventListner('Enter', () {}) -이벤트 리스너 제거하기: 등록된 이벤트를 해제 but 같은 함수 참조 전달해야 제거 -새로운 태그 만들기
6. document.createElement로 태그를 만듦
7. appendChild나 append로 붙임
