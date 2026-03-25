import type { TTodo } from '../types/todo';
import { useTodoContext } from '../context/TodoContext';

type TodoItemProps = {
  task: TTodo;
  isDone: boolean;
};

const TodoItem = ({ task, isDone }: TodoItemProps) => {
  const { completeTask, deleteTask } = useTodoContext();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{task.text}</span>

      {isDone ? (
        <button
          className="render-container__item-button"
          onClick={() => deleteTask(task)}
        >
          삭제
        </button>
      ) : (
        <button
          className="render-container__item-button render-container__item-button--complete"
          onClick={() => completeTask(task)}
        >
          완료
        </button>
      )}
    </li>
  );
};

export default TodoItem;
