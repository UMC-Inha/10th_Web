import { useNavigate } from 'react-router';
import LoginCredentialsForm from '../containers/LoginCredentialsForm';
import * as styles from '../styles/ui.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.login}>
      <header className={styles.loginHeader}>
        <button type="button" className={styles.loginBack} onClick={handleBack} aria-label="이전 페이지">
          &lt;
        </button>
      </header>

      <main className={styles.loginMain}>
        <h1 className={styles.loginHeading}>로그인</h1>
        <p className={styles.loginSubtitle}>계정 정보를 입력해 주세요</p>
        <LoginCredentialsForm onSuccess={() => navigate('/')} />
      </main>
    </div>
  );
}

export default LoginPage;
