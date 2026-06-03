import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import Modal from './Modal';
import { openModal } from '../features/modal/modalSlice';
import type { RootState } from '../store/store';

const CartContainer = () => {
  const { cartItems, total } = useSelector((state: RootState) => state.cart);
  const { isOpen } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  if (cartItems.length === 0) {
    return (
      <>
        {isOpen && <Modal />}

        <main className="mx-auto w-full max-w-[900px] py-20 text-center">
          <h2 className="text-3xl font-bold">장바구니가 비어 있습니다.</h2>
        </main>
      </>
    );
  }

  return (
    <>
      {isOpen && <Modal />}

      <main className="mx-auto w-full max-w-[900px]">
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}

        <footer className="py-10">
          <div className="mb-8 flex items-center justify-between border-t border-gray-300 pt-6 text-2xl font-bold">
            <span>총 금액</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => dispatch(openModal())}
              className="rounded border border-black px-6 py-4 text-base hover:bg-black hover:text-white"
            >
              전체 삭제
            </button>
          </div>
        </footer>
      </main>
    </>
  );
};

export default CartContainer;
