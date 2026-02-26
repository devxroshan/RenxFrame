"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { GetUserInfoAPI } from "../api/user.api";
import { useAppStore } from "../stores/app.store";
import { useUserStore } from "../stores/user.store";

const IsAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { setIsAuth, setIsAuthChecked } = useAppStore();
  const { setUser } = useUserStore();

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["auth-check"],
    queryFn: GetUserInfoAPI,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsAuth(data?.ok === true);
      setIsAuthChecked(true);
      setUser(data?.data || null);
    }

    if (isError) {
      setIsAuth(false);
      setIsAuthChecked(true);
    }
  }, [isSuccess, isError, data, setIsAuth, setIsAuthChecked]);

  return <>{children}</>;
};

export default IsAuthenticated;