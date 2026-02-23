'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Stores
import { useAppStore } from "../stores/app.store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Hooks
    const router = useRouter()
    
    // Stores
    const appStore = useAppStore()


    useEffect(() => {
      if(!appStore.isAuth && appStore.isAuthChecked){
        router.replace(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`)
      }
      return () => {}
    }, [router, appStore.isAuth, appStore.isAuthChecked])
    

  return <>{children}</>;
};

export default ProtectedRoute;
