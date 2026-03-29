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
  completeTask: (id: TTodo['id']) => void;
  deleteTask: (id: TTodo['id']) => void;
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

  const completeTask = (id: TTodo['id']) => {
    setTodos((prevTodos) => {
      const targetTask = prevTodos.find((todo) => todo.id === id);

      if (!targetTask) {
        return prevTodos;
      }

      setDoneTasks((prevDoneTasks) => [...prevDoneTasks, targetTask]);
      return prevTodos.filter((todo) => todo.id !== id);
    });
  };

  const deleteTask = (id: TTodo['id']) => {
    setDoneTasks((prev) => prev.filter((done) => done.id !== id));
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