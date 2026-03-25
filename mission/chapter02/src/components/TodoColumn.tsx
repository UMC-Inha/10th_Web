import type { Todo } from '../context/TodoProvider';
import TodoItem from './TodoItem';

interface TodoColumnProps {
  title: string;
  items: Todo[];
  isDone?: boolean;
}

const TodoColumn = ({ title, items, isDone = false }: TodoColumnProps) => {
  return (
    <div className="board__column">
      <h2 className="board__title">{title}</h2>
      <ul className={`todo-list${isDone ? ' todo-list--done' : ''}`}>
        {items.map((item) => (
          <TodoItem key={item.id} id={item.id} text={item.text} isDone={item.isDone} />
        ))}
      </ul>
    </div>
  );
};

export default TodoColumn;
