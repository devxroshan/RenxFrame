"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";

import { useAppStore, Workspace } from "../stores/app.store";
import { ELocalStorage } from "../config/local-storage.config";

enum ESettings {
  GENERAL = 'general',
  EDITOR = 'editor',
  DOMAIN = 'domain',
  MEMBERS = 'members',
  SECURITY = 'security',
}

const WorkspaceWindow = () => {
  const [currentWorkspaceInfo, setWorkspaceInfo] = useState<
    Omit<Workspace, "id">
  >({
    name: "",
    logo: "",
    theme: "dark",
    owner: "",
  });
  const [currentActiveSetting, setActiveSetting] = useState<ESettings>(
    ESettings.GENERAL,
  );

  // Stores
  const appStore = useAppStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWorkspaceInfo(
        appStore.getWorkspaceById(
          localStorage.getItem(ELocalStorage.SELECTED_WORKSPACE_ID) as string,
        ) as Omit<Workspace, "id">,
      );
    }
    return () => {};
  }, [appStore]);

  const settings = [
    { name: "General", action: () => setActiveSetting(ESettings.GENERAL) },
    { name: "Members", action: () => setActiveSetting(ESettings.MEMBERS) },
    { name: "Domain", action: () => setActiveSetting(ESettings.DOMAIN) },
    { name: "Editor", action: () => setActiveSetting(ESettings.EDITOR) },
    { name: "Security", action: () => setActiveSetting(ESettings.SECURITY) },
  ];

  return (
    <>
      {true && (
        <main className="w-screen h-screen fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="md:w-screen md:h-screen bg-primary-bg flex flex-col px-3 py-2 gap-2">
            <div className="px-2 py-2 w-full flex">
              <span className="text-2xl font-bold">Workspace Settings</span>
            </div>

            <div className="flex items-center justify-center w-full h-full">
              <div className="w-[25%] h-full flex flex-col gap-1 items-start justify-start">
                {settings.map((setting) => (
                  <button
                    key={setting.name}
                    className={`text-lg text-primary-text transition-all duration-300 cursor-pointer py-1 rounded-lg text-left px-4 w-full ${currentActiveSetting == setting.name.toLowerCase()?'bg-tertiary-bg text-white font-medium':'hover:font-medium hover:text-white hover:bg-tertiary-bg'}`}
                    onClick={setting.action}
                  >
                    {setting.name}
                  </button>
                ))}
              </div>

              <div className="w-[75%] h-[90vh] min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-4 items-start justify-start px-2 py-2">
                {currentActiveSetting == ESettings.GENERAL && (
                  <>
                    {" "}
                    <span className="text-2xl font-semibold">General</span>
                    <div className="w-full flex flex-col gap-2 items-start justify-center">
                      <span className="text-lg font-medium text-primary-text">
                        Workspace name
                      </span>
                      <Input
                        variant={InputVariant.PRIMARY}
                        value={currentWorkspaceInfo?.name}
                        onChange={(e) =>
                          setWorkspaceInfo({
                            ...currentWorkspaceInfo,
                            name: e.target.value,
                          })
                        }
                        placeholder="Workspace name"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-2 items-start justify-center">
                      <span className="text-lg font-medium text-primary-text">
                        Workspace description
                      </span>
                      <textarea
                        className="bg-secondary-bg resize-none outline-none border border-primary-border rounded-lg px-2 py-2 focus:ring-2 transition-all duration-300 ring-primary-blue"
                        rows={7}
                        cols={40}
                      ></textarea>
                    </div>
                    <div className="w-full flex flex-col gap-2 items-start justify-center">
                      <span className="text-lg font-medium text-primary-text">
                        Workspace logo
                      </span>
                      <span className="text-sm font-medium text-secondary-text">
                        Upload an image or pick an emoji. This icon will appear
                        in your sidebar.
                      </span>

                      <div className="w-full flex gap-2 items-center justify-start">
                        <div className="w-34 h-34 rounded-lg border border-primary-border bg-tertiary-bg hover:bg-tertiary-bg-hover p-3">
                          <Image
                            src={"/pic.jpg"}
                            alt="Workspace Logo"
                            width={1440}
                            height={1440}
                            className="w-full h-full rounded-lg border border-primary-border"
                          />
                        </div>

                        <div className="flex flex-col items-start justify-start h-full w-44 gap-2">
                          <Button
                            text={"Upload"}
                            variant={ButtonVariant.PRIMARY}
                            extendStyle="py-2"
                            fontStyle="medium"
                          />
                          <Button
                            text={"Set Emoji"}
                            variant={ButtonVariant.SECONDARY_OUTLINE}
                            extendStyle="py-2"
                            fontStyle="medium"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default WorkspaceWindow;
