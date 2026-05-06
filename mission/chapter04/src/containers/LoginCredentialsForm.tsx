import AuthSubmitButton from '../components/AuthSubmitButton';
import AuthTextField from '../components/AuthTextField';
import { useLoginForm } from '../hooks/useLoginForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import * as styles from '../styles/ui.css';
import type { AuthSession } from '../types/authStorage';

const AUTH_SESSION_KEY = 'chapter04-auth-session';

export type LoginCredentialsFormProps = {
  onSuccess?: () => void;
};

function LoginCredentialsForm({ onSuccess }: LoginCredentialsFormProps) {
  const { register, handleSubmit, formState, canSubmit } = useLoginForm();
  const { setValue: setAuthSession } = useLocalStorage<AuthSession | null>(AUTH_SESSION_KEY, null);

  const handleLoginSubmit = handleSubmit((values) => {
    setAuthSession({
      email: values.email,
      token: `mock-token-${Date.now()}`,
      loggedInAt: new Date().toISOString(),
    });
    onSuccess?.();
  });

  const emailRegistration = register('email');
  const passwordRegistration = register('password');

  const emailError = formState.errors.email?.message;
  const passwordError = formState.errors.password?.message;

  const normalizedError = (error?: string) => {
    return typeof error === 'string' ? error : undefined;
  };

  return (
    <form className={styles.loginForm} onSubmit={handleLoginSubmit} noValidate>
      <AuthTextField
        id="login-email"
        label="이메일"
        type="email"
        autoComplete="email"
        placeholder="example@email.com"
        error={normalizedError(emailError)}
        registration={emailRegistration}
      />
      <AuthTextField
        id="login-password"
        label="비밀번호"
        type="password"
        autoComplete="current-password"
        placeholder="비밀번호를 입력하세요"
        error={normalizedError(passwordError)}
        registration={passwordRegistration}
      />
      <AuthSubmitButton disabled={!canSubmit}>로그인</AuthSubmitButton>
    </form>
  );
}

export default LoginCredentialsForm;
