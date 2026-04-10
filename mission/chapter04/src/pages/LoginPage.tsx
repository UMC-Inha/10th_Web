import { useCallback, useMemo, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from '../hooks/useForm';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_ERROR = '유효하지 않은 이메일 형식입니다.';
const PASSWORD_ERROR = '비밀번호는 최소 6자 이상이어야 합니다.';

type LoginValues = {
  email: string;
  password: string;
};

function LoginPage() {
  const navigate = useNavigate();

  const validate = useCallback((values: LoginValues) => {
    const next: Partial<Record<keyof LoginValues, string | undefined>> = {};

    if (values.email.length > 0 && !EMAIL_REGEX.test(values.email)) {
      next.email = EMAIL_ERROR;
    }

    if (values.password.length > 0 && values.password.length < 6) {
      next.password = PASSWORD_ERROR;
    }

    return next;
  }, []);

  const { values, errors, handleChange, handleBlur } = useForm<LoginValues>({
    initialValues: { email: '', password: '' },
    validate,
  });

  const canSubmit = useMemo(() => {
    const emailOk = values.email.length > 0 && EMAIL_REGEX.test(values.email);
    const passwordOk = values.password.length >= 6;
    return emailOk && passwordOk;
  }, [values.email, values.password]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // 미션 범위: 실제 API 호출 없음
  };

  return (
    <div className="login">
      <header className="login__header">
        <button type="button" className="login__back" onClick={handleBack} aria-label="이전 페이지">
          &lt;
        </button>
      </header>

      <main className="login__main">
        <h1 className="login__heading">로그인</h1>
        <p className="login__subtitle">계정 정보를 입력해 주세요</p>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login__field">
            <label className="login__label" htmlFor="login-email">
              이메일
            </label>
            <input
              id="login-email"
              className={`login__input ${errors.email ? 'login__input--error' : ''}`}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="example@email.com"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={() => handleBlur('email')}
            />
            {errors.email ? <p className="login__error">{errors.email}</p> : null}
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="login-password">
              비밀번호
            </label>
            <input
              id="login-password"
              className={`login__input ${errors.password ? 'login__input--error' : ''}`}
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              value={values.password}
              onChange={handleChange('password')}
              onBlur={() => handleBlur('password')}
            />
            {errors.password ? <p className="login__error">{errors.password}</p> : null}
          </div>

          <button type="submit" className="login__submit" disabled={!canSubmit}>
            로그인
          </button>
        </form>
      </main>
    </div>
  );
}

export default LoginPage;
