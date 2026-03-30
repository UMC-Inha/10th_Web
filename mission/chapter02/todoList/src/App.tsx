import './App.css';
import { useContext } from 'react';
import { TodoContext } from './TodoContext';
import TodoInput from './components/TodoInput';
import TaskItem from './components/TaskItem';


function App() {
  const context = useContext(TodoContext);
  if(!context) return null;
  const {todos, dones} = context;

  return (
    <div>
      <div className="container">
        <div className="container__header">
          <h1 className="container__title">Study Planner</h1>
          <TodoInput/>
        </div>
        <div className="render-container">
          <div className="render-container__section">
            <h2 className="render-container__title">계획</h2>
            <ul id="todo-list" className="render-container__list">
              {todos.map((task) => (
                <TaskItem key={task.id} task={task} isDone={false} />
              ))}
            </ul>
          </div>
          <div className="render-container__section">
            <h2 className="render-container__title">완료</h2>
            <ul id="done-list" className="render-container__list">
              {dones.map((task) => (
                <TaskItem key={task.id} task={task} isDone={true}/>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
