import { useDispatch } from 'react-redux';
import { type ICartItem } from '../constants/cartItems';
import { increase, decrease, removeItem } from '../features/cart/cartSlice';

interface CartItemProps {
  item: ICartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between border-b border-zinc-100 py-4 px-2">
      {/* 좌측: 음반 이미지와 정보 */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img 
          src={item.img} 
          alt={item.title} 
          className="w-16 h-16 object-cover rounded-md shadow-sm flex-shrink-0"
        />
        <div className="min-w-0">
          <h4 className="font-bold text-zinc-800 truncate text-sm md:text-base">{item.title}</h4>
          <p className="text-xs text-zinc-500 truncate mt-0.5">{item.singer}</p>
          <p className="text-sm font-bold text-zinc-700 mt-1">₩{parseInt(item.price).toLocaleString()}</p>
        </div>
      </div>

      {/* 우측: 수량 조절 버튼 섹션 */}
      <div className="flex items-center bg-zinc-100 rounded-md p-1 border border-zinc-200">
        <button
          onClick={() => dispatch(decrease(item.id))}
          className="w-6 h-6 flex items-center justify-center bg-zinc-300 rounded hover:bg-zinc-400 text-zinc-700 font-bold text-sm transition-colors"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-bold text-zinc-800">
          {item.amount}
        </span>
        <button
          onClick={() => dispatch(increase(item.id))}
          className="w-6 h-6 flex items-center justify-center bg-zinc-300 rounded hover:bg-zinc-400 text-zinc-700 font-bold text-sm transition-colors"
        >
          +
        </button>
                <button onClick={()=> dispatch(removeItem(item.id))}
                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors text-lg font-medium cursor-pointer"
                title="장바구니에서 삭제">         
                X
        </button>
      </div>
    </div>
  );
}