import AuthPasswordField from '../components/AuthPasswordField';
import AuthSubmitButton from '../components/AuthSubmitButton';
import AuthTextField from '../components/AuthTextField';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSignupWizardForm } from '../hooks/useSignupWizardForm';
import * as styles from '../styles/ui.css';
import type { AuthSession } from '../types/authStorage';

export type SignupWizardFormProps = {
  onComplete: () => void;
};

const AUTH_SESSION_KEY = 'chapter04-auth-session';

function SignupWizardForm({ onComplete }: SignupWizardFormProps) {
  const { setValue: setAuthSession } = useLocalStorage<AuthSession | null>(AUTH_SESSION_KEY, null);
  const form = useSignupWizardForm({
    onSubmitSuccess: (values) => {
      setAuthSession({
        email: values.email,
        nickname: values.nickname,
        token: `mock-token-${Date.now()}`,
        loggedInAt: new Date().toISOString(),
      });
      onComplete();
    },
  });

  const emailRegistration = form.register('email');
  const passwordRegistration = form.register('password');
  const passwordConfirmRegistration = form.register('passwordConfirm');
  const nicknameRegistration = form.register('nickname');

  if (form.step === 'email') {
    return (
      <>
        <h1 className={styles.loginHeading}>회원가입</h1>
        <p className={styles.loginSubtitle}>이메일 주소를 입력해 주세요</p>
        <form className={styles.loginForm} onSubmit={form.handleEmailNext} noValidate>
          <AuthTextField
            id="signup-email"
            label="이메일"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            error={typeof form.emailError === 'string' ? form.emailError : undefined}
            registration={emailRegistration}
          />
          <AuthSubmitButton disabled={!form.canGoPasswordStep}>다음</AuthSubmitButton>
        </form>
      </>
    );
  }

  if (form.step === 'password') {
    return (
      <>
        <h1 className={styles.loginHeading}>비밀번호 설정</h1>
        <p className={styles.signupEmailSummary} aria-live="polite">
          {form.values.email}
        </p>
        <form className={styles.loginForm} onSubmit={form.handlePasswordNext} noValidate>
          <AuthPasswordField
            id="signup-password"
            label="비밀번호"
            autoComplete="new-password"
            placeholder="비밀번호를 입력하세요"
            error={typeof form.passwordError === 'string' ? form.passwordError : undefined}
            visible={form.isPasswordVisible}
            onToggleVisible={() => form.setPasswordVisible((prev) => !prev)}
            registration={passwordRegistration}
          />
          <AuthPasswordField
            id="signup-password-confirm"
            label="비밀번호 재확인"
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요"
            error={typeof form.passwordConfirmError === 'string' ? form.passwordConfirmError : undefined}
            visible={form.isPasswordConfirmVisible}
            onToggleVisible={() => form.setPasswordConfirmVisible((prev) => !prev)}
            registration={passwordConfirmRegistration}
          />
          <AuthSubmitButton disabled={!form.canGoProfileStep}>다음</AuthSubmitButton>
        </form>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.loginHeading}>프로필 설정</h1>
      <p className={styles.loginSubtitle}>닉네임과 프로필을 설정해 주세요</p>
      <div className={styles.signupAvatar} aria-hidden>
        <div className={styles.signupAvatarCircle}>
          <span className={styles.signupAvatarIcon}>+</span>
        </div>
        <span className={styles.signupAvatarHint}>프로필 사진 (선택)</span>
      </div>
      <form className={styles.loginForm} onSubmit={form.handleSignupSubmit} noValidate>
        <AuthTextField
          id="signup-nickname"
          label="닉네임"
          type="text"
          autoComplete="nickname"
          placeholder="닉네임을 입력하세요"
          error={typeof form.nicknameError === 'string' ? form.nicknameError : undefined}
          registration={nicknameRegistration}
        />
        <AuthSubmitButton disabled={!form.canSubmit}>회원가입 완료</AuthSubmitButton>
      </form>
    </>
  );
}

export default SignupWizardForm;
