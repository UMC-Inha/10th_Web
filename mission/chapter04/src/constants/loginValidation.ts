import type { LoginValues } from '../types/loginForm';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMAIL_ERROR = '유효하지 않은 이메일 형식입니다.';

export const PASSWORD_ERROR = '비밀번호는 최소 6자 이상이어야 합니다.';

export const PASSWORD_MIN_LENGTH = 6;

export const LOGIN_FORM_INITIAL: LoginValues = {
  email: '',
  password: '',
};

export function getLoginFieldErrors(
  values: LoginValues,
): Partial<Record<keyof LoginValues, string | undefined>> {
  const next: Partial<Record<keyof LoginValues, string | undefined>> = {};

  if (values.email.length > 0 && !EMAIL_REGEX.test(values.email)) {
    next.email = EMAIL_ERROR;
  }

  if (values.password.length > 0 && values.password.length < PASSWORD_MIN_LENGTH) {
    next.password = PASSWORD_ERROR;
  }

  return next;
}

export function isLoginFormValid(values: LoginValues): boolean {
  const emailOk = values.email.length > 0 && EMAIL_REGEX.test(values.email);
  const passwordOk = values.password.length >= PASSWORD_MIN_LENGTH;
  return emailOk && passwordOk;
}
