import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signup } from '../api/authApi';
import { useLocalStorage } from '../hooks/useLocalStorage';
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

  const { setValue: setAccessToken } = useLocalStorage<string>('accessToken', '');
  const { setValue: setRefreshToken } = useLocalStorage<string>('refreshToken', '');

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
      const data = await signup({ ...form, passwordConfirm: form.password, name });
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      navigate('/');
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

        {step === 'email' && <EmailStep onNext={handleEmailNext} />}
        {step === 'password' && <PasswordStep email={form.email} onNext={handlePasswordNext} />}
        {step === 'nickname' && <NicknameStep onSubmit={handleSignup} isLoading={isLoading} />}
      </div>
    </div>
  );
};

export default SignupPage;