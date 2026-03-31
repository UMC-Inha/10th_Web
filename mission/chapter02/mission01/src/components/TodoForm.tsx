import { useState, useContext, type ChangeEvent, type FormEvent } from 'react';
import { TodoContext } from '../contexts/TodoContext';

const TodoForm = () => {
  const [input, setInput] = useState('');
  const context = useContext(TodoContext); // Context에서 함수 가져오기

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && context) {
      context.addTodo(input);
      setInput('');
    }
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        className="todo-container__input"
        value={input}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        placeholder="할 일 입력"
      />
      <button className="todo-container__button" type="submit">할 일 추가</button>
    </form>
  );
};

export default TodoForm;