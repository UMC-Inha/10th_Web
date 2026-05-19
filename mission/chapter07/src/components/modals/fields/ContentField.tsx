import { useLpFormContext } from '../LpFormContext';

type ContentFieldProps = {
  id?: string;
};

export function ContentField({ id = 'lp-content' }: ContentFieldProps) {
  const { content, setContent, errors } = useLpFormContext();

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        내용 <span className="text-pink-500">*</span>
      </label>
      <textarea
        id={id}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="LP에 대해 설명해주세요..."
        rows={4}
        className={[
          'w-full resize-none rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50',
          errors.content ? 'border-red-500/60' : 'border-white/10',
        ].join(' ')}
      />
      {errors.content && (
        <p className="mt-1 text-xs text-red-400">{errors.content}</p>
      )}
    </div>
  );
}
