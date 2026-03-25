import { useState } from 'react';
import { useTodo } from '../context/TodoProvider';

const TextInput = () => {
  const { addTodo } = useTodo();
  const [text, setText] = useState('');

  const handleInputKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;

    const value = text.trim();
    if (!value) return;

    addTodo(value);
    setText('');
  };

  return (
    <section className="planner">
      <input
        id="todo-input"
        className="planner__input"
        type="text"
        placeholder="할 일을 입력하고 Enter를 눌러 추가하세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleInputKeydown}
      />
    </section>
  );
};

export default TextInput;
