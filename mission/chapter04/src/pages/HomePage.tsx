import { Link } from 'react-router';

function HomePage() {
  return (
    <div className="home">
      <h1 className="home__title">홈</h1>
      <p className="home__desc">로그인 화면으로 이동한 뒤, 왼쪽 상단 뒤로 가기로 이 페이지로 돌아올 수 있어요.</p>
      <Link className="home__link" to="/login">
        로그인으로 이동
      </Link>
    </div>
  );
}

export default HomePage;
