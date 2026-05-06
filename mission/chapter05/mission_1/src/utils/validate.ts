import { z } from 'zod';

//로그인 스키마 (규칙 정의)
export const signinSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다'),
});

//회원가입 스키마
export const signupSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(20, '비밀번호는 20자 이하여야 합니다'),
  passwordCheck: z.string(),
  nickname: z.string().min(1, '닉네임을 입력해주세요'),
})
.refine((data) => data.password === data.passwordCheck, {
  //두 값을 비교하는 추가 검사
  message: "비밀번호가 일치하지 않습니다",
  path: ['passwordCheck'], //passwordCheck 필드에 에러 표시
})

//스키마로부터 타입 자동 생성
export type SigninFormValues = z.infer<typeof signinSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;