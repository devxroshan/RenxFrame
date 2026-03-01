"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { GetAllSiteAPI } from "../api/site.api";
import { useAppStore } from "../stores/app.store";

const FetchData = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const appStore = useAppStore()

    const siteQuery = useQuery({
        queryKey: ['all-site'],
        queryFn: GetAllSiteAPI
    })

    useEffect(() => {
        const sites = siteQuery.data?.data
        if(sites?.length > 0){
            appStore.setSites(sites)
        }else {
            appStore.setSites([])
            if(!searchParams.get('site_id'))
                router.replace('/dashboard')
        }
    }, [siteQuery.data])
    

  return <>{children}</>;
};

export default FetchData;