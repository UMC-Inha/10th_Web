// src/App.tsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import PopularPage from './pages/PopularPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/popular" replace /> }, 
      { 
        path: 'popular', 
        element: <PopularPage /> 
      },
      { 
        path: 'movies/:movieId', 
        element: <MovieDetailPage /> 
      },
      {
        path: 'search',
        element: <SearchPage/>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;