import { useMemo, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 무거운 계산 함수
  const expensiveCalculation = (num: number) => {
    console.log('🔥 무거운 계산 실행');

    let result = 0;

    for (let i = 0; i < 100000000; i++) {
      result += i;
    }

    return num * 2;
  };

  // count가 바뀔 때만 계산
  const doubled = useMemo(() => {
    return expensiveCalculation(count);
  }, [count]);

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '50px auto',
        textAlign: 'center',
      }}
    >
      <h1>🍠 useMemo 실습</h1>

      <hr />

      <h2>Count : {count}</h2>

      <h2>Doubled : {doubled}</h2>

      <button onClick={() => setCount((prev) => prev + 1)}>Count 증가</button>

      <hr />

      <h3>input 테스트</h3>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="입력해보세요"
      />

      <p>{text}</p>
    </div>
  );
}

export default App;
