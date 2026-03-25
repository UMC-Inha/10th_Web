import { TodoContext } from "../contexts/TodoContext";
import Button from "./Button"
import { useContext } from 'react';
interface Todo{
  input:string,
  id:number
  isDone:boolean
}
interface Prop{
    data:Todo[]
}

const List = ({data}:Prop) => {
    const context = useContext(TodoContext)
    if (!context) return null
    const {completeTodo, deleteTodo} = context
    return (
        <>
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
        </>
    )
};

export default List