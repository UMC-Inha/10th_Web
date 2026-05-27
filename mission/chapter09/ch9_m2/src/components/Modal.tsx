import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart, calculateTotals } from '../features/cart/cartSlice';

export default function Modal() {
  const dispatch = useDispatch<AppDispatch>();

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(calculateTotals());
    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-80 flex flex-col items-center gap-6">
        <p className="text-gray-800 font-semibold text-lg text-center">
          장바구니를 전체 비우시겠습니까?
        </p>
        <div className="flex gap-4 w-full">
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
          >
            네
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}
