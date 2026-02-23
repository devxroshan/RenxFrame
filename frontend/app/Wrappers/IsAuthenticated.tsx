"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { IsLoggedInAPI } from "../api/user.api";
import { useAppStore } from "../stores/app.store";

const IsAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { setIsAuth, setIsAuthChecked } = useAppStore();

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["auth-check"],
    queryFn: IsLoggedInAPI,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsAuth(data?.ok === true);
      setIsAuthChecked(true);
    }

    if (isError) {
      setIsAuth(false);
      setIsAuthChecked(true);
    }
  }, [isSuccess, isError, data, setIsAuth, setIsAuthChecked]);

  return <>{children}</>;
};

export default IsAuthenticated;