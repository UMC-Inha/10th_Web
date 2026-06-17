import { clearCart } from '../features/cart/cartSlice';
import { closeModal } from '../features/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function Modal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isOpen);

  if (!isOpen) {
    return null;
  }

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-cart-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl">
        <h2 id="clear-cart-modal-title" className="text-lg font-bold text-white">
          장바구니 전체 삭제
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          장바구니에 담긴 모든 음반을 삭제하시겠습니까?
          <br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:border-white/40 hover:text-white"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
