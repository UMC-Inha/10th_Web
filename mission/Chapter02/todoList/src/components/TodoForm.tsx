import { useState, type FormEvent } from 'react';
import { useTodoContext } from '../context/TodoContext';

const TodoForm = () => {
  const [input, setInput] = useState('');
  const { addTodo } = useTodoContext();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedText = input.trim();
    if (!trimmedText) return;

    addTodo(trimmedText);
    setInput('');
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-container__input"
        placeholder="할 일 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        required
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;