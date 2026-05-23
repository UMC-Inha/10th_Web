import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const GoogleCallbackPage = lazy(() => import('./pages/auth/GoogleCallbackPage'));
const LpDetailPage = lazy(() => import('./pages/lps/LpDetailPage'));
const LpsPage = lazy(() => import('./pages/lps/LpsPage'));
const UsersPage = lazy(() => import('./pages/users/UsersPage'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 헤더+사이드바 레이아웃 */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<LpsPage />} />
            <Route path="/lp/:lpId" element={<LpDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/users/me" element={<UsersPage />} />
              <Route path="/users/:userId" element={<UsersPage />} />
            </Route>
          </Route>

          {/* 인증 전용 페이지 (레이아웃 없음) */}
          <Route path="/auth/signin" element={<AuthPage />} />
          <Route path="/auth/signup" element={<AuthPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
