import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">
        하이하이
      </p>
      <h1 className="text-5xl font-light tracking-[0.15em] text-neutral-800">
        안녕안뇽
      </h1>
      <div className="w-8 h-px bg-neutral-300 mt-2" />
      <p className="text-sm text-neutral-400 tracking-widest">
        useForm 직접 구현하기
      </p>
      {isLoggedIn ? (
        <p className="mt-4 text-xs tracking-[0.2em] text-neutral-500">
          로그인 완료! ㅎ.ㅎ
        </p>
      ) : (
        <div className="flex gap-3 mt-4">
          <Link
            to="/signup"
            className="text-xs tracking-[0.2em] uppercase text-neutral-500 border border-neutral-200 px-6 py-2.5 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="text-xs tracking-[0.2em] uppercase text-neutral-500 border border-neutral-200 px-6 py-2.5 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-300"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
