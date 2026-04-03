import api from "../config/api.config";

interface CreateRoleProps {
  roleName: string;
  isProjectOnly: boolean;
  workspaceId?: string;
  siteId?: string;
  permissions: {
    canEdit: boolean;
    canManageBilling: boolean;
    canPublish: boolean;
    canDeleteSite: boolean;
    canEditMembers: boolean;
    canEditDomain: boolean;
    canEditRoles: boolean;
  };
}

interface UpdateRoleProps {
  roleName?: string;
  canEdit?: boolean;
  canManageBilling?: boolean;
  canPublish?: boolean;
  canDeleteSite?: boolean;
  canEditMembers?: boolean;
  canEditDomain?: boolean;
  canEditRoles?: boolean;
}

export const CreateRoleAPI = async ({
  roleName,
  isProjectOnly,
  workspaceId,
  siteId,
  permissions,
}: CreateRoleProps) => {
  const res = await api.post("/role", {
    roleName,
    isProjectOnly,
    workspaceId,
    siteId,
    ...permissions,
  });
  return res.data;
};

export const UpdateRoleAPI = async (
  roleId: string,
  updateRole: UpdateRoleProps,
) => {
  const res = await api.put(`/role/${roleId}`, {
    ...updateRole
  });
  return res.data;
};

export const GetAllWorkspaceRolesAPI = async (
  workspaceId: string
) => {
  const res = await api.get(`/role/workspace/${workspaceId}`);
  return res.data;
};

export const GetAllProjectRolesAPI = async (
  projectId: string
) => {
  const res = await api.get(`/role/project/${projectId}`);
  return res.data;
};

export const DeleteRoleAPI = async (
  roleId: string
) => {
  const res = await api.delete(`/role/${roleId}`);
  return res.data;
};


