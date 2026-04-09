import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import MovieListPage from './pages/MovieListPage';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/popular" replace /> },
      { path: 'popular',     element: <MovieListPage category="popular"     title="인기 영화" /> },
      { path: 'now-playing', element: <MovieListPage category="now_playing" title="현재 상영중" /> },
      { path: 'top-rated',   element: <MovieListPage category="top_rated"   title="평점 높은 영화" /> },
      { path: 'upcoming',    element: <MovieListPage category="upcoming"    title="개봉 예정 영화" /> },
      { path: 'movies/:movieId', element: <MovieDetailPage /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;