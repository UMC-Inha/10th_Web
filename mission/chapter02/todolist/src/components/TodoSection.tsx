/*
  TodoSection.tsx

  할 일 목록의 한 섹션("할 일" 또는 "완료")을 렌더링하는 컴포넌트
 */

import TodoItem from "./TodoItem";
import type { Todo } from "../types/todo";

interface TodoSectionProps {
  title: string;
  todos: Todo[];
}

export default function TodoSection({ title, todos }: TodoSectionProps) {
  return (
    <div className="todo__section">
      {/* 섹션 제목 */}
      <h2 className="todo__section-title">{title}</h2>

      {/* 할 일 목록. */}
      <ul className="todo__list">
        {todos.map((todo) => (
          /*
            key={todo.id}: UUID 기반의 고유 ID를 key로 사용해
            항목 추가/삭제/재정렬 시 React의 diffing 알고리즘이 올바르게 동작한다.
           */
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
