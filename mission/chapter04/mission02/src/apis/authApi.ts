import axios from 'axios';
import type { ApiResponse, LoginRequest, LoginResponseData } from '../types/auth';

const BASE_URL = 'http://localhost:8000/v1';

export const signin = async (body: LoginRequest): Promise<LoginResponseData> => {
  const { data } = await axios.post<ApiResponse<LoginResponseData>>(
    `${BASE_URL}/auth/signin`,
    body
  );
  return data.data;
};
