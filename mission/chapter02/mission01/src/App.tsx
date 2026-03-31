import Todo from './components/Todo.tsx';
import { TodoProvider } from './contexts/TodoContext.tsx';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
}

export default App;