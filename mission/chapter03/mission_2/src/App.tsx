import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} errorElement={<NotFoundPage />}>
          <Route path="movies/:category" element={<MoviePage />} />
          <Route path="movies/:movieId" element={<MovieDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
