import { useNavigate } from 'react-router';
import SignupWizardForm from '../containers/SignupWizardForm';
import * as styles from '../styles/ui.css';

function SignupPage() {
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
        <SignupWizardForm onComplete={() => navigate('/')} />
      </main>
    </div>
  );
}

export default SignupPage;
