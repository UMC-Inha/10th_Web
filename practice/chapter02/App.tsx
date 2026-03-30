import './App.css';
import { useState } from 'react';
function App() {
  const [count, setCount] = useState(() => 0);
  const handleIncrement = () => {
    setCount(count + 1);
  };
  const handleDecreasement = () => {
    setCount(count - 1);
  };
  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleIncrement}>숫자 증가</button>
      <button onClick={handleDecreasement}>숫자 감소</button>
    </>
  );
}

export default App;
