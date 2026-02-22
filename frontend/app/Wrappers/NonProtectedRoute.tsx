'use client';
import React from "react";
import { useRouter } from "next/navigation";

// Stores
import { useAppStore } from "../stores/app.store";

const NonProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Hooks
    const router = useRouter()
    
    // Stores
    const appStore = useAppStore()

    if(appStore && appStore.isAuth){
        router.replace(process.env.NEXT_PUBLIC_LOGGED_IN_ROUTE as string)
        return;
    }

  return <>{children}</>;
};

export default NonProtectedRoute;
