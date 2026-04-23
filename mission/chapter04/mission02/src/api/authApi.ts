import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/v1/auth/signin', body);
  return data;
};