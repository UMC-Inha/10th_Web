import { forwardRef } from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
}

// forwardRef → react-hook-form의 register가 ref를 전달할 수 있게 해줌
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', placeholder, hasError = false, errorMessage, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm outline-none
            ${hasError ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
          {...rest}
        />
        {/* 에러 메시지 있으면 자동으로 표시 */}
        {hasError && errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
      </div>
    );
  }
);

export default Input;