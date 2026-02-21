import {create} from 'zustand'

import { ToastIcon } from '../config/types.config';


interface Toast {
    id: string;
    msg: string;
    code: string;
    iconType: ToastIcon;
}

type States = {
    toasts: Toast[]
}

type Actions = {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id:string) => void;
    clearAllToast: () => void
}


export const useAppStore = create<States & Actions>((set) => ({
    toasts: [],
    addToast: (toast: Omit<Toast, 'id'>) => set((state) => ({
        toasts: [...state.toasts, {
            ...toast,
            id: crypto.randomUUID()
        }]
    })),
    removeToast: (id: string) => set((state) => ({
        toasts: state.toasts.filter(toast => toast.id !== id)
    })),
    clearAllToast: () => set((state) => ({
        toasts: []
    }))
}))