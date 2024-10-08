import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  ConfirmToken,
  ForgotPasswordForm,
  NewPasswordForm,
  RequestConfirmationCodeForm,
  User,
  UserLoginForm,
  UserRegistrationForm,
} from "../types";

export async function createAccount(formData: UserRegistrationForm) {
  try {
    const url = "auth/create-account";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.message) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function confirmAccount(token: ConfirmToken) {
  try {
    const url = "auth/confirm-account";
    const { data } = await api.post<string>(url, token);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.message) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function requestConfirmationCode(
  email: RequestConfirmationCodeForm
) {
  try {
    const url = "auth/request-code";
    const { data } = await api.post<string>(url, email);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.message) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function authenticateUser(formData: UserLoginForm) {
  try {
    const url = "auth/login";
    const { data } = await api.post<string>(url, formData);
    localStorage.setItem('AUTH_TOKEN', data)
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.message) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
  try {
    const url = "auth/forgot-password";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.message) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function validateToken(formData: ConfirmToken) {
  try {
    const url = "auth/validate-token";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.message) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function updatePasswordWithToken({formData, token}: {formData: NewPasswordForm, token: ConfirmToken}){
    try{
        console.log(token);
        
        const url = `auth/update-password/${token.token}`
        const { data } = await api.post<string>(url, formData)
        return data
    }catch(error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

export async function getUser(){
  try{

      
      const url = `auth/user`
      const { data } = await api.get<User>(url)
      
      return data
  }catch(error){
      if(isAxiosError(error) && error.message){
          throw new Error(error.response?.data.error)
      }
  }
}

