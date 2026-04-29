import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema, type SigninFormValues } from '../utils/validate';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios'; //

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SigninFormValues) => {
    try {
      const response = await axiosInstance.post('/auth/signin', {
        email: data.email,
        password: data.password,
      });

      const { name, accessToken, refreshToken } = response.data.data;

      login({ email: data.email, nickname: name }, accessToken, refreshToken);

      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex items-center justify-center py-4 border-b border-gray-200">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ＜
        </button>
        <h1 className="text-lg font-semibold">로그인</h1>
      </div>

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
