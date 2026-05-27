interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'google'; // 버튼 종류
  type?: 'button' | 'submit';
  className?: string;
}

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = '',
}: ButtonProps) => {
  // variant에 따라 스타일 다르게
  const variantStyles = {
    // 파란 버튼 (로그인, 다음, 회원가입 등)
    primary:
      'w-full bg-blue-300 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-500 transition-colors cursor-pointer disabled:bg-gray-300',
    // 테두리 버튼 (로그아웃 등)
    secondary:
      'px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors cursor-pointer',
    // 구글 버튼
    google:
      'w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
