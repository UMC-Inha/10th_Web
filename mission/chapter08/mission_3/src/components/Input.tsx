import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, errorMessage, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={ref}
          className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
            ${hasError ? 'border-red-500 bg-red-100' : 'border-gray-300'}
            ${className}`}
          {...rest}
        />

        {hasError && errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;