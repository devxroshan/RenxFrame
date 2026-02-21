'use client';
import { useEffect } from "react";

import Toast from "./Toast"
import { useAppStore } from "../stores/app.store"

const ToastContainer = () => {
  // Stores
  const appStore = useAppStore();


  useEffect(() => { 
    return () => {
      appStore.clearAllToast()
    }
  }, [])
  

  return (
    <>
      <main className="fixed bottom-5 left-5 z-50 flex flex-col-reverse gap-3 w-[30vw] h-fit">
        {appStore.toasts.length > 0 && appStore.toasts.map((toast) => (
          <Toast key={toast.id} id={toast.id} msg={toast.msg} code={toast.code} iconType={toast.iconType} />
        ))}
      </main>
    </>
  )
}

export default ToastContainer;