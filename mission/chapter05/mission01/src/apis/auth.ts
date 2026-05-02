// src/apis/auth.ts

import axiosInstance from "./axiosInstance";

import type { 
    RequestSignupDto, ResponseSignupDto, 
    RequestSigninDto, ResponseSigninDto, 
    ResponseMyInfoDto 
} from "../types/auth";

// 회원가입 API
export const postSignup = async (
    body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
    const {data} = await axiosInstance.post("/v1/auth/signup", body);

    return data;
}

// 로그인 API
export const postSignin = async (
    body : RequestSigninDto,
): Promise<ResponseSigninDto> => {
    const {data} = await axiosInstance.post("/v1/auth/signin", body);

    return data;
}

// 로그아웃 API
export const postLogout = async () => {
  const {data} = await axiosInstance.post("/v1/auth/signout")

  return data;
}

// 내 정보 가져오기 API
export const getMyInfo = async(): Promise<ResponseMyInfoDto> => {
    const {data} = await axiosInstance.get("/v1/users/me");

    return data;
}