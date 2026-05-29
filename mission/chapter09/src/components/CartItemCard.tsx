import type { CartItem } from '../types/cart';

interface CartItemCardProps {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

function formatPrice(price: string) {
  return `${Number(price).toLocaleString('ko-KR')}원`;
}

function CartItemCard({ item, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
  const lineTotal = item.amount * Number(item.price);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 shadow-lg sm:flex-row sm:items-center">
      <img
        src={item.img}
        alt={`${item.title} 앨범 커버`}
        className="h-32 w-32 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-white sm:text-lg">{item.title}</h3>
        <p className="mt-1 truncate text-sm text-gray-400">{item.singer}</p>
        <p className="mt-2 text-sm font-medium text-pink-400">
          {formatPrice(item.price)}
          <span className="ml-2 text-gray-500">
            × {item.amount} = {lineTotal.toLocaleString('ko-KR')}원
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#111] text-lg font-bold text-white transition-colors hover:border-pink-500 hover:text-pink-400"
            aria-label={`${item.title} 수량 감소`}
          >
            −
          </button>
          <span className="min-w-8 text-center text-base font-semibold text-white">
            {item.amount}
          </span>
          <button
            type="button"
            onClick={() => onIncrease(item.id)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#111] text-lg font-bold text-white transition-colors hover:border-pink-500 hover:text-pink-400"
            aria-label={`${item.title} 수량 증가`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          삭제
        </button>
      </div>
    </article>
  );
}

export default CartItemCard;
