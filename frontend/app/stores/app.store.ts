import {create} from 'zustand'
import { v4 as uuidv4 } from "uuid";


import { ToastIcon } from '../config/types.config';


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

type States = {
    toasts: Toast[],
    sites: Site[]
    isAuth: boolean;
    isAuthChecked: boolean;
}

type Actions = {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id:string) => void;
    clearAllToast: () => void;
    setIsAuth: (isAuth: boolean) => void;
    setIsAuthChecked: (isAuthChecked: boolean) => void;
    setSites: (sites:Site[]) => void;
    getSiteById: (id: string) => Site | undefined;
}


export const useAppStore = create<States & Actions>((set, get) => ({
    toasts: [],
    isAuth: false,
    isAuthChecked: false,
    sites: [],
    addToast: (toast: Omit<Toast, 'id'>) => set((state) => ({
        toasts: [...state.toasts, {
            ...toast,
            id: uuidv4()
        }]
    })),
    removeToast: (id: string) => set((state) => ({
        toasts: state.toasts.filter(toast => toast.id !== id)
    })),
    clearAllToast: () => set((state) => ({
        toasts: []
    })),
    setIsAuth: (isAuth: boolean) => set((state) => ({
        isAuth
    })),
    setIsAuthChecked: (isAuthChecked: boolean) => set((state) => ({
        isAuthChecked
    })),
    setSites: (sites: Site[]) => set((state) => ({
        sites: [...state.sites, ...sites]
    })),
    getSiteById: (id):Site | undefined => {
        return get().sites.find(site => site._id === id)
    }
}))