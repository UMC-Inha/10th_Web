// src/layouts/RootLayout.tsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import useSidebar from '../hooks/useSidebar';
import { AuthProvider } from '../context/AuthContext';

const RootLayout = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { isOpen: sidebarOpen, toggle: toggleSidebar, close: closeSidebar } = useSidebar(false);

  return (
    <AuthProvider>
      <div className="bg-[#111111] min-h-screen text-white">
        {/* 헤더 */}
        <Navbar 
          onMenuClick={toggleSidebar} 
          onSearchChange={(keyword) => setSearchKeyword(keyword)}
        />

        {/* 사이드바 */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
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