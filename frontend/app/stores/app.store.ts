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
  _id: string;
  name: string;
  subdomain: string;
  owner: string;
  isOnline: boolean;
}

export interface Workspace {
  _id: string;
  name: string;
  owner: string;
  workspace: string;
  logo: string;
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
    return get().sites.find((site) => site._id === id);
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
    return get().workspaces.find((workspace) => workspace._id == id);
  },
}));
