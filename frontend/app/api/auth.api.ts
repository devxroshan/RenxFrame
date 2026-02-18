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
    const response = await api.get(`/auth/login?email=${email}&password=${password}`)
    return response.data;
}