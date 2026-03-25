/*
  TodoItem.tsx
 
  할 일 목록의 개별 항목을 렌더링하는 컴포넌트
 
  [Props Drilling 해결 부분]
  이전 방식(props drilling):
    App → Todo → TodoSection → TodoItem 으로 completeTodo, deleteTodo를 전달
 
  Context API 사용:
    이 컴포넌트가 useTodoContext()를 호출해 직접 꺼내기 때문에
    중간 컴포넌트(Todo, TodoSection)는 이 함수들을 알 필요가 없다.
 
 */

import type { Todo } from "../types/todo";
import { useTodoContext } from "../context/TodoContext";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  /*
   * Context에서 completeTodo, deleteTodo를 직접 가져온다.
   */
  const { completeTodo, deleteTodo } = useTodoContext();

  return (
    <li className="todo__item">
      {/* 할 일 텍스트. */}
      <span>{todo.text}</span>

      {/*
       * 완료 여부에 따라 버튼 조건부 렌더링
       * - 완료된 항목: 삭제 버튼만 표시
       * - 미완료 항목: 완료 버튼만 표시
       */}
      {todo.isCompleted ? (
        // 완료된 항목 → 삭제 버튼
        <button
          className="todo__delete-btn"
          onClick={() => deleteTodo(todo.id)}
        >
          삭제
        </button>
      ) : (
        // 미완료 항목 → 완료 버튼
        <button
          className="todo__complete-btn"
          onClick={() => completeTodo(todo.id)}
        >
          완료
        </button>
      )}
    </li>
  );
}
