import useToggle from './hooks/useToggle';
import './App.css';

function App() {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div className="app">
      <h1 className="app__title">{isOpen ? '열림' : '닫힘'}</h1>
      <button type="button" className="app__toggle" onClick={toggle}>
        토글
      </button>
    </div>
  );
}

export default App;
