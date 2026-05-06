import type { SignupFormValues } from '../schemas/authSchema';

export const SIGNUP_STEPS = ['email', 'password', 'profile'] as const;

export type SignupStep = (typeof SIGNUP_STEPS)[number];

export type SignupValues = SignupFormValues;

export type SignupTouched = Record<keyof SignupValues, boolean>;
