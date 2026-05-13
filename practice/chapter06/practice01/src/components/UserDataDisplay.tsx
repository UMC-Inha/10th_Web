// src/components/WelcomeData.tsx

import { useState } from 'react';
import { useCustomFetch } from '../hooks/useCustomFetch';

interface WelcomeData {
  id: number;
  name: string;
  email: string;
}

export const WelcomeData = () => {
  const [userId, setUserId] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleChangeUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  const handleTestRetry = () => {
    setUserId(999999);
  };

  return (
    <div className="p-5">
      <div className="mb-5 flex flex-wrap gap-2.5">
        <button 
          onClick={handleChangeUser}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition"
        >
          다른 사용자 불러오기
        </button>
        
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition"
        >
          컴포넌트 토글 (언마운트 테스트)
        </button>
        
        <button
          onClick={handleTestRetry}
          className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 transition"
        >
          재시도 테스트 (404 에러)
        </button>
      </div>

      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
}

const UserDataDisplay = ({ userId }: { userId: number }) => {
  const { data, isPending, isError } = useCustomFetch<WelcomeData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) {
    return <div className="text-blue-500 animate-pulse">Loading... (User ID: {userId})</div>;
  }

  if (isError) {
    return <div className="text-red-500 font-bold">Error Occurred</div>;
  }

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-sm bg-white">
      <h1 className="text-2xl font-bold text-gray-800">{data?.name}</h1>
      <p className="text-gray-600">{data?.email}</p>
      <p className="text-xs text-gray-400 mt-2">User ID: {data?.id}</p>
    </div>
  );
};