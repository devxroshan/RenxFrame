import {create} from 'zustand'

interface User {
    id: string;
    name: string;
    email: string;
    profilePicUrl: string;
}

type States = {
    user: User | null;
}

type Actions = {
    setUser: (user: User | null) => void;
}


export const useUserStore = create<States & Actions>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}))