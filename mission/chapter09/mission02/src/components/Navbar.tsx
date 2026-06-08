import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

export default function Navbar() {
  const amount = useSelector((state: RootState) => state.cart.amount);

  return (
    <nav className="w-full bg-[#1e293b] text-white px-8 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold tracking-wide">Ohtani Ahn</h1>
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <span className="text-xl">🛒</span>
        <span className="bg-zinc-700 text-white font-bold px-3 py-0.5 rounded-full text-sm">
          {amount}
        </span>
      </div>
    </nav>
  );
}