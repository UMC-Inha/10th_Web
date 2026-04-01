import { createContext, type ReactNode, useState } from 'react';
interface TodoContextType{
    todos:Todo[];
    setTodos:any
    addTodo:(input:string) => void;
    completeTodo:(id:number) => void;
    deleteTodo:(id:number) => void;
}
export interface Todo{
  input:string,
  id:number
  isDone:boolean
}

export const TodoContext = createContext<TodoContextType | null >(null)
export const TodoProvider = ({children}: {children:ReactNode}) => {
    const [todos, setTodos] = useState<Todo[]>([])
    const completeTodo = (id:number) => {
        setTodos((prevTodos: Todo[]) => 
            prevTodos.map((todo) => todo.id === id ? { ...todo, isDone: !todo.isDone } : todo ));
    }
    const deleteTodo = (id:number) => {
        setTodos(prev => prev.filter(todo => todo.id !== id))
    }
     const addTodo = (input:string) => {
        const todo = {
            input: input,
            id: Date.now(),
            isDone:false
        }
        setTodos(prevTodos => [...prevTodos, todo])
    }
    return (
        <TodoContext.Provider value={{todos, setTodos, addTodo, completeTodo, deleteTodo}}>
            {children}
        </TodoContext.Provider>
    )
}