import { useNavigate } from 'react-router';
import LoginForm from '../containers/LoginForm';

function LoginPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="login">
      <header className="login__header">
        <button type="button" className="login__back" onClick={handleBack} aria-label="이전 페이지">
          &lt;
        </button>
      </header>

      <main className="login__main">
        <h1 className="login__heading">로그인</h1>
        <p className="login__subtitle">계정 정보를 입력해 주세요</p>
        <LoginForm />
      </main>
    </div>
  );
}

export default LoginPage;
