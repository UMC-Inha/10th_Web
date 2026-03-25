import { useTodo } from './context/TodoProvider';
import TodoInput from './components/TodoInput';
import TodoColumn from './components/TodoColumn';
import './App.css';

function App() {
  const { todos } = useTodo();

  const todoItems = todos.filter((t) => !t.isDone);
  const doneItems = todos.filter((t) => t.isDone);

  return (
    <div className="page">
      <main className="layout">
        <h1 className="layout__title">Todo</h1>
        <TodoInput />
        <section className="board">
          <TodoColumn title="TODO" items={todoItems} />
          <TodoColumn title="DONE" items={doneItems} isDone />
        </section>
      </main>
    </div>
  );
}

export default App;
