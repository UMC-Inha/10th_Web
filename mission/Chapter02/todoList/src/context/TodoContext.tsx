import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { TTodo } from '../types/todo';

type TodoContextType = {
  todos: TTodo[];
  doneTasks: TTodo[];
  addTodo: (text: string) => void;
  completeTask: (task: TTodo) => void;
  deleteTask: (task: TTodo) => void;
};

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTasks, setDoneTasks] = useState<TTodo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: TTodo = {
      id: crypto.randomUUID(),
      text,
    };

    setTodos((prev) => [...prev, newTodo]);
  };

  const completeTask = (task: TTodo) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== task.id));
    setDoneTasks((prev) => [...prev, task]);
  };

  const deleteTask = (task: TTodo) => {
    setDoneTasks((prev) => prev.filter((done) => done.id !== task.id));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        doneTasks,
        addTodo,
        completeTask,
        deleteTask,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }

  return context;
};