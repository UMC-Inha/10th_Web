import type { Todo } from '../context/TodoProvider';
import { useTodo } from '../context/TodoProvider';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const { toggleTodo, deleteTodo } = useTodo();

  return (
    <li key={todo.id} className="todo-item">
      <span className="todo-item__text">{todo.text}</span>
      <div className="todo-item__actions">
        <button type="button" className="btn btn--complete" onClick={() => toggleTodo(todo.id)}>
          {todo.isDone ? '되돌리기' : '완료'}
        </button>
        <button type="button" className="btn btn--delete" onClick={() => deleteTodo(todo.id)}>
          삭제
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
