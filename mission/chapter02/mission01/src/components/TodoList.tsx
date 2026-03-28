import { useTodo } from '../context/TodoContext';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { todos } = useTodo();

  return (
    <div className="render-container">
      <div className="render-container__section">
        <h2 className="render-container__title">할 일</h2>
        <ul className="render-container__list">
          {todos.filter((task) => !task.isDone).map((task) => (
            <TodoItem key={task.id} task={task} />
          ))}
        </ul>
      </div>
      <div className="render-container__section">
        <h2 className="render-container__title">완료</h2>
        <ul className="render-container__list">
          {todos.filter((task) => task.isDone).map((task) => (
            <TodoItem key={task.id} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
}
