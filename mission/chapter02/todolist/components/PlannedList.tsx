import type { Todo } from '../App';

interface PlannedListProps {
  plannedTodos: Todo[];
  handleToggleTodo: (id: number) => void;
}

function PlannedList({ plannedTodos, handleToggleTodo }: PlannedListProps) {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">계획</h2>

      <ul className="todo-list">
        {plannedTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span className="todo-text">{todo.text}</span>

            <div className="todo-button-group">
              <button
                type="button"
                className="complete-button"
                onClick={() => handleToggleTodo(todo.id)}
              >
                완료
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlannedList;
