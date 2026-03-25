import Navbar from './Navbar'; 
import ThemeContent from './ThemeContent';
import { ThemeProvider } from './ThemeProvider';

export default function ContextPage() {
  return (
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center min-h-screen transition-colors duration-300">
        <Navbar />
        <main className="flex-1 w-full">
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
  );
}