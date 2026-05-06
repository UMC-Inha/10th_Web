import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';

const RootLayout = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <AuthProvider>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </AuthProvider>

    </div>
  );
};

export default RootLayout;