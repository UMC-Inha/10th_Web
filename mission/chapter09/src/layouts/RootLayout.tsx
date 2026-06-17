import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#111111] text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Modal />
    </div>
  );
}

export default RootLayout;
