import { createContext, useContext, useState, useRef, useCallback, useMemo, type ReactNode } from 'react';

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

const saveToStorage = (items: Todo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const loadFromStorage = (): Todo[] => {
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
};

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage);

  const nextIdRef = useRef(todos.reduce((max, t) => Math.max(max, t.id), 0) + 1);

  const addTodo = useCallback((text: string) => {
    const newTodo = {
      id: nextIdRef.current++,
      text,
      isDone: false,
    };

    setTodos((prev) => {
      const updated = [...prev, newTodo];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ todos, addTodo, toggleTodo, deleteTodo }),
    [todos, addTodo, toggleTodo, deleteTodo],
  );

  return (
    <TodoContext.Provider value={value}>
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
