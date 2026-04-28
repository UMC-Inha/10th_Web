import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <button
        className="border rounded-md cursor-pointer"
        onClick={() => navigate('/login')}
      >
        로그인
      </button>
    </div>
  );
};

export default HomePage;
