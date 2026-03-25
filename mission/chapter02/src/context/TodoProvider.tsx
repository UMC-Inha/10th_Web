import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Todo {
  id: number;
  text: string;
  isDone: boolean;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_KEY = 'react_todo_items';

function loadFromStorage(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is Todo =>
        typeof v === 'object' &&
        v !== null &&
        typeof v.id === 'number' &&
        typeof v.text === 'string' &&
        typeof v.isDone === 'boolean'
    );
  } catch {
    return [];
  }
}

function saveToStorage(items: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage);

  const addTodo = (text: string) => {
    setTodos((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
      const updated = [...prev, { id: nextId, text, isDone: false }];
      saveToStorage(updated);
      return updated;
    });
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t));
      saveToStorage(updated);
      return updated;
    });
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo는 반드시 TodoProvider 내부에서 사용해야 합니다.');
  }
  return context;
};
