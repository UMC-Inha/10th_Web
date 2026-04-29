
import { type RequestSignIn, type RequestSignUpUser, type ResponseSignIn, type ResponseSignUp} from "../types/authType"
import type { ResponseMyInfo } from '../types/authType';
import { axiosInstance } from './axois';


export const signup = async (body: RequestSignUpUser): Promise<ResponseSignUp> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);
    return data;
};

export const signin = async (body: RequestSignIn): Promise<ResponseSignIn> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
};

export const getMyInfo = async():Promise<ResponseMyInfo> => {
    
    const {data} = await axiosInstance.get("/v1/users/me")
    return data
}

export const postLogout = async() => {
    const {data} = await axiosInstance.post("/v1/auth/signout")
    return data 
}

