import { createContext, useContext, useReducer, type ReactNode } from 'react';

// kcleverp 리뷰: type → interface, isDone 속성 추가
interface Task {
  id: number;
  text: string;
  isDone: boolean;
}

type TodoContextType = {
  todos: Task[];
  addTodo: (text: string) => void;
  completeTask: (id: number) => void;
  deleteTask: (id: number) => void;
};

// bukyung03 리뷰: 여러 useState → useReducer로 통합
type Action =
  | { type: 'ADD'; text: string }
  | { type: 'COMPLETE'; id: number }
  | { type: 'DELETE'; id: number };

function todoReducer(todos: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'ADD':
      return [...todos, { id: Date.now(), text: action.text, isDone: false }];
    case 'COMPLETE':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, isDone: true } : todo
      );
    case 'DELETE':
      return todos.filter((todo) => todo.id !== action.id);
  }
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  const addTodo = (text: string) => dispatch({ type: 'ADD', text });
  const completeTask = (id: number) => dispatch({ type: 'COMPLETE', id });
  const deleteTask = (id: number) => dispatch({ type: 'DELETE', id });

  return (
    <TodoContext.Provider value={{ todos, addTodo, completeTask, deleteTask }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo는 TodoProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
