import { useLpFormContext } from '../LpFormContext';

type TitleFieldProps = {
  id?: string;
};

export function TitleField({ id = 'lp-title' }: TitleFieldProps) {
  const { title, setTitle, errors } = useLpFormContext();

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        제목 <span className="text-pink-500">*</span>
      </label>
      <input
        id={id}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="LP 제목을 입력하세요"
        className={[
          'w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50',
          errors.title ? 'border-red-500/60' : 'border-white/10',
        ].join(' ')}
      />
      {errors.title && (
        <p className="mt-1 text-xs text-red-400">{errors.title}</p>
      )}
    </div>
  );
}
