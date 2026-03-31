import TodoForm from './Todoform';
import TodoList from './TodoList';

const Todo = () => {
  return (
    <div className="todo-container">
      <h1 className="todo-container__header">동동 TODO</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
};

export default Todo;