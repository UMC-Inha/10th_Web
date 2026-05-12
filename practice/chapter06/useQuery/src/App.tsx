import { useState } from 'react';
import { useCustomFetch } from './hooks/useCustomFetch';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const App = () => {
  const [userId, setUserId] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const handleChangeUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  const handleTestRetry = () => {
    setUserId(999999);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>useCustomFetch 테스트</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handleChangeUser}>다른 사용자 불러오기</button>

        <button onClick={() => setIsVisible((prev) => !prev)}>
          컴포넌트 토글
        </button>

        <button onClick={handleTestRetry}>재시도 테스트</button>
      </div>

      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
};

const UserDataDisplay = ({ userId }: { userId: number }) => {
  const { data, isPending, isError } = useCustomFetch<UserData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );

  if (isPending) {
    return <div>Loading... User ID: {userId}</div>;
  }

  if (isError) {
    return <div>Error Occurred</div>;
  }

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>{data?.email}</p>
      <p>User ID: {data?.id}</p>
    </div>
  );
};

export default App;
