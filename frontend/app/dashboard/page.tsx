"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import ProtectedRoute from "../Wrappers/ProtectedRoute";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Button, { ButtonVariant } from "../components/Button";
import { Site } from "../stores/app.store";
import FloatingButton from "../components/FloatingButton";

import { useAppStore } from "../stores/app.store";



const Dashboard = () => {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stores
  const appStore = useAppStore();

  // Variables
  const siteIdParam = searchParams.get("site_id");
  const currentProject = appStore.getSiteById(siteIdParam as string);


  return (
    <ProtectedRoute>
      <main className="w-screen h-screen flex items-start justify-start">
        <Navbar />
        {currentProject && <Topbar currentSite={currentProject} />}
        {currentProject && <FloatingButton position="bottom-right" onClick={() => appStore.setCreateNewProject(true)} />}

        {!currentProject && (
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
              {appStore.sites.length == 0 && (
                <h1 className="text-4xl font-bold text-primary-text">
                  No Projects Yet
                </h1>
              )}
              <p className="text-secon max-w-md">
                Get started by creating your first project to begin building
                amazing things.
              </p>
              <Button
                variant={ButtonVariant.PRIMARY}
                extendStyle="mt-2 py-2"
                fontStyle="semibold"
                text="Create new project"
                onClick={() => appStore.setCreateNewProject(true)}
              />

              {appStore.sites.length > 0 && (
                <div className="mt-8 w-full h-72 max-w-2xl">
                  <h2 className="text-lg font-semibold text-primary-text mb-4">
                    Recent Projects
                  </h2>
                  <div className="w-full h-fit max-h-64 overflow-y-auto no-scrollbar flex flex-col gap-1 items-start justify-start">
                    {appStore.sites.map((site: Site) => (
                      <div
                        key={site.id}
                        onClick={() => router.replace(`?site_id=${site.id}`)}
                        className="px-3 py-2 rounded-xl border border-primary-border bg-secondary-bg hover:bg-tertiary-bg cursor-pointer transition-colors w-full flex items-center justify-start"
                      >
                        <div className="flex flex-col gap-0.5 items-start justify-center">
                          <span className="font-medium text-primary-text truncate">
                            {site.name}
                          </span>
                          <span className="text-sm text-secondary-text truncate">
                            {site.subdomain}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
};

export default Dashboard;
