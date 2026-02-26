import api from "../config/api.config"

export const GetUserInfoAPI = async () => {
    const response = await api.get('/user/me');
    return response.data;
}