import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
}

export default function MyPage() {
  const { logout } = useAuth();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/v1/users/me')
      .then(({ data }) => setUser(data.data))
      .catch(() => setError('사용자 정보를 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6 text-center">
            {error}
          </p>
        )}

        {user && (
          <>
            {/* Profile header */}
            <div className="text-center mb-6">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-4 ring-lime-400/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-lime-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            </div>

            {/* Info card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              {[
                { label: '소개', value: user.bio ?? '—' },
                { label: '회원 번호', value: `#${user.id}` },
                {
                  label: '가입일',
                  value: new Date(user.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  className={`flex justify-between items-center px-6 py-4 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-500 font-medium rounded-2xl px-4 py-3.5 text-sm transition-all cursor-pointer bg-white shadow-sm"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </div>
  );
}
