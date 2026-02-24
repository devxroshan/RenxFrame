"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Stores
import { useAppStore } from "../stores/app.store";
import useWindowSize from "../hooks/useWindowSize";

import NotAvailable from "../components/NotAvailable";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const TABLET_SCREEN = 768;

  // Hooks
  const router = useRouter();
  const pathname = usePathname();

  // Custom Hooks
  const windowSize = useWindowSize();

  // Stores
  const appStore = useAppStore();

  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split(".")[0];

    if (!appStore.isAuth && appStore.isAuthChecked) {
      router.replace(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`);
    }
    if (appStore.isAuth && appStore.isAuthChecked && subdomain != "app") {
      router.replace(
        `${process.env.NEXT_PUBLIC_LOGGED_IN_FRONTEND_URL}${pathname}`,
      );
    }
    return () => {};
  }, [router, appStore.isAuth, appStore.isAuthChecked, pathname, windowSize]);

  return (
    <>
      {windowSize.width != undefined && windowSize.width <= TABLET_SCREEN ? (
        <NotAvailable />
      ) : (
        children
      )}
    </>
  );
};

export default ProtectedRoute;
