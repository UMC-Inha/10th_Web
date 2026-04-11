import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { isLoggedIn, handleSignOut } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100 px-10 py-4 flex items-center justify-between">
      <Link
        to="/"
        className="text-neutral-800 font-medium text-sm tracking-[0.2em] uppercase hover:text-neutral-500 transition-colors duration-300"
      >
        Kasa
      </Link>

      {isLoggedIn ? (
        <button
          onClick={handleSignOut}
          className="text-neutral-400 text-xs tracking-[0.15em] uppercase hover:text-neutral-800 transition-colors duration-300"
        >
          Logout
        </button>
      ) : (
        <div className="flex items-center gap-6">
          <Link
            to="/signup"
            className="text-neutral-400 text-xs tracking-[0.15em] uppercase hover:text-neutral-800 transition-colors duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="text-neutral-400 text-xs tracking-[0.15em] uppercase hover:text-neutral-800 transition-colors duration-300"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
