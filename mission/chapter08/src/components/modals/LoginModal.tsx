import { useNavigate } from 'react-router';
import { ROUTES } from '../../constants/paths';
import ModalOverlay from '../ui/ModalOverlay';

type LoginModalProps = {
  from?: string;
};

function LoginModal({ from }: LoginModalProps) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate(ROUTES.authSignin, { state: { from: from ?? ROUTES.home } });
  };

  const handleClose = () => navigate(-1);

  return (
    <ModalOverlay onClose={handleClose} labelledBy="login-modal-title">
      <div className="w-80 rounded-2xl bg-[#1e1e1e] p-6 shadow-2xl border border-white/10">
        <h2 id="login-modal-title" className="mb-2 text-lg font-bold text-white">로그인이 필요합니다</h2>
        <p className="mb-6 text-sm text-slate-400">
          이 페이지를 보려면 로그인이 필요합니다.
          <br />
          로그인 페이지로 이동하시겠습니까?
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg border border-white/20 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-pink-500 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

export default LoginModal;
