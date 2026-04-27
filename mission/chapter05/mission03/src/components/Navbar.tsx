import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black border-b border-zinc-900">
      <Link to="/" className="text-pink-500 font-black text-lg tracking-tight">
        돌려돌려LP판
      </Link>
      <div className="flex gap-3">
        <Link
          to="/login"
          className="px-4 py-2 text-sm text-white border border-zinc-600 rounded-lg hover:border-zinc-400 transition-colors"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 text-sm text-white bg-pink-600 rounded-lg hover:bg-pink-500 transition-colors font-semibold"
        >
          회원가입
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;