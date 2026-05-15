import { useState } from 'react';
import { Outlet } from 'react-router';
import LpCreateModal from '../components/modals/LpCreateModal';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { loggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 플로팅 + 버튼 */}
      {loggedIn && (
        <button
          onClick={() => setCreateModalOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-colors text-2xl font-light"
          aria-label="LP 추가"
        >
          +
        </button>
      )}

      {createModalOpen && (
        <LpCreateModal onClose={() => setCreateModalOpen(false)} />
      )}
    </div>
  );
}

export default AppLayout;
