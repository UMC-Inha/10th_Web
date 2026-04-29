import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').pipe(z.email('유효하지 않은 이메일 형식입니다.')),
  password: z.string().min(1, '비밀번호를 입력해주세요.').min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
})

export const signupEmailSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').pipe(z.email('올바른 이메일 형식을 입력해주세요.')),
})

export const signupPasswordSchema = z
  .object({
    password: z.string().min(1, '비밀번호를 입력해주세요.').min(6, '비밀번호는 6자 이상이어야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호를 다시 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

export const signupNicknameSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupEmailData = z.infer<typeof signupEmailSchema>
export type SignupPasswordData = z.infer<typeof signupPasswordSchema>
export type SignupNicknameData = z.infer<typeof signupNicknameSchema>

