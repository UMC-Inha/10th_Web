import { ThemeProvider } from "../context/ThemeProvider";
import Navbar from "../components/Navbar";
import ThemeContent from "../components/ThemeContent";

function ContextPage() {
  return (
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Navbar />
        <main className="flex-1">
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default ContextPage;
