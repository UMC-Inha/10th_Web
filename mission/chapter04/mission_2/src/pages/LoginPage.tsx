import { useNavigate } from 'react-router-dom';
import { validateSignin, type UserSignInformation } from '../utils/validate';
import useForm from '../hooks/useForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { values, errors, touched, getInputProps } =
    useForm<UserSignInformation>({
      initialValue: {
        email: '',
        password: '',
      },
      validate: validateSignin,
    });

  const handleSubmit = () => {};

  //버튼 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === '');

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
            {...getInputProps('email')}
            className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
              ${errors?.email && touched?.email ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
            type="email"
            placeholder="이메일을 입력해주세요!"
          />
          {errors?.email && touched?.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}
          <input
            {...getInputProps('password')}
            className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
              ${errors?.password && touched?.password ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
          />
          {errors?.password && touched?.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
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
