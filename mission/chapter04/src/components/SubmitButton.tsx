import type { ReactNode } from 'react';

export type SubmitButtonProps = {
  children: ReactNode;
  disabled?: boolean;
};

function SubmitButton({ children, disabled }: SubmitButtonProps) {
  return (
    <button type="submit" className="login__submit" disabled={disabled}>
      {children}
    </button>
  );
}

export default SubmitButton;
