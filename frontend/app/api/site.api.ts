import api from "../config/api.config";

export const GetAllSiteAPI = async () => {
    const res = await api.get('/site')
    return res.data;
}

export const GetSiteAPI = async (id:string) => {
    const res = await api.get(`/site/${id}`)
    return res.data;
}

export const CreateSiteAPI = async ({name, subdomain, isWebsite, workspace}:{name: string, subdomain: string, isWebsite: boolean, workspace: string}) => {
    const res = await api.post(`/site`, {
        name,
        subdomain,
        isWebsite,
        workspace
    })
    return res.data;
}