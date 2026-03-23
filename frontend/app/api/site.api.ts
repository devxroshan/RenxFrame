import api from "../config/api.config";

export const GetAllSiteAPI = async () => {
    const res = await api.get('/site')
    return res.data;
}

export const GetSiteAPI = async (id:string) => {
    const res = await api.get(`/site/${id}`)
    return res.data;
}

export const CreateSiteAPI = async ({name, subdomain, isWebsite, workspaceId}:{name: string, subdomain: string, isWebsite: boolean, workspaceId: string}) => {
    const res = await api.post(`/site`, {
        name,
        subdomain,
        isWebsite,
        workspaceId
    })
    return res.data;
}