import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar />
      <main className="px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;