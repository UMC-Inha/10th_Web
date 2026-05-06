import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema, type PasswordFormValues } from '../../schemas/authSchema';
import { useState } from 'react';

interface Props {
  email: string;
  onNext: (password: string) => void;
}

const EyeIcon = ({ open }: { open: boolean }) => (
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
);

const PasswordStep = ({ email, onNext }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit((data) => onNext(data.password))} className="flex flex-col gap-4">
      {/* 이메일 표시 */}
      <div className="flex items-center gap-2 text-sm text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="text-zinc-300">{email}</span>
      </div>

      {/* 비밀번호 */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력해주세요!"
            className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-3 pr-10 rounded-lg text-sm focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs pl-1">{errors.password.message}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            {...register('passwordConfirm')}
            type={showConfirm ? 'text' : 'password'}
            placeholder="비밀번호를 다시 한 번 입력해주세요!"
            className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-3 pr-10 rounded-lg text-sm focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>
        {errors.passwordConfirm && (
          <p className="text-red-400 text-xs pl-1">{errors.passwordConfirm.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full py-3 rounded-lg text-sm font-semibold transition-all
          disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed
          enabled:bg-pink-600 enabled:text-white enabled:hover:bg-pink-500"
      >
        다음
      </button>
    </form>
  );
};

export default PasswordStep;