import type {
  RefreshRequest,
  SignInRequest,
  SignInResponse,
  SignOutResponse,
  SignUpRequest,
  SignUpResponse,
} from "../types/auth";
import baseAxios from "./baseAxios";

export const signIn = async (body: SignInRequest): Promise<SignInResponse> => {
  const response = await baseAxios.post<SignInResponse>(
    "v1/auth/signin",
    body,
  );
  return response.data;
};

export const refresh = async (
  body: RefreshRequest,
): Promise<SignInResponse> => {
  const response = await baseAxios.post<SignInResponse>(
    "/v1/auth/refresh",
    body,
  );
  return response.data;
};

export const signOut = async (): Promise<SignOutResponse> => {
  const response =
    await baseAxios.post<SignOutResponse>("/v1/auth/signout");
  return response.data;
};

export const signUp = async (body: SignUpRequest): Promise<SignUpResponse> => {
  const response = await baseAxios.post<SignUpResponse>(
    "/v1/auth/signup",
    body,
  );
  return response.data;
};
