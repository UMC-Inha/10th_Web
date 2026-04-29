import type { ChangeEventHandler } from 'react';
import * as styles from '../styles/ui.css';

export type AuthPasswordFieldProps = {
  id: string;
  label: string;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  value: string;
  error?: string;
  visible: boolean;
  onToggleVisible: () => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: () => void;
};

function cn(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function EyeOpenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a21.77 21.77 0 015.06-7.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a21.5 21.5 0 01-4.17 5.79M1 1l22 22" />
    </svg>
  );
}

function AuthPasswordField({
  id,
  label,
  name,
  autoComplete,
  placeholder,
  value,
  error,
  visible,
  onToggleVisible,
  onChange,
  onBlur,
}: AuthPasswordFieldProps) {
  return (
    <div className={styles.loginField}>
      <label className={styles.loginLabel} htmlFor={id}>
        {label}
      </label>
      <div className={styles.loginInputRow}>
        <input
          id={id}
          className={cn(styles.loginInput, styles.loginInputWithAction, error && styles.loginInputError)}
          type={visible ? 'text' : 'password'}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <button
          type="button"
          className={cn(styles.loginVisibilityButton, error && styles.loginVisibilityButtonError)}
          onClick={onToggleVisible}
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>
      {error ? <p className={styles.loginError}>{error}</p> : null}
    </div>
  );
}

export default AuthPasswordField;
