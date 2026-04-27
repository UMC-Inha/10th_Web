// src/App.tsx

import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RootLayout from './layouts/RootLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';

// PublicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element : <RootLayout />,
    children: [
      {path: "login", element:<LoginPage />},
      {path: "signup", element:<SignupPage />},
      {path: "v1/auth/google/callback", element:<GoogleLoginRedirectPage />},
    ],
  }
]

//protectedRoutes: 인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout/>,
    children: [
      {
        path: "my",
        element: <MyPage />
      }
    ]
  }
]

const browserRouter = createBrowserRouter([...publicRoutes, ...protectedRoutes]);


function App () {
  // 전역 상태로 관리 -> 모든 상태에서 페이지를 공유하고 싶음
  return (
    <AuthProvider>
      <Toaster />
      <RouterProvider router={browserRouter}/>
    </AuthProvider>
  );
}

export default App;