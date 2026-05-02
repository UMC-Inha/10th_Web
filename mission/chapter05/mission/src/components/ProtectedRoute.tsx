import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// React Router v6 권장 패턴: 레이아웃 라우트(Layout Route)
// App.tsx에서 element로 등록하고 children에 보호할 라우트를 중첩
// → children을 props로 받는 방식보다 라우터 설정이 선언적으로 유지됨
export default function ProtectedRoute() {
  const { accessToken } = useAuth();

  if (!accessToken) {
    // replace: true → 히스토리 스택에 /login이 쌓이지 않아
    // 로그인 후 뒤로가기 시 보호된 페이지로 돌아가는 문제 방지
    return <Navigate to="/login" replace />;
  }

  // Outlet: 중첩된 자식 라우트를 렌더링하는 자리
  // 인증이 확인된 경우에만 실제 페이지 컴포넌트가 여기 삽입됨
  return <Outlet />;
}
