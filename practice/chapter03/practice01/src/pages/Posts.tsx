import { navigate } from '../router';

export function Posts() {
  return (
    <div>
      <h1>Posts 페이지</h1>
      <p>브라우저 뒤로가기/앞으로가기 버튼도 동작합니다. (popstate 이벤트)</p>
      <button onClick={() => navigate('/')}>홈으로 이동</button>
    </div>
  );
}
