import { useLocation, useNavigate } from 'react-router';
import { clearAccessToken, setAccessToken } from '../../utils/authToken';
import PageLayout from '../../layouts/PageLayout';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSigninPage = location.pathname === '/auth/signin';
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const handleMockSignin = () => {
    setAccessToken(`mock-token-${Date.now()}`);
    navigate(from, { replace: true });
  };

  const handleMockSignout = () => {
    clearAccessToken();
  };

  return (
    <PageLayout
      title="인증 페이지"
      description="회원가입, 로그인, 토큰 검증/재발급, 구글 로그인/콜백, 로그아웃 라우트를 담당"
    >
      {isSigninPage ? (
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button type="button" onClick={handleMockSignin}>
            임시 로그인
          </button>
          <button type="button" onClick={handleMockSignout}>
            토큰 삭제
          </button>
        </div>
      ) : null}
    </PageLayout>
  );
}

export default AuthPage;
