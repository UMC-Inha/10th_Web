import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '../utils/validate';
import axiosInstance from '../api/axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // 서버에 회원가입 요청
      await axiosInstance.post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // 회원가입 성공 → 로그인 페이지로 이동
      alert('회원가입 성공! 로그인 해주세요 😊');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  const email = watch('email');
  const password = watch('password');
  const passwordCheck = watch('passwordCheck');
  const name = watch('name');

  const isStep1Valid = !errors.email && email?.length > 0;
  const isStep2Valid =
    !errors.password &&
    !errors.passwordCheck &&
    password?.length > 0 &&
    passwordCheck?.length > 0 &&
    password === passwordCheck;
  const isStep3Valid = !errors.name && name?.length > 0;

  return (
    <div className="flex flex-col h-full">
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
                <div className="text-red-500 text-sm">{errors.email.message}</div>
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
                <div className="text-red-500 text-sm">{errors.password.message}</div>
              )}
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
                <div className="text-red-500 text-sm">비밀번호가 일치하지 않습니다</div>
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

          {step === 3 && (
            <>
              <input
                {...register('name')}
                className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
                  ${errors.name ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
                type="text"
                placeholder="이름을 입력해주세요!"
              />
              {errors.name && (
                <div className="text-red-500 text-sm">{errors.name.message}</div>
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