import type { ReactNode } from 'react';
import * as styles from '../styles/ui.css';

export type AuthSubmitButtonProps = {
  children: ReactNode;
  disabled?: boolean;
};

function AuthSubmitButton({ children, disabled }: AuthSubmitButtonProps) {
  return (
    <button type="submit" className={styles.loginSubmit} disabled={disabled}>
      {children}
    </button>
  );
}

export default AuthSubmitButton;
