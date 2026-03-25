import './App.css'
import List from "./components/List";
import Button from "./components/Button"
import { useContext, useState, type ChangeEvent } from 'react';
import { TodoContext } from './contexts/TodoContext';

function App() {
  const [input, setinput] = useState<string>("")
  const context = useContext(TodoContext)
  if(!context) return null
  const {todos, addTodo} = context
  const todoList = todos.filter(todo => !todo.isDone)
  const doneList = todos.filter(todo => todo.isDone)
  const updateInput = (e:ChangeEvent<HTMLInputElement>)=> {
    const text = e.target.value
    setinput(text)
  }
  const handleAdd = () => {
    addTodo(input)
    setinput("")
  }

  return (
     <div className="todo-container">
      <h1 className="todo-container__header">TODO LIST</h1>
      <form id="todo-form" className="todo-container__form">
        <input
          type="text"
          id="todo-input"
          className="todo-container__input"
          placeholder="할 일 입력"
          value={input}
          onChange={(event) => updateInput(event)}
          required
        />
        <Button label="할일추가" onClick={handleAdd} className='todo-container__button'/>
      </form>
      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul id="todo-list" className="render-container__list">
            <List data={todoList}/>
          </ul>
        </div>
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul id="done-list" className="render-container__list">
            <List data={doneList}/>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App