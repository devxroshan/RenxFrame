"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useAppStore, Workspace } from "../stores/app.store";

import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";
import { ELocalStorage } from "../config/local-storage.config";
import { Domine } from "next/font/google";

enum ETabs {
  GENERAL = "general",
  EDITOR = "editor",
  SECURITY = "security",
  DOMAIN = "domain",
  MEMBERS_AND_ROLES = "members_and_roles",
}

enum EMembersList {
  WORKSPACE_MEMBERS = "workspace_members",
  PROJECT_MEMBERS = "project_members",
}

interface CreateRole {
  roleName: string;
  isWorkspaceRole: boolean;
  permission: {
    canEdit: boolean;
    canEditMembers: boolean;
    canManageBilling: boolean;
    canEditRoles: boolean;
    canPublish: boolean;
    canEditDomain: boolean;
    canDeleteSite: boolean;
  };
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
                    className={`rounded-lg transition-all duration-300 cursor-pointer w-full py-1.5 ${
                      currentActiveTab ===
                      (tab == "Members & Roles"
                        ? ETabs.MEMBERS_AND_ROLES
                        : (tab.toLowerCase() as ETabs))
                        ? "text-white font-semibold bg-tertiary-bg px-4"
                        : "hover:px-4 hover:bg-tertiary-bg hover:font-semibold text-primary-text hover:text-white"
                    }`}
                    onClick={() =>
                      setCurrentActiveTab(
                        tab == "Members & Roles"
                          ? ETabs.MEMBERS_AND_ROLES
                          : (tab.toLowerCase() as ETabs),
                      )
                    }
                  >
                    <span>{tab}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={ButtonVariant.SECONDARY}
                text="Close"
                extendStyle="py-2 mt-auto"
                onClick={() => {
                  appStore.setWorkspaceActive(false);
                  setCurrentActiveTab(ETabs.GENERAL);
                }}
              />
            </section>

            {/* Settings Section */}
            <section className="w-[70%] lg:w-[75%] xl:w-[72%] h-screen lg:h-[85vh] overflow-y-auto no-scrollbar py-4 px-4 gap-6 flex flex-col items-start justify-start">
              {currentActiveTab === ETabs.GENERAL && <General />}
              {currentActiveTab === ETabs.MEMBERS_AND_ROLES && <MembersRoles />}
              {currentActiveTab === ETabs.DOMAIN && <Domain />}
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

