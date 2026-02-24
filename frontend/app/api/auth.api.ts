import api from "../config/api.config";

export const SignUpAPI = async ({name, email, password}:{name:string, email:string, password:string}) => {
    const response = await api.post("/auth/signup", {
        name,
        email,
        password
    })
    return response.data;
}

export const LoginAPI = async ({email, password}:{email:string, password:string}) => {
    const response = await api.post(`/auth/login`, {
        email,
        password
    })
    return response.data;
}

export const ForgotPasswordAPI = async ({email}:{email:string}) => {
    const response = await api.post(`/auth/forgot-password`, {
        email
    })
    return response.data;
}

export const ResetPasswordAPI = async ({token, newPassword, confirmPassword}:{token:string, newPassword:string, confirmPassword: string}) => {
    const response = await api.put(`/auth/reset-password`, {
        token,
        password:newPassword,
        confirmPassword
    })
    return response.data;
}