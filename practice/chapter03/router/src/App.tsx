import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router';

// 1) 만든 페이지 import
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import Movies from './pages/MoviesPage';
import RootLayout from './layout/RootLayout';

// 2) 라우터에 연결
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    // 1) Navbar 아래에 표시할 자식 라우트
    children: [
      {
        // 2) index: true → 부모의 기본 경로('/')일 때 렌더
        index: true,
        element: <HomePage />,
      },
      {
        // 3) 부모가 '/'이므로, 'movies'만 써도 '/movies'로 매칭
        path: 'movies/:movieId',
        element: <Movies />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
