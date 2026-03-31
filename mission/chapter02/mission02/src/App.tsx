import { ThemeProvider } from './context/ThemeProvider'
import ThemeContent from './context/ThemeContent';
import ThemeToggleButton from './context/ThemeToggleButton'
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="relative">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggleButton />
        </div>
        <ThemeContent />
      </div>
    </ThemeProvider>
  );
}

export default App;