        <div className="w-full bg-secondary-bg py-2 rounded-xl border border-primary-border gap-3 flex items-center justify-between px-2">
          <button
            className={`w-full h-full cursor-pointer rounded-lg py-2 outline-none ${currentWorkspace.theme == "dark" ? "text-white font-semibold bg-primary-bg" : "text-primary-text bg-tertiary-bg hover:bg-tertiary-bg-hover hover:text-white"} transition-all duration-300`}
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
            className={`w-full h-full cursor-pointer rounded-lg py-2 outline-none ${currentWorkspace.theme == "light" ? "text-white font-semibold bg-primary-bg" : "text-primary-text bg-tertiary-bg hover:bg-tertiary-bg-hover hover:text-white"} transition-all duration-300`}
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

const MembersRoles = () => {
  const [currentMembersList, setMembersList] = useState<EMembersList>(
    EMembersList.WORKSPACE_MEMBERS,
  );
  const [newRoleInfo, setNewRoleInfo] = useState<CreateRole>({
    roleName: "",
    isWorkspaceRole: false,
    permission: {
      canEdit: false,
      canEditMembers: false,
      canManageBilling: false,
      canEditRoles: false,
      canPublish: false,
      canEditDomain: false,
      canDeleteSite: false,
    },
  });

  const workspaceMembers = [
    {
      id: "1",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
    {
      id: "2",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
    {
      id: "3",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
    {
      id: "4",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
    {
      id: "5",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
    {
      id: "6",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
    {
      id: "7",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
    {
      id: "8",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
    {
      id: "9",
      name: "Roshan Kewat",
      email: "roshankewat9090@gmail.com",
      role: "Owner",
      active: "2h ago",
    },
  ];

  const roles = [
    { id: "1", roleName: "Admin", assigned: "4" },
    { id: "2", roleName: "Developer", assigned: "4" },
    { id: "3", roleName: "UI/UX", assigned: "4" },
    { id: "4", roleName: "Manager", assigned: "4" },
    { id: "5", roleName: "Frontend Developer", assigned: "2" },
  ];

  const handlePermissionChange =
    (key: keyof typeof newRoleInfo.permission) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewRoleInfo({
        ...newRoleInfo,
        permission: {
          ...newRoleInfo.permission,
          [key]: e.target.checked,
        },
      });
    };

  return (
    <>
      <span className="font-semibold text-2xl">Members & Roles</span>

      <div className="w-full flex flex-col gap-2">
        <select
          className="text-primary-text font-semibold w-fit px-1 py-1.5 bg-primary-bg border border-primary-border focus:ring-2 focus:ring-primary-blue outline-none rounded-lg"
          onChange={(e) => setMembersList(e.target.value as EMembersList)}
        >
          <option value="workspace_members">Workspace Members</option>
          <option value="project_members">Project Members</option>
        </select>

        {/* Workspace members only */}
        {currentMembersList == EMembersList.WORKSPACE_MEMBERS && (
          <div className="w-full rounded-2xl bg-secondary-bg border border-primary-border overflow-hidden">
            <div className="w-full py-2 px-3 flex items-center justify-between border-b border-primary-border gap-2 bg-primary-bg">
              <span className="font-semibold text-left text-primary-text w-full">
                Name
              </span>
              <span className="font-semibold text-left text-primary-text w-full">
                Email
              </span>
              <span className="font-semibold text-left text-primary-text w-full">
                Role
              </span>
              <span className="font-semibold text-left text-primary-text w-full">
                Active
              </span>
            </div>

            <div className="w-full h-80 max-h-80 flex flex-col items-start justify-start overflow-y-auto no-scrollbar">
              {workspaceMembers.map((member) => (
                <div
                  className="w-full last:border-none border-b border-primary-border py-3 px-2 bg-secondary-bg flex items-center justify-between gap-2"
                  key={member.id}
                >
                  <span className="text-primary-text w-full text-left truncate flex items-center gap-2">
                    <Image
                      src={"/pic.jpg"}
                      width={1000}
                      height={1000}
                      alt="User Pfp"
                      className="w-8 rounded-full border border-primary-border"
                    />
                    {member.name}
                  </span>
                  <span className="text-primary-text w-full text-left truncate">
                    {member.email}
                  </span>
                  <span className="text-primary-text w-full text-left truncate">
                    {member.role}
                  </span>
                  <span className="text-primary-text w-full text-left truncate">
                    {member.active}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project members only */}
        {currentMembersList == EMembersList.PROJECT_MEMBERS && (
          <div className="w-full rounded-2xl bg-secondary-bg border border-primary-border overflow-hidden">
            <div className="w-full py-2 px-3 flex items-center justify-between border-b border-primary-border gap-2 bg-primary-bg">
              <span className="font-semibold text-left text-primary-text w-full">
                Name
              </span>
              <span className="font-semibold text-left text-primary-text w-full">
                Email
              </span>
              <span className="font-semibold text-left text-primary-text w-full">
                Role
              </span>
              <span className="font-semibold text-left text-primary-text w-full">
                Active
              </span>
            </div>

            <div className="w-full h-80 max-h-80 flex flex-col items-start justify-start overflow-y-auto no-scrollbar">
              {workspaceMembers.map((member) => (
                <div
                  className="w-full last:border-none border-b border-primary-border py-3 px-2 bg-secondary-bg flex items-center justify-between gap-2"
                  key={member.id}
                >
                  <span className="text-primary-text w-full text-left truncate flex items-center gap-2">
                    <Image
                      src={"/pic.jpg"}
                      width={1000}
                      height={1000}
                      alt="User Pfp"
                      className="w-8 rounded-full border border-primary-border"
                    />
                    {member.name}
                  </span>
                  <span className="text-primary-text w-full text-left truncate">
                    {member.email}
                  </span>
                  <span className="text-primary-text w-full text-left truncate">
                    {member.role}
                  </span>
                  <span className="text-primary-text w-full text-left truncate">
                    {member.active}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-start w-full gap-2">
        <span className="font-semibold text-xl text-primary-text">
          Create Role
        </span>

        <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-3 items-center justify-center lg:justify-start lg:items-start">
          {/* List of roles */}
          <div className="w-full flex flex-col items-center justify-start xl:w-[55%] bg-secondary-bg rounded-xl border border-primary-border overflow-hidden">
            <div className="bg-primary-bg gap-2 border-b border-primary-border py-2 w-full flex items-center justify-between px-2">
              <span className="text-primary-text font-semibold text-left truncate w-full">
                Role
              </span>
              <span className="text-primary-text font-semibold text-left truncate w-full">
                Assigned
              </span>
              <span className="text-primary-text font-semibold text-left truncate w-full"></span>
            </div>

            <div className="w-full h-80 max-h-80 flex flex-col overflow-y-auto no-scrollbar items-center justify-start">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="w-full last:border-none border-b border-primary-border py-2 px-2 flex gap-2 items-center justify-between hover:bg-tertiary-bg transition-all duration-300"
                >
                  <span className="w-full text-primary-text font-medium text-left truncate">
                    {role.roleName}
                  </span>
                  <span className="w-full text-primary-text font-medium text-left truncate">
                    {role.assigned + " members"}
                  </span>
                  <button className="w-full text-primary-text text-center outline-none border border-red-900 hover:bg-red-900 hover:text-white transition-all duration-300 cursor-pointer rounded-md active:scale-95">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Create Roles */}
          <div
            className="w-full xl:w-[45%]  flex flex-col items-start justify-start gap-2"
            onKeyDown={(e) => {
              if (e.key == "Enter") console.log(newRoleInfo);
            }}
          >
            <span className="font-semibold text-xl text-secondary-text">
              Permissions
            </span>

            <div className="flex items-start justify-start w-full gap-6">
              <div className="flex flex-col items-start justify-start gap-1">
                <div className="flex items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    id="editing"
                    onChange={handlePermissionChange("canEdit")}
                  />
                  <label
                    htmlFor="editing"
                    className="font-medium cursor-pointer"
                  >
                    Editing
                  </label>
                </div>

                <div className="flex items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    id="edit_members"
                    onChange={handlePermissionChange("canEditMembers")}
                  />
                  <label
                    htmlFor="edit_members"
                    className="font-medium cursor-pointer"
                  >
                    Edit Members
                  </label>
                </div>

                <div className="flex items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    id="billing"
                    onChange={handlePermissionChange("canManageBilling")}
                  />
                  <label
                    htmlFor="billing"
                    className="font-medium cursor-pointer"
                  >
                    Billing
                  </label>
                </div>

                <div className="flex items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    id="roles_editing"
                    onChange={handlePermissionChange("canEditRoles")}
                  />
                  <label
                    htmlFor="roles_editing"
                    className="font-medium cursor-pointer"
                  >
                    Roles Editing
                  </label>
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap-1">
                <div className="flex items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    id="publishing"
                    onChange={handlePermissionChange("canPublish")}
                  />
                  <label
                    htmlFor="publishing"
                    className="font-medium cursor-pointer"
                  >
                    Publishing
                  </label>
                </div>

                <div className="flex items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    id="edit_domain"
                    onChange={handlePermissionChange("canEditDomain")}
                  />
                  <label
                    htmlFor="edit_domain"
                    className="font-medium cursor-pointer"
                  >
                    Edit Domain
                  </label>
                </div>

                <div className="flex items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    id="delete_site"
                    onChange={handlePermissionChange("canDeleteSite")}
                  />
                  <label
                    htmlFor="delete_site"
                    className="font-medium cursor-pointer"
                  >
                    Delete Site
                  </label>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 items-center justify-start mt-4">
              <div className="w-full rounded-xl bg-secondary-bg border border-primary-border py-1 px-1 items-center flex justify-between gap-2">
                <button
                  className={`text-center w-full py-1 rounded-lg border-primary-border cursor-pointer transition-all duration-300 font-medium outline-none ${newRoleInfo.isWorkspaceRole ? "bg-tertiary-bg hover:bg-tertiary-bg-hover text-primary-text hover:text-white border-none" : "border bg-primary-bg text-white"}`}
                  onClick={() =>
                    setNewRoleInfo({
                      ...newRoleInfo,
                      isWorkspaceRole: false,
                    })
                  }
                >
                  In this project
                </button>
                <button
                  className={`text-center w-full py-1 rounded-lg border border-primary-border transition-all  duration-300 cursor-pointer font-medium outline-none ${!newRoleInfo.isWorkspaceRole ? "bg-tertiary-bg hover:bg-tertiary-bg-hover text-primary-text hover:text-white border-none" : "border bg-primary-bg text-white"}`}
                  onClick={() =>
                    setNewRoleInfo({
                      ...newRoleInfo,
                      isWorkspaceRole: true,
                    })
                  }
                >
                  Workspace
                </button>
              </div>

              <Input
                variant={InputVariant.PRIMARY}
                value={newRoleInfo.roleName}
                onChange={(e) =>
                  setNewRoleInfo({
                    ...newRoleInfo,
                    roleName: e.target.value,
                  })
                }
                placeholder="Role name"
              />

              <Button
                variant={ButtonVariant.PRIMARY}
                text="Create Role"
                extendStyle="py-2"
                fontStyle="medium"
                onClick={() => console.log(newRoleInfo)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Domain = () => {
  const activeDomains = [
    {
      id: "1",
      domain: "codex.com",
      resitry: "CloudFlare",
      expiresIn: "20 days",
    },
    {
      id: "2",
      domain: "devxroshan.site",
      resitry: "CloudFlare",
      expiresIn: "20 days",
    },
    {
      id: "3",
      domain: "brandsip.site",
      resitry: "CloudFlare",
      expiresIn: "20 days",
    },
    {
      id: "4",
      domain: "redagnigames.com",
      resitry: "CloudFlare",
      expiresIn: "20 days",
    },
    {
      id: "5",
      domain: "redagniproductions.com",
      resitry: "CloudFlare",
      expiresIn: "20 days",
    },
  ];

  const domains = [
    {
      id: "1",
      domain: "codex.com",
      subdomains: [
        {
          id: "1",
          subdomain: "chats.codex.com",
          recordType: "A",
          ip: "192.168.1.0",
        },
        {
          id: "2",
          subdomain: "history.codex.com",
          recordType: "A",
          ip: "192.168.1.0",
        },
        {
          id: "3",
          subdomain: "activity.codex.com",
          recordType: "A",
          ip: "192.168.1.0",
        },
        {
          id: "4",
          subdomain: "api.codex.com",
          recordType: "A",
          ip: "192.168.1.0",
        },
      ],
    },
    {
      id: "2",
      domain: "devxroshan.site",
      subdomains: [
        {
          id: "1",
          subdomain: "chats.devxroshan.site",
          recordType: "A",
          ip: "192.168.1.0",
        },
        {
          id: "2",
          subdomain: "history.devxrosha.site",
          recordType: "A",
          ip: "192.168.1.0",
        },
        {
          id: "3",
          subdomain: "activity.devxroshan.site",
          recordType: "A",
          ip: "192.168.1.0",
        },
        {
          id: "4",
          subdomain: "api.devxroshan.site",
          recordType: "A",
          ip: "192.168.1.0",
        },
      ],
    },
  ];

  return (
    <>
      <span className="font-semibold text-2xl">Domain</span>

      {/* Active Domains */}
      <div className="w-full flex flex-col items-start justify-center gap-2">
        <span className="text-primary-text text-lg font-semibold">
          Active Domains
        </span>
        <div className="w-full flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {activeDomains.map((domain) => (
            <div
              key={domain.id}
              className="min-w-60 h-fit shrink-0 snap-start bg-secondary-bg hover:bg-tertiary-bg rounded-xl border border-primary-border shadow-sm hover:shadow-md transition-all duration-300 px-4 py-2 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between w-full gap-3">
                <span className="text-lg font-semibold">{domain.domain}</span>

                <span className="px-3 py-1 bg-primary-blue rounded-full text-xs font-medium">
                  Active
                </span>
              </div>

              <div className="flex flex-col gap-1 items-start justify-center">
                <span className="text-sm text-secondary-text font-medium">
                  Resitry: {domain.resitry}
                </span>
                <span className="text-sm text-secondary-text font-medium">
                  Expiring In: {domain.expiresIn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subdomains */}
      <div className="w-full flex flex-col items-start justify-center gap-2">
        <span className="text-primary-text text-lg font-semibold">
          Subdomains
        </span>

        <div className="w-full max-h-80 lg:max-h-60 h-fit flex flex-col items-center justify-start gap-2 overflow-y-auto no-scrollbar">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="w-full max-h-80 lg:max-h-60 h-fit flex flex-col items-center justify-start"
            >
              <div className="w-full bg-secondary-bg rounded-tl-xl rounded-tr-xl border border-primary-border h-12 flex px-4 py-2 items-center justify-between">
                <span className="font-semibold">{domain.domain}</span>

                <span className="text-sm font-medium text-secondary-text">
                  {domain.subdomains.length} Records
                </span>
              </div>

              <div className="w-full h-fit flex flex-col items-center justify-start">
                {domain.subdomains.map((subdomain) => (
                  <div key={subdomain.id} className="w-full bg-tertiary-bg border-b border-r border-l border-primary-border last:rounded-bl-xl last:rounded-br-xl py-3 px-2 flex items-center justify-between">
                    <span className="font-medium">{subdomain.subdomain}</span>
                    <span className="text-sm text-primary-text font-medium">
                      {subdomain.recordType} Record - {subdomain.ip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* See Available Sudomains and Domains */}
      <div>
        
      </div>
    </>
  );
};

export default WorkspaceWindow;
