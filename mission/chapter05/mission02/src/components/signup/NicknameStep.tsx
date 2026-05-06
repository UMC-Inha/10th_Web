import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nicknameSchema, type NicknameFormValues } from '../../schemas/authSchema';

interface Props {
  onSubmit: (name: string) => void;
  isLoading: boolean;
}

const NicknameStep = ({ onSubmit, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data.name))} className="flex flex-col gap-4 items-center">
      {/* 프로필 이미지 자리 */}
      <div className="w-24 h-24 rounded-full bg-zinc-300 flex items-center justify-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <input
          {...register('name')}
          type="text"
          placeholder="닉네임을 입력해주세요!"
          className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-pink-500 transition-colors"
        />
        {errors.name && (
          <p className="text-red-400 text-xs pl-1">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full py-3 rounded-lg text-sm font-semibold transition-all
          disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed
          enabled:bg-pink-600 enabled:text-white enabled:hover:bg-pink-500"
      >
        {isLoading ? '처리 중...' : '회원가입 완료'}
      </button>
    </form>
  );
};

export default NicknameStep;