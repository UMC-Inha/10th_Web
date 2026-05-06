// 공통 응답 래퍼 (백엔드가 항상 이 구조로 응답해요)
interface ApiResponse<T> {
  status: boolean;
  message: string;
  statusCode: number;
  data: T;
}

// 회원가입 요청 데이터
export interface RequestSignupDto {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

// 회원가입 응답 데이터
export interface ResponseSignupDto extends ApiResponse<{
  id: number;
  email: string;
  name: string;
  createdAt: string;
  accessToken: string;
  refreshToken: string;
}> {}

// 로그인 요청 데이터
export interface RequestSigninDto {
  email: string;
  password: string;
}

// 로그인 응답 데이터
export interface ResponseSigninDto extends ApiResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}> {}

// 내 정보 응답 데이터
export interface ResponseMyInfoDto extends ApiResponse<{
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatar ?: string;
}> {}