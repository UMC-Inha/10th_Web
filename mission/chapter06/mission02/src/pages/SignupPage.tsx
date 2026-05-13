import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { postSignup } from '../apis/auth'; // [1] 함수명 수정
import { useLocalStorage } from '../hooks/useLocalStorage'; // 프로젝트 설정에 따른 사용
import { LOCAL_STORAGE_KEY } from '../constants/key'; // 키 관리용

import EmailStep from '../components/signup/EmailStep';
import PasswordStep from '../components/signup/PasswordStep';
import NicknameStep from '../components/signup/NicknameStep';

type Step = 'email' | 'password' | 'nickname';

interface SignupForm {
  email: string;
  password: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [form, setForm] = useState<SignupForm>({ email: '', password: '' });
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 로컬스토리지 훅 사용 (AuthContext 로직과 일관성 유지)
  const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const handleEmailNext = (value: string) => {
    setForm(prev => ({ ...prev, email: value }));
    setStep('password');
  };

  const handlePasswordNext = (value: string) => {
    setForm(prev => ({ ...prev, password: value }));
    setStep('nickname');
  };

  const handleSignup = async (name: string) => {
    try {
      setIsLoading(true);
      setServerError(null);

      // [2] API 호출: 설계한 RequestSignupDto 형식에 맞춰 전달
      const data = await postSignup({ 
        email: form.email, 
        password: form.password, 
        passwordConfirm: form.password, // 비밀번호 확인은 일단 동일하게 전달
        name: name 
      });

      // [3] 토큰 저장 및 이동
      // 만약 회원가입 즉시 로그인이 되는 서버 로직이라면 토큰을 저장합니다.
      if (data) {
        // 백엔드 응답 구조에 따라 data.accessToken 등이 있는지 확인 필요!
        // 보통 회원가입 후에는 바로 로그인 페이지로 보내기도 합니다.
        // 👈 여기서 변수를 사용하면 경고가 사라집니다!
        setAccessToken(data.data.accessToken); 
        setRefreshToken(data.data.refreshToken);
        alert("회원가입이 완료되었습니다. 로그인해 주세요!");
        navigate('/login');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? '회원가입에 실패했습니다.');
      } else {
        setServerError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'password') setStep('email');
    else if (step === 'nickname') setStep('password');
    else navigate(-1);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center mb-10 relative">
          <button
            onClick={handleBack}
            className="absolute left-0 text-white text-xl hover:text-pink-400 transition-colors w-8 h-8 flex items-center justify-center"
          >
            ‹
          </button>
          <h1 className="text-white text-lg font-semibold w-full text-center">회원가입</h1>
        </div>

        {serverError && (
          <p className="text-red-400 text-xs text-center mb-4">{serverError}</p>
        )}

        {/* 단계별 컴포넌트 렌더링 */}
        {step === 'email' && <EmailStep onNext={handleEmailNext} />}
        {step === 'password' && <PasswordStep email={form.email} onNext={handlePasswordNext} />}
        {step === 'nickname' && <NicknameStep onSubmit={handleSignup} isLoading={isLoading} />}
      </div>
    </div>
  );
};

export default SignupPage;