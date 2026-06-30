import { useState, useCallback } from 'react'
import TextInput from './TextInput'

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  const handleChange = useCallback((value: string) => {
    setText(value)
  }, [])

  return (
    <div>
      <h1>같이 배우는 리액트 useCallback편</h1>
      <p>Count : {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>카운트 증가</button>
      <TextInput text={text} onChange={handleChange} />
    </div>
  )
}

export default App
