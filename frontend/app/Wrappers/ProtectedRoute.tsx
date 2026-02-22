'use client';
import React from "react";
import { useRouter } from "next/navigation";

// Stores
import { useAppStore } from "../stores/app.store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Hooks
    const router = useRouter()
    
    // Stores
    const appStore = useAppStore()

    if(appStore && !appStore.isAuth){
        router.replace(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`)
        return;
    }

  return <>{children}</>;
};

export default ProtectedRoute;
