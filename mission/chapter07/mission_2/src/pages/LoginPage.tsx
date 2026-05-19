import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signinSchema, type SigninFormValues } from '../utils/validate';
import { useAuth } from '../context/AuthContext';
import { signin } from '../api/auth';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
  });

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const { mutate: signinMutate, isPending } = useMutation({
    mutationFn: ({ email, password }: SigninFormValues) =>
      signin(email, password),

    onSuccess: (data, variables) => {
      console.log('로그인 응답:', data.data);

      const { name, accessToken, refreshToken, id, userId } = data.data;

      login(
        {
          id: Number(id ?? userId),
          email: variables.email,
          nickname: name,
        },
        accessToken,
        refreshToken,
      );

      navigate(from, { replace: true });
    },

    onError: () => {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    },
  });

  const onSubmit = (data: SigninFormValues) => {
    signinMutate(data);
  };

  const onGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_LOGIN_URL;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex items-center justify-center py-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute left-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ＜
        </button>
        <h1 className="text-lg font-semibold">로그인</h1>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-[300px]"
        >
          <Input
            {...register('email')}
            type="email"
            placeholder="이메일을 입력해주세요!"
            hasError={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <Input
            {...register('password')}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
            hasError={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <Button type="submit" disabled={!isValid || isPending} variant="primary">
            {isPending ? '로그인 중...' : '로그인'}
          </Button>

          <Button type="button" onClick={onGoogleLogin} variant="google">
            <img
              src="https://www.google.com/favicon.ico"
              alt="google"
              style={{ width: '18px', height: '18px' }}
            />
            구글로 로그인
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;