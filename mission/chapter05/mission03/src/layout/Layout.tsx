import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      <Navbar />
      <main
        className={`flex-1 [scrollbar-color:theme(colors.gray.700)_theme(colors.gray.950)] ${pathname === '/' ? 'overflow-y-auto' : 'overflow-y-scroll'}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
