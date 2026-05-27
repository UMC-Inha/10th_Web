// src/layouts/RootLayout.tsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from '../context/AuthContext';

const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <AuthProvider>
      <div className="bg-[#111111] min-h-screen text-white">
        {/* 헤더 */}
        <Navbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)} 
          onSearchChange={(keyword) => setSearchKeyword(keyword)}
        />

        {/* 사이드바 */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 메인 콘텐츠 - 데스크탑에서는 사이드바 너비만큼 margin */}
        <main className="pt-14 lg:ml-52 min-h-screen">
          <div className="p-6">
            <Outlet context={{searchKeyword}}/>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
};

export default RootLayout;