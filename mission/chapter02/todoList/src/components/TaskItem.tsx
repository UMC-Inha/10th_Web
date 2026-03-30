import { useContext } from 'react';
import { TodoContext } from '../TodoContext';
import type { Task } from '../types/index';

function TaskItem({ task, isDone }: { task: Task; isDone: boolean }) {
  const context = useContext(TodoContext);
  if (!context) return null;

  const { moveToDone, deleteDone } = context;

  return (
    <li className="render-container__item">
      <span>{task.text}</span>
      <button
        type="button"
        className={isDone ? 'render-container__item-delbutton' : 'render-container__item-combutton'}
        onClick={() => isDone ? deleteDone(task.id) : moveToDone(task.id)}
      >
        {isDone ? '삭제' : '완료'}
      </button>
    </li>
  );
}

export default TaskItem;