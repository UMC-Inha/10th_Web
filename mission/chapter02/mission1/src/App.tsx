import './App.css'
import List from "./components/List";
import { useContext } from 'react';
import { TodoContext } from './contexts/TodoContext';
import InputArea from './components/InputArea';

function App() {
  
  const context = useContext(TodoContext)
  if(!context) return null
  const {todos} = context
  const todoList = todos.filter(todo => !todo.isDone)
  const doneList = todos.filter(todo => todo.isDone)

  return (
     <div className="todo-container">
      <InputArea title="Todo List" />
      <div className="render-container">
        <List data={todoList} about="todo-list" title="할 일"/>
        <List data={doneList} about="done-list" title="완료"/>
      </div>
    </div>
  )
}

export default App