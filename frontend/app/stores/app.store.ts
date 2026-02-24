import {create} from 'zustand'
import { v4 as uuidv4 } from "uuid";


import { ToastIcon } from '../config/types.config';


interface Toast {
    id: string;
    msg: string;
    code: string;
    iconType: ToastIcon;
}

type States = {
    toasts: Toast[],
    isAuth: boolean;
    isAuthChecked: boolean;
}

type Actions = {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id:string) => void;
    clearAllToast: () => void;
    setIsAuth: (isAuth: boolean) => void;
    setIsAuthChecked: (isAuthChecked: boolean) => void;
}


export const useAppStore = create<States & Actions>((set) => ({
    toasts: [],
    isAuth: false,
    isAuthChecked: false,
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
    }))
}))