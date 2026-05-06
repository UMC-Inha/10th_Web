import { useState } from 'react';
import { useCustomFetchQuery } from '../hooks/useCustomFetchQuery';

interface WelcomeData {
  id: number;
  name: string;
  email: string;
}

export const WelcomeDataQuery = () => {
  const [userId, setUserId] = useState(1);

  const { data, isPending, isError } = useCustomFetchQuery<WelcomeData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );

  const handleChangeUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  const handleTestRetry = () => {
    setUserId(999999);
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error Occurred</div>;
  }

  return (
    <div>
      <button onClick={handleChangeUser}>다른 사용자 불러오기</button>
      <button onClick={handleTestRetry}>재시도 테스트</button>

      <h1>{data?.name}</h1>
      <p>{data?.email}</p>
      <p>User ID: {data?.id}</p>
    </div>
  );
};