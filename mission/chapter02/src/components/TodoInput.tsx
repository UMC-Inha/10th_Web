import { useState, type KeyboardEvent } from 'react';
import { useTodo } from '../context/TodoProvider';

const TodoInput = () => {
  const { addTodo } = useTodo();
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    const value = input.trim();
    if (!value) return;

    addTodo(value);
    setInput('');
  };

  return (
    <section className="planner">
      <input
        className="planner__input"
        type="text"
        placeholder="할 일을 입력하고 Enter를 눌러 추가하세요."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </section>
  );
};

export default TodoInput;
