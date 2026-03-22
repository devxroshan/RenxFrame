"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useAppStore, Workspace } from "../stores/app.store";

import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";
import { ELocalStorage } from "../config/local-storage.config";

enum ETabs {
  GENERAL = "general",
  EDITOR = "editor",
  SECURITY = "security",
  DOMAIN = "domain",
  MEMBERS_AND_ROLES = "members_&_roles",
}

const WorkspaceWindow = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState<ETabs>(
    ETabs.GENERAL,
  );

  const appStore = useAppStore();

  const tabs = ["General", "Members & Roles", "Domain", "Editor", "Security"];

  return (
    <>
      {true && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {/* Main Workspace Setting Window */}
          <main className="w-screen h-screen lg:w-[90vw] xl:w-[70vw] lg:h-[85vh] lg:rounded-xl lg:border border-primary-border bg-primary-bg flex items-center justify-center">
            {/* Sidebar */}
            <section className="w-[30%] lg:w-[25%] xl:w-[28%] h-screen lg:h-[85vh] flex flex-col items-start justify-start gap-5 py-4 px-4">
              <span className="font-semibold text-xl">Workspace Settings</span>

              <div className="w-full flex flex-col items-start justify-center gap-2">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    className={`rounded-lg transition-all duration-300 cursor-pointer w-full py-1.5 ${currentActiveTab === (tab.toLowerCase() as ETabs) ? "text-white font-semibold bg-tertiary-bg px-4" : "hover:px-4 hover:bg-tertiary-bg hover:font-semibold text-primary-text hover:text-white"}`}
                    onClick={() =>
                      setCurrentActiveTab(tab.toLowerCase() as ETabs)
                    }
                  >
                    <span>{tab}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Settings Section */}
            <section className="w-[70%] lg:w-[75%] xl:w-[72%] h-screen lg:h-[85vh] overflow-y-auto no-scrollbar py-4 px-4 gap-6 flex flex-col items-start justify-start">
              {currentActiveTab === ETabs.GENERAL && <General />}
            </section>
          </main>
        </div>
      )}
    </>
  );
};

const General = () => {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>({
    name: "",
    logo: "",
    description: "",
    theme: "dark",
    ownerId: "",
    id: "",
  });

  const appStore = useAppStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Setting the current workspcae id to localstorage if there is not.
      if (
        !localStorage.getItem(ELocalStorage.SELECTED_WORKSPACE_ID) &&
        appStore.workspaces.length > 0
      ) {
        localStorage.setItem(
          ELocalStorage.SELECTED_WORKSPACE_ID,
          appStore?.workspaces[0]?.id,
        );
      }


      const currentWorkspaceInfo: Workspace | undefined =
        appStore.getWorkspaceById(
          localStorage.getItem(ELocalStorage.SELECTED_WORKSPACE_ID) as string,
        );

      if (currentWorkspaceInfo) setCurrentWorkspace(currentWorkspaceInfo);
    }
  }, [appStore]);

  return (
    <>
      <span className="font-semibold text-2xl">General</span>

      <div className="w-full flex flex-col gap-1 items-start justify-center">
        <span className="text-primary-text font-medium">Workspace name</span>
        <Input
          variant={InputVariant.PRIMARY}
          value={currentWorkspace.name}
          onChange={(e) =>
            setCurrentWorkspace({
              ...currentWorkspace,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="w-full flex flex-col gap-1 items-start justify-center">
        <span className="text-primary-text font-medium">
          Workspace description
        </span>
        <textarea
          rows={10}
          cols={50}
          className="resize-none border border-primary-border rounded-lg outline-none focus:ring-2 focus:ring-primary-blue px-2 py-2"
        ></textarea>
      </div>

      {/* Workspace Logo section */}
      <div className="w-full flex flex-col gap-1 items-start justify-center">
        <span className="text-primary-text font-medium">Workspace logo</span>
        <span className="text-sm font-medium text-secondary-text">
          Upload workspace logo or choose an emoji. This will appear on the
          bottom of the sidebar.
        </span>

        <div className="w-full flex items-center justify-start gap-4">
          <div className="w-32 h-32 rounded-lg border border-primary-border bg-tertiary-bg flex items-center justify-center">
            <Image
              src={"/pic.jpg"}
              width={1000}
              height={1000}
              alt={"workspace logo"}
              className="w-28 rounded-lg border border-primary-border"
            />
          </div>

          <div className="flex flex-col items-center justify-start gap-2 w-44 h-full">
            <Button
              variant={ButtonVariant.PRIMARY}
              text="Upload"
              extendStyle="py-2"
              fontStyle="medium"
            />
            <Button
              variant={ButtonVariant.SECONDARY_OUTLINE}
              text="Set emoji"
              extendStyle="py-2"
              fontStyle="medium"
            />
          </div>
        </div>
      </div>

      {/* Theme */}

      <div className="w-full flex flex-col items-start justify-center gap-1">
        <span className="text-primary-text font-semibold">Workspace Theme</span>

        <div className="w-full bg-tertiary-bg py-2 rounded-xl border border-primary-border gap-3 flex items-center justify-between px-2">
          <button
            className={`w-full h-full cursor-pointer rounded-lg ${currentWorkspace.theme == "dark" ? "text-white font-semibold bg-primary-bg py-2" : "text-primary-text bg-tertiary-bg border border-primary-border hover:bg-secondary-bg hover:text-white hover:border-none"} transition-all duration-300`}
            onClick={() =>
              setCurrentWorkspace({
                ...currentWorkspace,
                theme: "dark",
              })
            }
          >
            Dark
          </button>
          <button
            className={`w-full h-full cursor-pointer rounded-lg ${currentWorkspace.theme == "light" ? "text-white font-semibold bg-primary-bg py-2" : "text-primary-text bg-tertiary-bg border border-primary-border hover:bg-secondary-bg hover:text-white hover:border-none"} transition-all duration-300`}
            onClick={() =>
              setCurrentWorkspace({
                ...currentWorkspace,
                theme: "light",
              })
            }
          >
            Light
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkspaceWindow;
