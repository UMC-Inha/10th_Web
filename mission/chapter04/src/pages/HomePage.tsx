import { Link } from 'react-router';
import { useLocalStorage } from '../hooks/useLocalStorage';
import * as styles from '../styles/ui.css';
import type { AuthSession } from '../types/authStorage';

const AUTH_SESSION_KEY = 'chapter04-auth-session';

function HomePage() {
  const { storedValue: session, removeValue: clearSession } = useLocalStorage<AuthSession | null>(
    AUTH_SESSION_KEY,
    null,
  );

  return (
    <div className={styles.home}>
      <h1 className={styles.homeTitle}>홈</h1>
      <p className={styles.homeDesc}>로그인·회원가입 화면으로 이동한 뒤, 왼쪽 상단 뒤로 가기로 이 페이지로 돌아올 수 있어요.</p>
      {session ? (
        <section className={styles.homeSessionCard}>
          <p className={styles.homeSessionTitle}>로컬 스토리지 저장 정보</p>
          <p className={styles.homeSessionMeta}>이메일: {session.email}</p>
          {session.nickname ? <p className={styles.homeSessionMeta}>닉네임: {session.nickname}</p> : null}
          <p className={styles.homeSessionMeta}>토큰: {session.token}</p>
          <button type="button" className={styles.homeActionButton} onClick={clearSession}>
            저장 정보 삭제
          </button>
        </section>
      ) : null}
      <nav className={styles.homeNav}>
        <Link className={styles.homeLink} to="/login">
          로그인으로 이동
        </Link>
        <Link className={`${styles.homeLink} ${styles.homeLinkSecondary}`} to="/signup">
          회원가입으로 이동
        </Link>
      </nav>
    </div>
  );
}

export default HomePage;
