'use client';
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Stores
import { useAppStore } from "../stores/app.store";

const NonProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Hooks
    const router = useRouter()
    
    // Stores
    const appStore = useAppStore()


    useEffect(() => {
      if(appStore.isAuth && appStore.isAuthChecked){
        router.replace(process.env.NEXT_PUBLIC_LOGGED_IN_PAGE as string)
      }
      return () => {}
    }, [appStore.isAuth, appStore.isAuthChecked, router])
    

  return <>{children}</>;
};

export default NonProtectedRoute;
