import './App.css';
import TodoForm from './components/TodoForm';
import TodoSection from './components/TodoSection';
import { TodoProvider, useTodoContext } from './context/TodoContext';

const TodoPage = () => {
  const { todos, doneTasks } = useTodoContext();

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">TODO</h1>
      <TodoForm />

      <div className="render-container">
        <TodoSection title="할 일" tasks={todos} isDone={false} />
        <TodoSection title="완료" tasks={doneTasks} isDone={true} />
      </div>
    </div>
  );
};

function App() {
  return (
    <TodoProvider>
      <TodoPage />
    </TodoProvider>
  );
}

export default App;