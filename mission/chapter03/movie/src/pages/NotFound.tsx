import { Link } from "react-router-dom";

// 404 페이지 컴포넌트
const NotFound = () => (
  <main className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
    <h1 className="text-4xl font-bold mb-4">페이지를 찾을 수 없어요 (404)</h1>
    <p className="mb-8">주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
    <Link to="/">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        홈으로 이동
      </button>
    </Link>
  </main>
);

export default NotFound;
