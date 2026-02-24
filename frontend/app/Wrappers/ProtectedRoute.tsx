'use client';
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Stores
import { useAppStore } from "../stores/app.store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Hooks
    const router = useRouter()
    const pathname = usePathname()
    
    // Stores
    const appStore = useAppStore()


    useEffect(() => {
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];

      if(!appStore.isAuth && appStore.isAuthChecked){
        router.replace(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`)
      }
      if(appStore.isAuth && appStore.isAuthChecked && subdomain != 'app'){
        router.replace(`${process.env.NEXT_PUBLIC_LOGGED_IN_FRONTEND_URL}${pathname}`)
      }
      return () => {}
    }, [router, appStore.isAuth, appStore.isAuthChecked, pathname])
    

  return <>{children}</>;
};

export default ProtectedRoute;
