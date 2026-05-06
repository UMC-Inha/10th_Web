import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import NotFound from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import GoogleCallbackPage from './pages/GoogleCallBackPage';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'mypage',
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/v1/auth/google/callback',
    element: <GoogleCallbackPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
