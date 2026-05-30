import { useEffect} from 'react';
import useStore from './store/useStore';
import Navbar from './components/Navbar';
import CartItem from './components/CartItem';
import Modal from './components/Modal';

export default function App() {
  const cartItems = useStore((state)=>state.cartItems);
  const total = useStore((state)=>state.total);
  const isModalOpen = useStore((state)=> state.isModalOpen);

  const calculateTotals = useStore((state)=>state.calculateTotals);
  const openModal = useStore((state)=>state.openModal);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans relative">
      {isModalOpen && <Modal/>}

      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto bg-white shadow-sm border border-zinc-100 my-6 rounded-xl p-6 flex flex-col">
        <h2 className='text-2xl font-black text-center text-zinc-800 py-6'>당신의 장바구니</h2>
        
        <div className="flex-1 overflow-y-auto pr-1">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-400 font-medium text-lg">장바구니가 텅 비어 있습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />              ))}
            </div>
          )}
        </div>

        {/* 하단 금액 정산 및 전체 삭제 구역 (장바구니에 템이 있을 때만 노출) */}
        {cartItems.length > 0 && (
          <div className="border-t border-zinc-200 mt-6 pt-4 flex flex-col items-center gap-4">
            <div className="w-full flex justify-between items-center px-2">
              <span className="font-bold text-zinc-600">총 결제 금액</span>
              <span className="text-xl font-black text-zinc-900">
                ₩{total.toLocaleString()}
              </span>
            </div>
            
            <button
              onClick={openModal}
              className="px-6 py-2 border border-zinc-300 rounded-md text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors shadow-sm mt-2"
            >
              전체 삭제
            </button>
          </div>
        )}
      </main>
    </div>
  );
}