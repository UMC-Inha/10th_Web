import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { TTodo } from '../types/todo';

type TodoContextType = {
  pendingTasks: TTodo[];
  doneTasks: TTodo[];
  addTodo: (text: string) => void;
  completeTask: (id: TTodo['id']) => void;
  deleteTask: (id: TTodo['id']) => void;
};

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TTodo[]>([]);

  const addTodo = useCallback((text: string) => {
    const newTodo: TTodo = {
      id: crypto.randomUUID(),
      text,
      isDone: false,
    };

    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const completeTask = useCallback((id: TTodo['id']) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              isDone: true,
            }
          : todo,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: TTodo['id']) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const pendingTasks = useMemo(
    () => todos.filter((todo) => !todo.isDone),
    [todos],
  );

  const doneTasks = useMemo(
    () => todos.filter((todo) => todo.isDone),
    [todos],
  );

  const value = useMemo(
    () => ({
      pendingTasks,
      doneTasks,
      addTodo,
      completeTask,
      deleteTask,
    }),
    [pendingTasks, doneTasks, addTodo, completeTask, deleteTask],
  );

  return (
    <TodoContext.Provider value={value}>
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