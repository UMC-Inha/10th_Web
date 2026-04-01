import { Link } from "react-router-dom";

const NotFound = () => (
  <main style={{ padding: 24 }}>
    <h1>페이지를 찾을 수 없어요 (404)</h1>
    <p>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
    <Link to="/">
      <button>홈으로 이동</button>
    </Link>
  </main>
);

export default NotFound;
