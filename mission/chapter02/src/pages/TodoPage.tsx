import { Link } from 'react-router';
import { useTodo } from '../context/TodoProvider';
import TodoInput from '../components/TodoInput';
import TodoColumn from '../components/TodoColumn';

const TodoPage = () => {
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
        <Link to="/dark-mode" className="mission2-btn" style={{ textDecoration: 'none' }}>
          미션 2로 이동하기
        </Link>
      </main>
    </div>
  );
};

export default TodoPage;
