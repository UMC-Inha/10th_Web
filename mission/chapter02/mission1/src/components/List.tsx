import { TodoContext, type Todo } from "../contexts/TodoContext";
import Button from "./Button"
import { useContext } from 'react';

interface Prop{
    data:Todo[]
    title:string
    about:string
}

const List = ({data, title, about}:Prop) => {
    const context = useContext(TodoContext)
    if (!context) return null
    const {completeTodo, deleteTodo} = context
    return (
        <div className="render-container__section">
          <h2 className="render-container__title">{title}</h2>
          <ul id={about} className="render-container__list">
            {data.map((todo) => (
                <li 
                key={todo.id}
                className="render-container__item"  
                >
                    {todo.input}
                    <Button 
                    className='render-container__item-button' 
                    label={todo.isDone ? "삭제" : "완료"} 
                    onClick={() => todo.isDone ? deleteTodo(todo.id) : completeTodo(todo.id)} 
                    />
                </li>
            ))}
          </ul>
        </div>
    )
};

export default List