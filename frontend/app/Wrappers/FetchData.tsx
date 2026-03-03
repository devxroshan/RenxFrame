"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { GetAllSiteAPI } from "../api/site.api";
import { GetAllWorkspacesAPI } from "../api/workspace.api";
import { useAppStore } from "../stores/app.store";
import { ToastIcon } from "../config/types.config";

const FetchData = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const appStore = useAppStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-bootstrap"],
    queryFn: async () => {
      const [sitesRes, workspacesRes] = await Promise.all([
        GetAllSiteAPI(),
        GetAllWorkspacesAPI(),
      ]);

      return {
        sites: sitesRes.data,
        workspaces: workspacesRes.data,
      };
    },
    enabled: appStore.isAuth && appStore.isAuthChecked,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      appStore.setSites(data.sites ?? []);
      appStore.setWorkspace(data.workspaces ?? []);
    }
  }, [data, appStore.isAuth, appStore.isAuthChecked, router]);

  if (isError) {
    appStore.addToast({
      code: 'Fetching Error.',
      msg: "Something went wrong. Try again later.",
      iconType: ToastIcon.ERROR
    })
  }

  return <>{children}</>;
};

export default FetchData;
