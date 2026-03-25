import { useTodo } from '../context/TodoContext';

type Task = {
  id: number;
  text: string;
};

type TodoItemProps = {
  task: Task;
  isDone: boolean;
};

export function TodoItem({ task, isDone }: TodoItemProps) {
  const { completeTask, deleteTask } = useTodo();

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
}
