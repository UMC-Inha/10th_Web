import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Posts } from './pages/Posts';
import { NotFound } from './pages/NotFound';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // 브라우저 뒤로가기/앞으로가기 시 popstate 이벤트 발생
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 경로에 따라 렌더링할 페이지 결정
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home />;
      case '/about':
        return <About />;
      case '/posts':
        return <Posts />;
      default:
        return <NotFound />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
