import { createContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import type { Task } from '../types/todo';

// 1. Context가 제공할 데이터/함수의 모양 정의
interface TodoContextType {
  todos: Task[];
  doneTasks: Task[];
  addTodo: (text: string) => void;
  completeTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

// 2. 초기값 설정
export const TodoContext = createContext<TodoContextType | undefined>(undefined);

// 3. Provider 컴포넌트 (데이터를 공급해주는 역할)
export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const addTodo = useCallback((text: string) => {
    const newTask = { id: Date.now(), text, isDone: false };
    setAllTasks((prev) => [...prev, newTask]);
  }, []);

  const completeTask = useCallback((id: number) => {
    setAllTasks((prev)=>
      prev.map((task)=>
        task.id === id ? {...task, isDone: !task.isDone} : task 
      )
    );
  },[]);

  const deleteTask = useCallback((id: number) => {
    setAllTasks((prev) => prev.filter((t) => t.id !== id));
  },[]);

  const todos = useMemo(()=> allTasks.filter((task)=>!task.isDone), [allTasks]);
  const doneTasks = useMemo(()=> allTasks.filter((task)=>task.isDone),[allTasks]);

  const value = useMemo(()=>({
    todos,
    doneTasks,
    addTodo,
    completeTask,
    deleteTask
  }), [todos, doneTasks, addTodo, completeTask,deleteTask]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};