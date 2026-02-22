import api from "../config/api.config"

export const IsLoggedInAPI = async () => {
    const response = await api.get('/user/is-logged-in')
    return response.data;
}