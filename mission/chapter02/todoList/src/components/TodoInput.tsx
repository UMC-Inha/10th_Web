import { useContext } from 'react';
import { TodoContext } from '../TodoContext';

function TodoInput() {
  const context = useContext(TodoContext);
  if (!context) return null;

  const { input, setInput, addTodo } = context;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (text !== '') {
      addTodo(text);
      setInput('');
    }
  };

  return (
    <form className="container__header__form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        placeholder="계획을 작성해 주세요."
        className="container__input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
      />
      <button type="submit" className="container__button">
        계획 추가
      </button>
    </form>
  );
}

export default TodoInput;