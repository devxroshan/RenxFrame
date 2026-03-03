import api from "../config/api.config";

export const CreateWorkspaceAPI = async (name:string) => {
    const res = await api.post(`/workspace`, {
        name
    })
    return res.data
}

export const GetAllWorkspacesAPI = async () => {
    const res = await api.get(`/workspace`)
    return res.data
}

export const GetWorkspaceAPI = async (id: string) => {
    const res = await api.get(`/workspace/${id}`)
    return res.data
}