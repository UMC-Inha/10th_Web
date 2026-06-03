import { useDispatch } from 'react-redux';
import { decrease, increase, removeItem } from '../store/cartSlice';
import type { CartItemType } from '../constants/cartItems';

const CartItem = ({ id, title, singer, price, img, amount }: CartItemType) => {
  const dispatch = useDispatch();

  return (
    <article className="flex items-center justify-between border-b border-gray-200 py-5">
      <div className="flex items-center gap-5">
        <img
          src={img}
          alt={title}
          className="h-[100px] w-[100px] rounded object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold text-black">{title}</h2>
          <p className="text-lg text-slate-500">{singer}</p>
          <p className="text-xl font-bold text-slate-700">${price}</p>

          <button
            onClick={() => dispatch(removeItem(id))}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => dispatch(decrease(id))}
          className="h-10 w-10 rounded-l bg-slate-300 text-xl font-medium"
        >
          -
        </button>

        <span className="flex h-10 w-12 items-center justify-center border border-gray-300 text-xl">
          {amount}
        </span>

        <button
          onClick={() => dispatch(increase(id))}
          className="h-10 w-10 rounded-r bg-slate-300 text-xl font-medium"
        >
          +
        </button>
      </div>
    </article>
  );
};

export default CartItem;