import type { FormEvent } from 'react';
import FormTextField from '../components/FormTextField';
import SubmitButton from '../components/SubmitButton';
import { useLoginForm } from '../hooks/useLoginForm';

function LoginForm() {
  const { values, errors, handleChange, handleBlur, canSubmit } = useLoginForm();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
  };

  return (
    <form className="login__form" onSubmit={handleSubmit} noValidate>
      <FormTextField
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
      <FormTextField
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
      <SubmitButton disabled={!canSubmit}>로그인</SubmitButton>
    </form>
  );
}

export default LoginForm;
