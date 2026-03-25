import TodoItem from './TodoItem';
import type { TTodo } from '../types/todo';

type TodoSectionProps = {
  title: string;
  tasks: TTodo[];
  isDone: boolean;
};

const TodoSection = ({ title, tasks, isDone }: TodoSectionProps) => {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {tasks.map((task) => (
          <TodoItem key={task.id} task={task} isDone={isDone} />
        ))}
      </ul>
    </div>
  );
};

export default TodoSection;