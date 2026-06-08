import useStore from '../store/useStore';

export default function Modal() {

  const {clearCart, closeModal} = useStore();

  return (
    <aside className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-2xl text-center">
        <h4 className="text-zinc-800 font-bold text-lg mb-6">
          정말 삭제하시겠습니까?
        </h4>
        
        <div className="flex justify-center gap-4">
          {/* "아니요" 버튼 -> 모달 닫기 */}
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-zinc-100 text-zinc-600 font-bold rounded-lg hover:bg-zinc-200 transition-colors border border-zinc-200"
          >
            아니요
          </button>
          
          {/* "네" 버튼 -> 장바구니 비우기 + 모달 닫기 */}
          <button
            onClick={() => {
              clearCart();   // 장바구니 비우기 액션 호출
              closeModal(); // 모달 닫기 액션 호출
            }}
            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            네
          </button>
        </div>
      </div>
    </aside>
  );
}