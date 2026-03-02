'use client';
import React from "react";
import { useRouter } from "next/navigation";

import Button, {ButtonVariant} from "../Button";

import { useAppStore } from "@/app/stores/app.store";

interface RecentProjectProps {
  projectId: string;
  projectName: string;
  description: string;
  isActive: boolean;
  lastUpdated: string;
}

const RecentProject = ({projectId, projectName, description, isActive, lastUpdated}:RecentProjectProps) => {
  const router = useRouter()

  const appStore = useAppStore()

  return (
    <div className="w-92 min-w-92 rounded-xl bg-secondary-bg hover:bg-tertiary-bg border border-primary-border h-48 min-h-48 px-4 py-4">
      <div className="flex items-start justify-between w-full h-[60%]">
        <div className="flex flex-col gap-1 items-start justify-center w-full">
          <span className="text-2xl font-medium">{projectName}</span>
          <span className="text-sm font-medium text-primary-text">{description}</span>
        </div>

        <span className={`font-semibold ${isActive?"bg-primary-blue/50":"bg-red-700/50"} px-4 py-1.5 rounded-full text-xs text-center`}>{isActive?"ACTIVE":"INACTIVE"}</span>
      </div>

      <div className="border-t border-primary-border flex items-center justify-between w-full h-[40%]">
        <span className=" text-sm font-medium text-primary-text">Updated 2 days ago</span>

        <div className="w-42">
          <Button variant={ButtonVariant.PRIMARY} text="Go to Dashboard" onClick={() => {
            router.replace(`?site_id=${projectId}`)
            appStore.setSiteListActive(false)
          }}/>
        </div>
      </div>
    </div>
  );
};

export default RecentProject;
