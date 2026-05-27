import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'google';
}

const Button = ({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...rest
}: ButtonProps) => {
  const variantStyles = {
    primary:
      'w-full bg-blue-300 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-500 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary:
      'px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed',
    google:
      'w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed',
  };

  return (
    <button
      disabled={disabled}
      className={`${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
