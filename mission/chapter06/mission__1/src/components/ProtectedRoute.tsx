import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation(); // 현재 경로 저장
  const [showModal, setShowModal] = useState(true);

  if (!user) {
    // 모달 닫고 로그인으로
    if (!showModal) {
      return <Navigate to="/login" state={{ from: location }} replace />;
      // state={{ from: location }} → 원래 가려던 경로 저장!
    }

    return (
      // 경고 모달
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-80 flex flex-col gap-4">
          <h2 className="text-lg font-bold">로그인이 필요합니다</h2>
          <p className="text-gray-500 text-sm">이 페이지는 로그인 후 이용할 수 있습니다.</p>
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;