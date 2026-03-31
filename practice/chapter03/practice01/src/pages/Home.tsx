import { navigate } from '../router';

export function Home() {
  return (
    <div>
      <h1>홈 페이지</h1>
      <p>History API로 구현한 SPA입니다.</p>
      <button onClick={() => navigate('/about')}>About으로 이동</button>
      <button onClick={() => navigate('/posts')}>Posts로 이동</button>
    </div>
  );
}
