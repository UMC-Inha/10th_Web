import type { UseFormRegisterReturn } from 'react-hook-form';
import * as styles from '../styles/ui.css';

export const AUTH_TEXT_FIELD_TYPES = ['email', 'password', 'text'] as const;

export type AuthTextFieldType = (typeof AUTH_TEXT_FIELD_TYPES)[number];

export type AuthTextFieldProps = {
  id: string;
  label: string;
  type?: AuthTextFieldType;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
};

function cn(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function AuthTextField({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  error,
  registration,
}: AuthTextFieldProps) {
  return (
    <div className={styles.loginField}>
      <label className={styles.loginLabel} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={cn(styles.loginInput, error && styles.loginInputError)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...registration}
      />
      {error ? <p className={styles.loginError}>{error}</p> : null}
    </div>
  );
}

export default AuthTextField;
