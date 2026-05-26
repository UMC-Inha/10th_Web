import ModalOverlay from '../ui/ModalOverlay';

type ConfirmModalProps = {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <ModalOverlay onClose={onCancel} labelledBy="confirm-modal-title">
      <div className="w-80 rounded-2xl bg-[#1e1e1e] p-6 shadow-2xl border border-white/10">
        <h2 id="confirm-modal-title" className="mb-3 text-lg font-bold text-white">확인</h2>
        <p className="mb-6 text-sm text-slate-300 whitespace-pre-line">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/20 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

export default ConfirmModal;
