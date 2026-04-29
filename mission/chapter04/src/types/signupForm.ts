export const SIGNUP_STEPS = ['email', 'password', 'profile'] as const;

export type SignupStep = (typeof SIGNUP_STEPS)[number];

export type SignupValues = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

export type SignupTouched = Record<keyof SignupValues, boolean>;
