import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import AuthPage from './pages/auth/AuthPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import LpDetailPage from './pages/lps/LpDetailPage';
import LpsPage from './pages/lps/LpsPage';
import UsersPage from './pages/users/UsersPage';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
