import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import NotFound from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <NotFound />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
