import { useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';

const TodoList = () => {
  const context = useContext(TodoContext);
  if (!context) return null;

  const { todos, doneTasks, completeTask, deleteTask } = context;

  return (
    <div className="render-container">
      {/* 할 일 영역 */}
      <div className="render-container__section">
        <h2 className="render-container__title">할 일</h2>
        <ul className="render-container__list">
          {todos.map((task) => (
            <li key={task.id} className="render-container__item">
              <span className="render-container__item-text">{task.text}</span>
              <button className="render-container__item-button" style={{backgroundColor: '#28a745'}} onClick={() => completeTask(task)}>완료</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 완료 영역 */}
      <div className="render-container__section">
        <h2 className="render-container__title">완료</h2>
        <ul className="render-container__list">
          {doneTasks.map((task) => (
            <li key={task.id} className="render-container__item">
              <span className="render-container__item-text">{task.text}</span>
              <button className="render-container__item-button" style={{backgroundColor: '#dc3545'}} onClick={() => deleteTask(task)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;