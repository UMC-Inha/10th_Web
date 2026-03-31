import { navigate } from '../router';

export function About() {
  return (
    <div>
      <h1>About 페이지</h1>
      <p>History API의 pushState를 이용해 페이지 전환을 구현했습니다.</p>
      <button onClick={() => navigate('/')}>홈으로 이동</button>
    </div>
  );
}
