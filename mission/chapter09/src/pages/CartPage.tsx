import CartItemCard from '../components/CartItemCard';
import {
  calculateTotals,
  clearCart,
  decrease,
  increase,
  removeItem,
} from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function CartPage() {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  const handleIncrease = (id: string) => {
    dispatch(increase(id));
    dispatch(calculateTotals());
  };

  const handleDecrease = (id: string) => {
    dispatch(decrease(id));
    dispatch(calculateTotals());
  };

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
    dispatch(calculateTotals());
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Shopping Cart</h1>
          <p className="mt-2 text-sm text-gray-400">
            Redux Toolkit으로 관리되는 LP 장바구니입니다.
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
          >
            전체 삭제
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#1a1a1a]/50 px-6 py-16 text-center">
          <p className="text-lg font-medium text-gray-300">장바구니가 비어 있습니다.</p>
          <p className="mt-2 text-sm text-gray-500">음반을 추가해 보세요.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <section className="flex flex-col gap-4" aria-label="장바구니 목록">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            ))}
          </section>

          <aside className="h-fit rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-white">주문 요약</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-400">
                <dt>총 수량</dt>
                <dd className="font-semibold text-white">{amount}장</dd>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base">
                <dt className="font-medium text-gray-300">총 금액</dt>
                <dd className="text-xl font-bold text-pink-400">
                  {total.toLocaleString('ko-KR')}원
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CartPage;
