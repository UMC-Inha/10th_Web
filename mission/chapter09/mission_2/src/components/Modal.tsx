import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { closeModal } from '../features/modal/modalSlice';

const Modal = () => {
  const dispatch = useDispatch();

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-md bg-white px-8 py-7 text-center shadow-xl">
        <h2 className="mb-6 text-xl font-bold">정말 삭제하시겠습니까?</h2>

        <div className="flex justify-center gap-5">
          <button
            onClick={() => dispatch(closeModal())}
            className="rounded-md bg-gray-200 px-6 py-3 text-lg text-slate-700 hover:bg-gray-300"
          >
            아니요
          </button>

          <button
            onClick={handleClearCart}
            className="rounded-md bg-red-500 px-6 py-3 text-lg text-white hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;