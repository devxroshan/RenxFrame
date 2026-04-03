import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

import { ToastIcon } from "../config/types.config";

interface Toast {
  id: string;
  msg: string;
  code: string;
  iconType: ToastIcon;
}

export interface Site {
  id: string;
  name: string;
  subdomain: string;
  owner: string;
  isOnline: boolean;
  workspace: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  logo: string;
  theme:'dark' | 'light'
}

export interface Role {
  id: string,
  roleName: string;
  isProjectOnly: boolean,
  siteId: string | null,
  workspaceId: string | null,
}

type States = {
  toasts: Toast[];
  sites: Site[];
  isAuth: boolean;
  isAuthChecked: boolean;
  joinedWorkspaces: Workspace[];
  workspaces: Workspace[];
  isSiteListActive: boolean;
  createNewProject: boolean;
  isWorkspaceActive: boolean;
  roles: Role[]
};

type Actions = {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAllToast: () => void;
  setIsAuth: (isAuth: boolean) => void;
  setIsAuthChecked: (isAuthChecked: boolean) => void;
  setSites: (sites: Site[]) => void;
  getSiteById: (id: string) => Site | undefined;
  setSiteListActive: (isActive: boolean) => void;
  setCreateNewProject: (isCreate: boolean) => void;
  setWorkspace: (workspaces: Workspace[]) => void;
  getWorkspaceById: (id: string) => Workspace | undefined;
  setWorkspaceActive: (isActive: boolean) => void;
  setRoles: (role: Role) => void;
  removeRole: (roleId: string) => void;
};



export const useAppStore = create<States & Actions>((set, get) => ({
  toasts: [],
  isAuth: false,
  isAuthChecked: false,
  sites: [],
  joinedWorkspaces: [],
  isSiteListActive: false,
  createNewProject: false,
  workspaces: [],
  isWorkspaceActive: false,
  roles: [],
  addToast: (toast: Omit<Toast, "id">) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: uuidv4(),
        },
      ],
    })),
  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearAllToast: () =>
    set((state) => ({
      toasts: [],
    })),
  setIsAuth: (isAuth: boolean) =>
    set((state) => ({
      isAuth,
    })),
  setIsAuthChecked: (isAuthChecked: boolean) =>
    set((state) => ({
      isAuthChecked,
    })),
  setSites: (sites: Site[]) =>
    set((state) => ({
      sites: [...state.sites, ...sites],
    })),
  getSiteById: (id): Site | undefined => {
    return get().sites.find((site) => site.id === id);
  },
  setSiteListActive: (isActive) =>
    set((state) => ({
      isSiteListActive: isActive,
    })),
  setCreateNewProject: (isCreate) =>
    set((state) => ({
      createNewProject: isCreate,
    })),
  setWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, ...workspace],
    })),
  getWorkspaceById: (id: string): Workspace | undefined => {
    return get().workspaces.find((workspace) => workspace.id == id);
  },
  setWorkspaceActive: (isActive) => set((state) => ({
    isWorkspaceActive: isActive
  })), 
  setRoles: (roles) => set((state) => ({
    roles: [...state.roles, roles]
  })),
  removeRole: (roleId) => set((state) => ({
    roles: state.roles.filter(role => role.id != roleId)
  }))
}));
