import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 6;

export const EMAIL_ERROR_MESSAGE = '올바른 이메일 형식을 입력해주세요.';
export const PASSWORD_ERROR_MESSAGE = '비밀번호는 6자 이상이어야 합니다.';
export const PASSWORD_MISMATCH_ERROR_MESSAGE = '비밀번호가 일치하지 않습니다.';
export const NICKNAME_ERROR_MESSAGE = '닉네임을 입력해주세요.';

export const emailSchema = z
  .string()
  .trim()
  .min(1, EMAIL_ERROR_MESSAGE)
  .email(EMAIL_ERROR_MESSAGE);

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, PASSWORD_ERROR_MESSAGE);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupEmailSchema = z.object({
  email: emailSchema,
});

export const signupPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string().min(1, PASSWORD_MISMATCH_ERROR_MESSAGE),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    message: PASSWORD_MISMATCH_ERROR_MESSAGE,
    path: ['passwordConfirm'],
  });

const signupPasswordBaseSchema = z.object({
  password: passwordSchema,
  passwordConfirm: z.string().min(1, PASSWORD_MISMATCH_ERROR_MESSAGE),
});

export const signupProfileSchema = z.object({
  nickname: z.string().trim().min(1, NICKNAME_ERROR_MESSAGE),
});

export const signupSchema = signupEmailSchema
  .extend(signupPasswordBaseSchema.shape)
  .extend(signupProfileSchema.shape)
  .refine((values) => values.password === values.passwordConfirm, {
    message: PASSWORD_MISMATCH_ERROR_MESSAGE,
    path: ['passwordConfirm'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
