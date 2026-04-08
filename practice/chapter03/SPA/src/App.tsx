import MoviesPage from './pages/Movies';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import { useState } from 'react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    if (currentPage === 'home') return <HomePage />;
    if (currentPage === 'movies') return <MoviesPage />;
    if (currentPage === 'about') return <AboutPage />;
  };

  return (
    <div>
      {/* 네비게이션 */}
      <nav>
        <button onClick={() => setCurrentPage('home')}>홈</button>
        <button onClick={() => setCurrentPage('movies')}>영화 목록</button>
        <button onClick={() => setCurrentPage('about')}>소개</button>
      </nav>

      {/* 현재 페이지 렌더링 */}
      {renderPage()}
    </div>
  );
};

export default App;
