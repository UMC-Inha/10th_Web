import AuthPasswordField from '../components/AuthPasswordField';
import AuthSubmitButton from '../components/AuthSubmitButton';
import AuthTextField from '../components/AuthTextField';
import { useSignupWizardForm } from '../hooks/useSignupWizardForm';
import * as styles from '../styles/ui.css';

export type SignupWizardFormProps = {
  onComplete: () => void;
};

function SignupWizardForm({ onComplete }: SignupWizardFormProps) {
  const form = useSignupWizardForm({ onComplete });

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
            name="email"
            autoComplete="email"
            placeholder="example@email.com"
            value={form.values.email}
            error={form.emailError}
            onChange={(event) => form.setField('email', event.target.value)}
            onBlur={() => form.touchField('email')}
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
            name="password"
            autoComplete="new-password"
            placeholder="비밀번호를 입력하세요"
            value={form.values.password}
            error={form.passwordError}
            visible={form.isPasswordVisible}
            onToggleVisible={() => form.setPasswordVisible((prev) => !prev)}
            onChange={(event) => form.setField('password', event.target.value)}
            onBlur={() => form.touchField('password')}
          />
          <AuthPasswordField
            id="signup-password-confirm"
            label="비밀번호 재확인"
            name="passwordConfirm"
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요"
            value={form.values.passwordConfirm}
            error={form.passwordConfirmError}
            visible={form.isPasswordConfirmVisible}
            onToggleVisible={() => form.setPasswordConfirmVisible((prev) => !prev)}
            onChange={(event) => form.setField('passwordConfirm', event.target.value)}
            onBlur={() => form.touchField('passwordConfirm')}
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
          name="nickname"
          autoComplete="nickname"
          placeholder="닉네임을 입력하세요"
          value={form.values.nickname}
          error={form.nicknameError}
          onChange={(event) => form.setField('nickname', event.target.value)}
          onBlur={() => form.touchField('nickname')}
        />
        <AuthSubmitButton disabled={!form.canSubmit}>회원가입 완료</AuthSubmitButton>
      </form>
    </>
  );
}

export default SignupWizardForm;
