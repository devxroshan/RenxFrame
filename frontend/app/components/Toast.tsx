"use client";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

// Stores
import { useAppStore } from "../stores/app.store";

import { ToastIcon } from "../config/types.config";

interface ToastProps {
  id: string;
  msg: string;
  code: string;
  iconType: ToastIcon;
}

const toastIcons = {
  success: <CheckCircle className="w-8 h-8 text-green-500" />,
  error: <XCircle className="w-8 h-8 text-red-500" />,
  warning: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
};


const Toast = ({id, msg, code, iconType }: ToastProps) => {
  // Stores
  const appStore = useAppStore();

  return (
    <div className="w-full h-fit bg-secondary-bg border border-primary-border rounded-lg flex items-center justify-start px-2 py-2 gap-2 select-none">
      {toastIcons[iconType]}
      <div className="flex flex-col w-full h-fit items-start justify-center gap-1">
        <div className="flex justify-between w-full">
          <span className="font-semibold text-lg">{code}</span>
          <X className="w-4 h-4 text-gray-500 cursor-pointer" onClick={() => appStore.removeToast(id)}/>
        </div>
        <span className="font-medium text-primary-text w-full text-wrap">
          {msg}
        </span>
      </div>
    </div>
  );
};

export default Toast;
