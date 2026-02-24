'use client';
import { useSearchParams } from "next/navigation";

import NonProtectedRoute from "./Wrappers/NonProtectedRoute";
import { useEffect } from "react";



export default function Home() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if(process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && searchParams.get('access_token')){
      document.cookie = `access_token=${searchParams.get('access_token')};domain=.renxframe.test;path=/`
    }
  },[])


  return (
    <NonProtectedRoute>
      <div></div>
    </NonProtectedRoute>
  );
}
