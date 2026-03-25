import {
  createContext,
  useContext,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import type { TTodo } from '../types/todo';

type TodoContextType = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  todos: TTodo[];
  doneTasks: TTodo[];
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  completeTask: (task: TTodo) => void;
  deleteTask: (task: TTodo) => void;
};

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTasks, setDoneTasks] = useState<TTodo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: TTodo = {
      id: Date.now(),
      text,
    };

    setTodos((prev) => [...prev, newTodo]);
    setInput('');
  };

  const completeTask = (task: TTodo) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== task.id));
    setDoneTasks((prev) => [...prev, task]);
  };

  const deleteTask = (task: TTodo) => {
    setDoneTasks((prev) => prev.filter((done) => done.id !== task.id));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedText = input.trim();
    if (!trimmedText) return;

    addTodo(trimmedText);
  };

  return (
    <TodoContext.Provider
      value={{
        input,
        setInput,
        todos,
        doneTasks,
        handleSubmit,
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