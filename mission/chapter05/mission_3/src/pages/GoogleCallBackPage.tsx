import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // window.location.search 대신 useSearchParams 사용
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const name = searchParams.get('name') || '';
    const userId = searchParams.get('userId') || '';

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
