import axiosInstance from './axiosInstance';
import type {
  ApiResponse,
  LoginFormData,
  LoginResponseData,
  SignupResponseData,
} from '../types/auth';

export const signin = async (body: LoginFormData): Promise<LoginResponseData> => {
  const { data } = await axiosInstance.post<ApiResponse<LoginResponseData>>(
    '/auth/signin',
    body
  );
  return data.data;
};

export const signup = async (body: {
  email: string;
  password: string;
  name: string;
}): Promise<SignupResponseData> => {
  const { data } = await axiosInstance.post<ApiResponse<SignupResponseData>>(
    '/auth/signup',
    body
  );
  return data.data;
};
