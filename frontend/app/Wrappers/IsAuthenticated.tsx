"use client";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

// API
import { IsLoggedInAPI } from "../api/user.api";
import { APIErrorReseponse, APISuccessResponse } from "../config/api.config";

// Stores
import { useAppStore } from "../stores/app.store";
import { ToastIcon } from "../config/types.config";

const IsAuthenticated = ({ children }: { children: React.ReactNode }) => {
  // Stores
  const appStore = useAppStore();

  // Mutations
  const isAuthenticatedMutation = useMutation({
    mutationFn: IsLoggedInAPI,
    onSuccess: (data: APISuccessResponse) => {
        if(data.ok){
            appStore.setIsAuth(true)   
        }
    },
    onError: (error: APIErrorReseponse) => {
        // appStore.addToast({
        //     msg: error.msg,
        //     code: error.code,
        //     iconType: error.status == 500?ToastIcon.ERROR:ToastIcon.WARNING 
        // })
        appStore.setIsAuth(false)
    },
  });

  // useEffects
  useEffect(() => {
    isAuthenticatedMutation.mutate()  
    return () => {
        appStore.setIsAuth(false)
    }
  }, [])
  

  return <>{children}</>;
};

export default IsAuthenticated;
