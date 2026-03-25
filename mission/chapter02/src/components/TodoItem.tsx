import { useTodo } from '../context/TodoProvider';

interface TodoItemProps {
  id: number;
  text: string;
  isDone: boolean;
}

const TodoItem = ({ id, text, isDone }: TodoItemProps) => {
  const { toggleTodo, deleteTodo } = useTodo();

  return (
    <li className="todo-item">
      <span className="todo-item__text">{text}</span>
      <div className="todo-item__actions">
        <button className="btn btn--complete" onClick={() => toggleTodo(id)}>
          {isDone ? '되돌리기' : '완료'}
        </button>
        <button className="btn btn--delete" onClick={() => deleteTodo(id)}>
          삭제
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
