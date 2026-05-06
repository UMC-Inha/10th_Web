import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/auth/AuthPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import HomePage from './pages/HomePage';
import LpsPage from './pages/lps/LpsPage';
import TagsPage from './pages/tags/TagsPage';
import UsersPage from './pages/users/UsersPage';

type AppRoute = {
  path: string;
  element: ReactElement;
};

const PUBLIC_ROUTES: AppRoute[] = [
  { path: '/', element: <HomePage /> },
  { path: '/auth/signup', element: <AuthPage /> },
  { path: '/auth/signin', element: <AuthPage /> },
  { path: '/auth/google/callback', element: <GoogleCallbackPage /> },
  { path: '/lps', element: <LpsPage /> },
  { path: '/lps/user/:userId', element: <LpsPage /> },
  { path: '/lps/:lpId', element: <LpsPage /> },
  { path: '/lps/tag/:tagName', element: <LpsPage /> },
  { path: '/tags', element: <TagsPage /> },
];

const PROTECTED_ROUTES: AppRoute[] = [
  { path: '/users/me', element: <UsersPage /> },
  { path: '/users/:userId', element: <UsersPage /> },
  { path: '/lps/user', element: <LpsPage /> },
  { path: '/lps/likes/me', element: <LpsPage /> },
  { path: '/lps/likes/:userId', element: <LpsPage /> },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {PUBLIC_ROUTES.map((routeItem) => (
          <Route key={routeItem.path} path={routeItem.path} element={routeItem.element} />
        ))}

        <Route element={<ProtectedRoute />}>
          {PROTECTED_ROUTES.map((routeItem) => (
            <Route key={routeItem.path} path={routeItem.path} element={routeItem.element} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
