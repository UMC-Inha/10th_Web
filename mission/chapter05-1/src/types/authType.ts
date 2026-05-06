import type { CommonResponse } from "./common"

export type RequestSignUpUser = {
  name:string
  email:string
  bio?:string
  avatar?:string
  password:string
}

export type ResponseSignUp = CommonResponse<{
  id:number
  name:string
  email:string
  bio:string | null
  avator: string | null
  createdAt: string
  updatedAT:string
}>

export type RequestSignIn = {
  email:string
  password:string
}

export type ResponseSignIn = CommonResponse<{
  id:number
  name:string
  accessToken:string
  refreshToken:string
}>

export type ResponseMyInfo = CommonResponse<{
  id:number
  name:string
  email:string
  bio:string | null
  avator: string | null
  createdAt: string
  updatedAT:string
}>