import Navbar from './Navbar';
import ThemeContent from './ThemeContent';
import { ThemeProvider } from './ThemeProvider';

export default function ContextPage() {
  return;
  <ThemeProvider className="flex felx-col items-center justify-center min-h-screen">
    <div>
      <Navbar />
      <main className="flex-1 w-full">
        <ThemeContent />
      </main>
    </div>
  </ThemeProvider>;
}
