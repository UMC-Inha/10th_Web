import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import useSidebar from '../hooks/useSidebar';

const HomeLayout = () => {
  const { isOpen, open, close } = useSidebar();

  return (
    <div className="h-dvh flex flex-col">
      <Navbar onMenuClick={open} />
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 - md 이상에서는 항상 보임 */}
        <aside className="hidden md:flex w-52 border-r border-gray-200 flex-col shrink-0">
          <Sidebar isOpen={true} isStatic={true} onClose={() => {}} />
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 모바일 사이드바 */}
      <div className="md:hidden">
        <Sidebar isOpen={isOpen} onClose={close} />
      </div>
    </div>
  );
};

export default HomeLayout;