import { EMAIL_REGEX, PASSWORD_MIN_LENGTH } from './loginValidation';

export const SIGNUP_EMAIL_ERROR = '올바른 이메일 형식을 입력해주세요.';

export const SIGNUP_PASSWORD_ERROR = '비밀번호는 6자 이상이어야 합니다.';

export const SIGNUP_PASSWORD_MISMATCH_ERROR = '비밀번호가 일치하지 않습니다.';

export const SIGNUP_NICKNAME_ERROR = '닉네임을 입력해주세요.';

export { EMAIL_REGEX, PASSWORD_MIN_LENGTH };

export function isSignupEmailValid(email: string): boolean {
  return email.length > 0 && EMAIL_REGEX.test(email);
}

export function getSignupEmailError(email: string, touched: boolean): string | undefined {
  if (!touched || email.length === 0) return undefined;
  if (!EMAIL_REGEX.test(email)) return SIGNUP_EMAIL_ERROR;
  return undefined;
}

export function getSignupPasswordError(password: string, touched: boolean): string | undefined {
  if (!touched || password.length === 0) return undefined;
  if (password.length < PASSWORD_MIN_LENGTH) return SIGNUP_PASSWORD_ERROR;
  return undefined;
}

export function getSignupPasswordConfirmError(
  password: string,
  passwordConfirm: string,
  touched: boolean,
): string | undefined {
  if (!touched || passwordConfirm.length === 0) return undefined;
  if (password !== passwordConfirm) return SIGNUP_PASSWORD_MISMATCH_ERROR;
  return undefined;
}

export function isSignupPasswordStepValid(password: string, passwordConfirm: string): boolean {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    passwordConfirm.length > 0 &&
    password === passwordConfirm
  );
}

export function isSignupNicknameValid(nickname: string): boolean {
  return nickname.trim().length > 0;
}

export function getSignupNicknameError(nickname: string, touched: boolean): string | undefined {
  if (!touched) return undefined;
  if (nickname.trim().length === 0) return SIGNUP_NICKNAME_ERROR;
  return undefined;
}
