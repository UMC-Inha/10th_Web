import type { UseFormRegisterReturn } from 'react-hook-form';

type AuthInputProps = {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'url';
  placeholder?: string;
  autoComplete?: string;
  registration: UseFormRegisterReturn;
  error?: string;
};

function AuthInput({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  registration,
  error,
}: AuthInputProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
            : 'border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
        }`}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...registration}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export default AuthInput;
