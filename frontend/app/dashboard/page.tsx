'use client';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import ProtectedRoute from "../Wrappers/ProtectedRoute";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

import { useAppStore } from "../stores/app.store";

import { GetAllSiteAPI } from "../api/site.api";
import { useEffect } from "react";

const Dashboard = () => {
  // Hooks
  const router = useRouter()

  const appStore = useAppStore()

  // Query
  const getAllSiteQuery = useQuery({
    queryKey: ['all-site'],
    queryFn: GetAllSiteAPI,
  })


  useEffect(() => {
    if(getAllSiteQuery.isSuccess){
      router.push(`?site_id=${getAllSiteQuery.data.data[0]._id}`)
      appStore.setSites(getAllSiteQuery.data.data)
    }

    return () => {}
  }, [getAllSiteQuery.isSuccess])

  return (
    <ProtectedRoute>
      <main className="w-screen h-screen flex items-start justify-start">
        <Navbar/>
        <Topbar/>
      </main>
    </ProtectedRoute>
  );
};

export default Dashboard;
