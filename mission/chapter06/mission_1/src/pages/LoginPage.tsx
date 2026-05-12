import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema, type SigninFormValues } from '../utils/validate';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios'; //
import Button from '../components/Button';
import Input from '../components/Input';
import { useLocation } from 'react-router-dom';

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

  // 원래 가려던 페이지 확인 (없으면 홈으로)
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const onSubmit = async (data: SigninFormValues) => {
    try {
      const response = await axiosInstance.post('/auth/signin', {
        email: data.email,
        password: data.password,
      });

      const { name, accessToken, refreshToken } = response.data.data;

      login({ email: data.email, nickname: name }, accessToken, refreshToken);

      navigate(from, { replace: true }); // 원래 페이지로 이동
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const onGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
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
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            variant="primary"
          >
            로그인
          </Button>
          {/* 구글 로그인 버튼 */}
          <Button onClick={onGoogleLogin} variant="google">
            <img
              src="https://www.google.com/favicon.ico"
              alt="google"
              style={{ width: '18px', height: '18px' }}
            />
            구글로 로그인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
