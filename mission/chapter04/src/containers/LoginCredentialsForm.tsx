import type { FormEvent } from 'react';
import AuthSubmitButton from '../components/AuthSubmitButton';
import AuthTextField from '../components/AuthTextField';
import { useLoginForm } from '../hooks/useLoginForm';
import * as styles from '../styles/ui.css';

function LoginCredentialsForm() {
  const { values, errors, handleChange, handleBlur, canSubmit } = useLoginForm();

  const handleLoginSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
  };

  return (
    <form className={styles.loginForm} onSubmit={handleLoginSubmit} noValidate>
      <AuthTextField
        id="login-email"
        label="이메일"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="example@email.com"
        value={values.email}
        error={errors.email}
        onChange={handleChange('email')}
        onBlur={() => handleBlur('email')}
      />
      <AuthTextField
        id="login-password"
        label="비밀번호"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="비밀번호를 입력하세요"
        value={values.password}
        error={errors.password}
        onChange={handleChange('password')}
        onBlur={() => handleBlur('password')}
      />
      <AuthSubmitButton disabled={!canSubmit}>로그인</AuthSubmitButton>
    </form>
  );
}

export default LoginCredentialsForm;
