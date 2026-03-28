import { useTodo } from '../context/TodoContext';

interface Task {
  id: number;
  text: string;
  isDone: boolean;
}

export function TodoItem({ task }: { task: Task }) {
  const { completeTask, deleteTask } = useTodo();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{task.text}</span>
      {task.isDone ? (
        <button
          className="render-container__item-button"
          onClick={() => deleteTask(task.id)}
        >
          삭제
        </button>
      ) : (
        <button
          className="render-container__item-button render-container__item-button--complete"
          onClick={() => completeTask(task.id)}
        >
          완료
        </button>
      )}
    </li>
  );
}
