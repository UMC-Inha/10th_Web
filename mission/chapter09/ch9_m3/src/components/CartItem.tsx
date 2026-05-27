import { useCartStore } from '../store/useCartStore';
import type { CartItem as CartItemType } from '../types/cart';

type Props = {
  item: CartItemType;
};

export default function CartItem({ item }: Props) {
  const { increase, decrease, removeItem, calculateTotals } = useCartStore();

  const handleIncrease = () => {
    increase(item.id);
    calculateTotals();
  };

  const handleDecrease = () => {
    decrease(item.id);
    calculateTotals();
  };

  const handleRemove = () => {
    removeItem(item.id);
    calculateTotals();
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
      <img
        src={item.img}
        alt={item.title}
        className="w-16 h-16 rounded-lg object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p>
        <p className="text-gray-500 text-xs truncate">{item.singer}</p>
        <p className="text-indigo-600 font-bold text-sm mt-1">
          {Number(item.price).toLocaleString()}원
        </p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleIncrease}
          className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center hover:bg-indigo-200 transition cursor-pointer"
        >
          +
        </button>
        <span className="text-gray-800 font-semibold text-sm">{item.amount}</span>
        <button
          onClick={handleDecrease}
          className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center hover:bg-indigo-200 transition cursor-pointer"
        >
          −
        </button>
      </div>

      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-500 transition ml-2 cursor-pointer"
        aria-label="삭제"
      >
        ✕
      </button>
    </div>
  );
}
