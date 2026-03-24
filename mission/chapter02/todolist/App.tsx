import './App.css';
import { useState } from 'react';
import TodoForm from './components/TodoForm';
import PlannedList from './components/PlannedList';
import CompletedList from './components/CompletedList';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [text, setText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const innerText = text.trim();
    if (innerText === '') {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: innerText,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setText('');
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const plannedTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <>
      <header className="container">
        <div className="container__box">
          <h1 className="container__title">Study Planner</h1>
          <TodoForm
            text={text}
            setText={setText}
            handleAddTodo={handleAddTodo}
          />
          <div className="render-container">
            <PlannedList
              plannedTodos={plannedTodos}
              handleToggleTodo={handleToggleTodo}
            />
            <CompletedList
              completeTodos={completedTodos}
              handleDeleteTodo={handleDeleteTodo}
            />
          </div>
        </div>
      </header>
    </>
  );
}

export default App;
