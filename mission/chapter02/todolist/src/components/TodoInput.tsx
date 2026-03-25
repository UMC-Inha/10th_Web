/*
  TodoInput.tsx
 
  새로운 할 일을 입력하고 추가하는 컴포넌트
 
  - input 값은 로컬 상태(useState)로 관리
  - addTodo는 Context에서 꺼내 사용
  - Enter 키 / 버튼 클릭 두 가지 방법으로 할 일 추가
  - 추가 후 input을 빈 문자열로 초기화
 */

import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useTodoContext } from "../context/TodoContext";

export default function TodoInput() {
  const [input, setInput] = useState("");

  /*
    Context에서 addTodo 꺼내기
    props drilling 제거
  */
  const { addTodo } = useTodoContext();

  // input 요소의 값이 변경될 때마다 로컬 상태를 업데이트
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  /*
    실제로 할 일을 추가하는 함수
    - addTodo 내부에서 공백 체크를 하므로 여기서는 따로 체크 안 함
    - 추가 후 input 초기화
   */
  const handleAddTodo = () => {
    addTodo(input);
    setInput("");
  };

  // Enter 키 입력 시 handleAddTodo 호출
  // isComposing: 한글 IME 조합 중일 때는 무시 (한글 마지막 글자 중복 방지)
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      handleAddTodo();
    }
  };

  return (
    <div className="todo__input-box">
      <input
        className="todo__input"
        placeholder="할 일 입력"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {/* 할 일 추가 */}
      <button className="todo__add-btn" onClick={handleAddTodo}>
        할 일 추가
      </button>
    </div>
  );
}
