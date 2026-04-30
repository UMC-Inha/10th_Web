import { z } from 'zod';

export const signinFormSchema = z.object({
  email: z.string().trim().min(1, '이메일을 입력해 주세요.').email('올바른 이메일 형식이 아니에요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export const signupFormSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해 주세요.'),
  email: z.string().trim().min(1, '이메일을 입력해 주세요.').email('올바른 이메일 형식이 아니에요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 해요.'),
  bio: z.string().optional(),
  avatar: z
    .union([z.literal(''), z.string().url('아바타 URL 형식이 올바르지 않아요.')])
    .optional(),
});

export type SigninFormValues = z.infer<typeof signinFormSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
