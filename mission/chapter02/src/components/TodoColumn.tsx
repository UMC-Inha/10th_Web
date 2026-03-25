import type { Todo } from '../context/TodoProvider';
import TodoItem from './TodoItem';

interface TodoColumnProps {
  title: string;
  todos: Todo[];
  isDone?: boolean;
}

const TodoColumn = ({ title, todos, isDone = false }: TodoColumnProps) => {
  return (
    <div className="board__column">
      <h2 className="board__title">{title}</h2>
      <ul className={`todo-list${isDone ? ' todo-list--done' : ''}`}>
        {todos.map((item) => (
          <TodoItem key={item.id} todo={item} />
        ))}
      </ul>
    </div>
  );
};

export default TodoColumn;
