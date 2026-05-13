// src/layouts/Layout.tsx
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="p-5">
      <nav className="mb-8 flex gap-4 border-b pb-4">
        <Link to="/button" className="text-blue-500 hover:underline">
          버튼 클릭 방식
        </Link>
        <Link to="/auto" className="text-blue-500 hover:underline">
          자동 무한 스크롤
        </Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;