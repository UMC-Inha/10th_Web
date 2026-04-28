import useToggle from './hooks/useToggle';
import './App.css';

function App() {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div>
      <h1>{isOpen ? '열림' : '닫힘'}</h1>
      <button onClick={toggle}>토글</button>
    </div>
  );
}

export default App;
