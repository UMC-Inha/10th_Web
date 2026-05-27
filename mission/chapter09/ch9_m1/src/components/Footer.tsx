import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { clearCart, calculateTotals } from '../store/cartSlice';

export default function Footer() {
  const { amount, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const handleClear = () => {
    dispatch(clearCart());
    dispatch(calculateTotals());
  };

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-5 mt-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        <div className="flex justify-between text-gray-700 text-sm">
          <span>총 수량</span>
          <span className="font-bold">{amount}개</span>
        </div>
        <div className="flex justify-between text-gray-700 text-sm">
          <span>총 금액</span>
          <span className="font-bold text-indigo-600">{total.toLocaleString()}원</span>
        </div>
        <button
          onClick={handleClear}
          className="w-full mt-2 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition cursor-pointer"
        >
          전체 삭제
        </button>
      </div>
    </footer>
  );
}
