import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, '비밀번호는 6자 이상이어야 합니다.')
      .max(100, '비밀번호가 너무 깁니다.'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export const nicknameSchema = z.object({
  name: z
    .string()
    .min(1, '닉네임을 입력해주세요.')
    .max(20, '닉네임은 20자 이하이어야 합니다.'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('유효하지 않은 이메일 형식입니다.'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type NicknameFormValues = z.infer<typeof nicknameSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;