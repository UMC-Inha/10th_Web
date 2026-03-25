import { useTodo } from '../context/TodoContext';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { todos, doneTasks } = useTodo();

  return (
    <div className="render-container">
      <div className="render-container__section">
        <h2 className="render-container__title">할 일</h2>
        <ul className="render-container__list">
          {todos.map((task) => (
            <TodoItem key={task.id} task={task} isDone={false} />
          ))}
        </ul>
      </div>
      <div className="render-container__section">
        <h2 className="render-container__title">완료</h2>
        <ul className="render-container__list">
          {doneTasks.map((task) => (
            <TodoItem key={task.id} task={task} isDone={true} />
          ))}
        </ul>
      </div>
    </div>
  );
}
