import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'popular', element: <MoviesPage key="popular" category="popular" /> },
          { path: 'upcoming', element: <MoviesPage key="upcoming" category="upcoming" /> },
          { path: 'top-rated', element: <MoviesPage key="top_rated" category="top_rated" /> },
          { path: 'now-playing', element: <MoviesPage key="now_playing" category="now_playing" /> },
          { path: 'movies/:movieId', element: <MovieDetailPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
