import useLocalStorage from '../hooks/useLocalStorage';

const HomePage = () => {
  const [user] = useLocalStorage<{ email: string; nickname: string } | null>(
    'user',
    null,
  );

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="flex flex-col items-center gap-4">
        <div className="text-8xl">🌸</div>
        <h1 className="text-3xl font-bold text-blue-400">환영해요!</h1>
        <p className="text-gray-400 text-sm">
          {user
            ? `${user.nickname}님, 반갑습니다 😊`
            : '로그인하고 시작해보세요!'}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
