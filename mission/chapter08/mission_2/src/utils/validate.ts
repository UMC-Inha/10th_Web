import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다'),
});

export const signupSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요'),
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .max(20, '비밀번호는 20자 이하여야 합니다'),
    passwordCheck: z.string(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordCheck'],
  });

export type SigninFormValues = z.infer<typeof signinSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
