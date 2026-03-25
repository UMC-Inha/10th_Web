import { Routes, Route } from 'react-router';
import TodoPage from './pages/TodoPage';
import DarkModePage from './pages/DarkModePage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TodoPage />} />
      <Route path="/dark-mode" element={<DarkModePage />} />
    </Routes>
  );
}

export default App;
