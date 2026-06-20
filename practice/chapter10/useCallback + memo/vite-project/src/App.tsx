import { useCallback, useState } from 'react';
import Child from './components/Child';

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  console.log('✅ Parent 렌더링');

  const handleChildClick = useCallback(() => {
    console.log('🎉 자식 버튼 클릭');
  }, []);

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '50px auto',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1>useCallback + memo 실습</h1>

      <hr />

      <h2>부모 컴포넌트</h2>

      <h3>Count : {count}</h3>

      <button onClick={() => setCount((prev) => prev + 1)}>Count 증가</button>

      <br />
      <br />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="입력해보세요"
      />

      <p>입력값 : {text}</p>

      <Child onClick={handleChildClick} />
    </div>
  );
}

export default App;
