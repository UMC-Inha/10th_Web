import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 1) 만든 페이지 import
import HomePage from './pages/home';
import NotFound from './pages/not-found';
import Movies from './pages/movies';
import RootLayout from './layout/root-layout';

// 2) 라우터에 연결
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies/:movieId', element: <Movies /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;