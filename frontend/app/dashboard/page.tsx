"use client";
import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import ProtectedRoute from "../Wrappers/ProtectedRoute";
import Navbar from "../components/Navbar";
import Button, { ButtonVariant } from "../components/Button";
import CreateNewProject from "../windows/CreateNewProject";

import { useAppStore } from "../stores/app.store";

import { CreateSiteAPI, GetAllSiteAPI } from "../api/site.api";
import { APIErrorReseponse, APISuccessResponse } from "../config/api.config";

export type NewProjectInfo = {
  name: string;
  subdomain: string;
  type: "website" | "template";
}

const Dashboard = () => {
  // States
  const [isCreateNewProject, setIsCreateNewProject] = useState<boolean>(false);
  const [newProjectInfo, setNewProjectInfo] = useState<NewProjectInfo>({
    name: "",
    subdomain: "",
    type: "website",
  });

  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();

  const appStore = useAppStore();

  // Mutations
  const createNewProjectMutation = useMutation<APISuccessResponse, APIErrorReseponse, NewProjectInfo>({
    mutationFn: CreateSiteAPI,
    onSuccess: (data) => {},
    onError: (err: APIErrorReseponse) => {},
  });

  const handleCreateNewProject = () => {};

  return (
    <ProtectedRoute>
      <main className="w-screen h-screen flex items-start justify-start">
        <Navbar />

        <div
          className="
            flex-1 flex flex-col items-center justify-center h-screen bg-primary-bg"
        >
          <div className="text-center space-y-6">
            <div className="w-full flex items-center justify-center">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={85}
                height={85}
                className="rounded-xl border border-primary-border"
              />
            </div>
            <h1 className="text-4xl font-bold text-primary-text">
              No Projects Yet
            </h1>
            <p className="text-secon max-w-md">
              Get started by creating your first project to begin building
              amazing things.
            </p>
            <Button
              variant={ButtonVariant.PRIMARY}
              extendStyle="mt-2 py-2"
              fontStyle="semibold"
              text="Create new project"
              onClick={() => setIsCreateNewProject(true)}
            />
          </div>
        </div>

        {isCreateNewProject && <CreateNewProject setIsCreateNewProject={setIsCreateNewProject} newProjectInfo={newProjectInfo} createNewProjectMutation={createNewProjectMutation} setNewProjectInfo={setNewProjectInfo} handleCreateNewProject={handleCreateNewProject} />}
      </main>
    </ProtectedRoute>
  );
};

export default Dashboard;
