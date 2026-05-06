import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '../utils/validate';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 현재 단계 (1, 2, 3)
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    watch, // 특정 필드 값을 실시간으로 감시
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SignupFormValues) => {
    login({
      email: data.email,
      nickname: data.nickname,
    });
    navigate('/'); // 회원가입 완료 후 홈으로
  };

  // 각 단계별 유효성 검사
  const email = watch('email');
  const password = watch('password');
  const passwordCheck = watch('passwordCheck');
  const nickname = watch('nickname');

  const isStep1Valid = !errors.email && email?.length > 0;
  const isStep2Valid =
    !errors.password &&
    !errors.passwordCheck &&
    password?.length > 0 &&
    passwordCheck?.length > 0 &&
    password === passwordCheck;
  const isStep3Valid = !errors.nickname && nickname?.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="relative flex items-center justify-center py-4 border-b border-gray-200">
        <button
          onClick={() => (step === 1 ? navigate('/') : setStep(step - 1))}
          className="absolute left-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ＜
        </button>
        <h1 className="text-lg font-semibold">회원가입</h1>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex flex-col gap-3 w-[300px]">
          {/* 1단계: 이메일 */}
          {step === 1 && (
            <>
              <input
                {...register('email')}
                className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
                  ${errors.email ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
                type="email"
                placeholder="이메일을 입력해주세요!"
              />
              {errors.email && (
                <div className="text-red-500 text-sm">
                  {errors.email.message}
                </div>
              )}
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full bg-blue-300 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-500 transition-colors cursor-pointer disabled:bg-gray-300"
              >
                다음
              </button>
            </>
          )}

          {/* 2단계: 비밀번호 */}
          {step === 2 && (
            <>
              <div className="text-gray-500 text-sm">{email}</div>
              <div className="relative">
                <input
                  {...register('password')}
                  className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
      ${errors.password ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요!"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm">
                  {errors.password.message}
                </div>
              )}
              {/*비밀번호 다시 한번 체크 */}
              <div className="relative">
                <input
                  {...register('passwordCheck')}
                  className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
      ${errors.passwordCheck ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
                  type={showPasswordCheck ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력해주세요!"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showPasswordCheck ? '🙈' : '👁️'}
                </button>
              </div>
              {passwordCheck?.length > 0 && password !== passwordCheck && (
                <div className="text-red-500 text-sm">
                  비밀번호가 일치하지 않습니다
                </div>
              )}
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className="w-full bg-blue-300 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-500 transition-colors cursor-pointer disabled:bg-gray-300"
              >
                다음
              </button>
            </>
          )}

          {/* 3단계: 닉네임 */}
          {step === 3 && (
            <>
              <input
                {...register('nickname')}
                className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
                  ${errors.nickname ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
                type="text"
                placeholder="닉네임을 입력해주세요!"
              />
              {errors.nickname && (
                <div className="text-red-500 text-sm">
                  {errors.nickname.message}
                </div>
              )}
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isStep3Valid}
                className="w-full bg-blue-300 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-500 transition-colors cursor-pointer disabled:bg-gray-300"
              >
                회원가입 완료
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
