import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema, type SigninFormValues } from '../utils/validate';
import useLocalStorage from '../hooks/useLocalStorage';

const LoginPage = () => {
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage<{
    email: string;
    nickname: string;
  } | null>('user', null);

  const {
    register, //input에 연결하는 함수
    handleSubmit, //제출 처리 함수
    formState: { errors, isValid }, //에러상태, 유효성 여부
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema), //zod 스미카 연결
    mode: 'onChange', //입력할 때마다 실시간 검사
  });

  const onSubmit = (data: SigninFormValues) => {
    setUser({
      email: data.email,
      nickname: data.email.split('@')[0],
    });
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="relative flex items-center justify-center py-4 border-b border-gray-200">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ＜
        </button>
        <h1 className="text-lg font-semibold">로그인</h1>
      </div>

      {/* 폼 */}
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="flex flex-col gap-3 w-[300px]">
          <input
            {...register('email')}
            className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
              ${errors?.email ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
            type="email"
            placeholder="이메일을 입력해주세요!"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}
          <input
            {...register('password')}
            className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
              ${errors.password ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
          />
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            className="w-full bg-blue-300 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-500 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
