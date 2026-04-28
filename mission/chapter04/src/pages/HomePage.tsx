import { Link } from 'react-router';
import * as styles from '../styles/ui.css';

function HomePage() {
  return (
    <div className={styles.home}>
      <h1 className={styles.homeTitle}>홈</h1>
      <p className={styles.homeDesc}>로그인·회원가입 화면으로 이동한 뒤, 왼쪽 상단 뒤로 가기로 이 페이지로 돌아올 수 있어요.</p>
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
