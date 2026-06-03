import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
  const amount = useCartStore((state) => state.amount);

  return (
    <nav className="h-[84px] bg-slate-800 text-white">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4">
        <h1 className="text-4xl font-bold">Ohtani Ahn</h1>

        <div className="flex items-center gap-2 text-3xl font-bold">
          <span>🛒</span>
          <span>{amount}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;