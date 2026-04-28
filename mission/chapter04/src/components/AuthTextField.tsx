import type { ChangeEventHandler } from 'react';
import * as styles from '../styles/ui.css';

export const AUTH_TEXT_FIELD_TYPES = ['email', 'password', 'text'] as const;

export type AuthTextFieldType = (typeof AUTH_TEXT_FIELD_TYPES)[number];

export type AuthTextFieldProps = {
  id: string;
  label: string;
  type?: AuthTextFieldType;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: () => void;
};

function cn(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function AuthTextField({
  id,
  label,
  type = 'text',
  name,
  autoComplete,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
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
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error ? <p className={styles.loginError}>{error}</p> : null}
    </div>
  );
}

export default AuthTextField;
