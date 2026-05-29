import { Link } from 'react-router';
import { useAppSelector } from '../store/hooks';

function Navbar() {
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-lg font-bold tracking-tight text-white sm:text-xl">
          UMC Play List
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
          >
            Shopping Cart
            {amount > 0 && (
              <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-pink-600">
                {amount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
