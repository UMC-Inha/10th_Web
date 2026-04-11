import axios from 'axios';
import { type RequestSignIn, type RequestSignUpUser, type ResponseSignIn, type ResponseSignUp } from '../../../chapter04-2/src/types/authType';


export const signup = async (body: RequestSignUpUser):Promise<ResponseSignUp> => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SEVER_API_URL}/v1/auth/signup`,
        body
    );
    return data;
};


export const signin = async (body: RequestSignIn):Promise<ResponseSignIn> => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SEVER_API_URL}/v1/auth/signin`,
        body
    );
    return data;
};

