import './App.css';
import { TodoProvider, useTodo } from './context/TodoProvider';
import TextInput from './components/TextInput';
import TodoColumn from './components/TodoColumn';

function TodoApp() {
  const { todos } = useTodo();

  const todoItems = todos.filter((t) => !t.isDone);
  const doneItems = todos.filter((t) => t.isDone);

  return (
    <div className="page">
      <main className="layout">
        <h1 className="layout__title">TODO</h1>

        <TextInput />

        <section className="board">
          <TodoColumn
            title="TODO"
            todos={todoItems}
          />
          <TodoColumn
            title="DONE"
            todos={doneItems}
            isDone
          />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
}

export default App;
