/*
 Todo.tsx
 
  - Context에서 todos를 꺼내 "할 일(미완료)"과 "완료" 두 배열로 필터링하고
  - 필터링된 배열을 각각 TodoSection에 props로 전달
    (props drilling 막기: completeTodo, deleteTodo 같은 함수는 전달하지 않고 TodoItem이 Context에서 직접 가져감)
 */

import { useTodoContext } from "../context/TodoContext";
import TodoInput from "./TodoInput";
import TodoSection from "./TodoSection";

const Todo = () => {
  const { todos } = useTodoContext();

  /*
    - activeTodos   : isCompleted === false → "할 일"
    - completedTodos: isCompleted === true  → "완료"
  */
  const activeTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  return (
    <div className="todo">
      {/* 제목 */}
      <h1 className="todo__title">YONG TODO</h1>

      {/* 할 일 입력 */}
      <TodoInput />

      {/* 할 일 / 완료 목록 영역 */}
      <div className="todo__container">
        {/* 미완료 항목 목록 */}
        <TodoSection title="할 일" todos={activeTodos} />
        {/* 완료된 항목 목록 */}
        <TodoSection title="완료" todos={completedTodos} />
      </div>
    </div>
  );
};

export default Todo;
