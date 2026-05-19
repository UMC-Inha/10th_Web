interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

const DeleteConfirmModal = ({ onConfirm, onCancel, isPending }: DeleteConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-2xl w-80 p-6 flex flex-col gap-4">
        <h2 className="text-white text-lg font-bold">정말 탈퇴하시겠습니까?</h2>
        <p className="text-gray-400 text-sm">탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            아니오
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:bg-gray-600"
          >
            {isPending ? '처리 중...' : '예'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;