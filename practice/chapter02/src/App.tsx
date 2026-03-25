import List from './container/List';
import Counter from './container/Counter';
import PersonCard from './container/PersonCard';

import './App.css';

function App() {
  return (
    <>
      <h1>| 실습 1: 리스트</h1>
      <List />
      <h1>| 실습 2: 카운터</h1>
      <Counter />
      <h1>| 실습 3: 객체 상태 관리</h1>
      <PersonCard />
    </>
  );
}

export default App;
