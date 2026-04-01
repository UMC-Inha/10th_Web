import Button from "./Button"
import { useState, useContext, type ChangeEvent } from "react"
import { TodoContext } from "../contexts/TodoContext"

interface Prop{
    title:string
}

export default function InputArea({title}:Prop){
    const [input, setinput] = useState<string>("")
    const context = useContext(TodoContext)
    if(!context) return null
    const { addTodo } = context
    const updateInput = (e:ChangeEvent<HTMLInputElement>)=> {
        const text = e.target.value
        setinput(text)
    }
    const handleAdd = () => {
        if (!input.trim()) return;
        addTodo(input)
        setinput("")
    }
    return(
        <>
            <h1 className="todo-container__header">{title}</h1>
            <form id="todo-form" className="todo-container__form" onSubmit={(e:React.SubmitEvent) => e.preventDefault()}>
                <input
                    type="text"
                    id="todo-input"
                    className="todo-container__input"
                    placeholder="할 일 입력"
                    value={input}
                    onChange={(event) => updateInput(event)}
                />
                <Button label="할일추가" onClick={handleAdd} className='todo-container__button'/>
            </form>
        </>
    )
}