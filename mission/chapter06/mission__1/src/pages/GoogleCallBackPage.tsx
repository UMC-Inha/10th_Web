import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const name = params.get('name') || '';
    const userId = params.get('userId') || '';

    if (accessToken && refreshToken) {
      login({ email: userId, nickname: name }, accessToken, refreshToken);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-400">로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallbackPage;
