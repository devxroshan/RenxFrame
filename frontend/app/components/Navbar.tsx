"use client";
import Image from "next/image";
import {
  Menu,
  LayoutDashboardIcon,
  CheckCircleIcon,
  Clock,
  LayoutTemplateIcon,
  SettingsIcon,
  TrashIcon,
  GlobeIcon,
  FileTextIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "../stores/app.store";
import { useUserStore } from "../stores/user.store";

const Navbar = () => {
  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
      activeIcon: (
        <LayoutDashboardIcon strokeWidth={2.2} className="w-5 h-5 text-white" />
      ),
    },
    {
      name: "Templates",
      path: "/templates",
      icon: <LayoutTemplateIcon className="w-5 h-5" />,
      activeIcon: (
        <LayoutTemplateIcon strokeWidth={2.2} className="w-5 h-5 text-white" />
      ),
    },
    {
      name: "Subdomains",
      path: "/subdomains",
      icon: <GlobeIcon className="w-5 h-5" />,
      activeIcon: (
        <GlobeIcon strokeWidth={2.2} className="w-5 h-5 text-white" />
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      activeIcon: (
        <SettingsIcon strokeWidth={2.2} className="w-5 h-5 text-white" />
      ),
    },
    {
      name: "Trash",
      path: "/trash",
      icon: <TrashIcon className="w-5 h-5" />,
      activeIcon: (
        <TrashIcon strokeWidth={2.2} className="w-5 h-5 text-white" />
      ),
    },
  ];

  const recentProjects = [
    {
      name: "Project 1",
      link: "/project/1",
    },
    {
      name: "Project 2",
      link: "/project/2",
    },
    {
      name: "Project 3",
      link: "/project/3",
    },
  ];

  const joinedWorkspaces = [
    {
      name: "Workspace 1",
      link: "/workspace/1",
    },
    {
      name: "Workspace 2",
      link: "/workspace/2",
    },
    {
      name: "Workspace 3",
      link: "/workspace/3",
    },
  ];

  //   States
  const [activePath, setActivePath] = useState<string>("");

  //   Hooks
  const pathname = usePathname();

  // Stores
  const appStore = useAppStore();
  const userStore = useUserStore();

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <nav className="md:w-[7vw] lg:w-[25vw] xl:w-[20vw] bg-white h-screen flex">
      {/* Collapsed Sidebar */}
      <section className="w-full lg:hidden h-full border-r border-primary-border bg-secondary-bg flex flex-col items-center py-3 gap-2">
        <Image
          src={userStore.user?.profilePicUrl || "https://lh3.googleusercontent.com/a/ACg8ocJVwOYcWe5ytGqUPCCdgscKr5iLL45BoJqC7S_PYwCqHmOGDtWo=s96-c?v=2"}
          alt="Profile Pic"
          width={40}
          height={40}
          className="border border-primary-border rounded-full cursor-pointer"
          unoptimized
        />

        <div className="flex flex-col gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-2 py-2 rounded-lg text-sm ${
                activePath === link.path
                  ? "bg-tertiary-bg text-primary-text"
                  : "text-secondary-text hover:bg-tertiary-bg"
              }`}
            >
              {activePath === link.path ? link.activeIcon : link.icon}
            </Link>
          ))}
        </div>

        <Image
          src={"/logo.png"}
          alt="Logo"
          width={40}
          height={40}
          className="mt-auto cursor-pointer rounded-lg hover:bg-tertiary-bg p-1"
        />
      </section>

      {/* Expanded Sidebar */}
      <section className="hidden lg:flex flex-col gap-4 w-full h-full border-r border-primary-border bg-secondary-bg py-2 px-3">
        {/* Profile */}
        <div className="w-full transition-all duration-300 rounded-lg hover:bg-tertiary-bg flex items-center gap-3 px-3 py-2 cursor-pointer">
          <Image
            src={userStore.user?.profilePicUrl || "https://lh3.googleusercontent.com/a/ACg8ocJVwOYcWe5ytGqUPCCdgscKr5iLL45BoJqC7S_PYwCqHmOGDtWo=s96-c?v=2"}
            alt="Profile Pic"
            width={40}
            height={40}
            className="border border-primary-border rounded-full cursor-pointer"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium">{userStore.user?.name || "User"}</span>
            <span className="text-xs text-secondary-text">
              {userStore.user?.email || "user@example.com"}
            </span>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col w-full gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-all duration-300 ${
                activePath === link.path
                  ? "bg-tertiary-bg"
                  : "text-secondary-text hover:text-white hover:bg-tertiary-bg"
              }`}
            >
              {activePath === link.path ? link.activeIcon : link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Recent Projects and Joined Workspaces */}
        <section className="w-full h-full overflow-y-auto flex flex-col gap-2 no-scrollbar">
          {/* Recent Projects */}
          <div className="w-full flex flex-col gap-1 items-start justify-start">
            <span className="text-xs uppercase text-secondary-text font-semibold">
              Recent Projects
            </span>

            <div className="flex flex-col gap-1 w-full items-start justify-center">
              {recentProjects.map((project) => (
                <Link
                  key={project.link}
                  href={project.link}
                  className="px-2 py-1 rounded-md hover:bg-tertiary-bg w-full cursor-pointer text-sm transition-all duration-300 text-primary-text hover:text-white"
                >
                  {project.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Joined Workspace */}
          <div className="w-full flex flex-col gap-1 items-start justify-start">
            <span className="text-xs uppercase text-secondary-text font-semibold">
              Joined Workspace
            </span>

            <div className="flex flex-col gap-1 w-full items-start justify-center">
              {joinedWorkspaces.map((workspace) => (
                <Link
                  key={workspace.link}
                  href={workspace.link}
                  className="px-2 py-1 rounded-md hover:bg-tertiary-bg w-full cursor-pointer text-sm transition-all duration-300 text-primary-text hover:text-white"
                >
                  {workspace.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Current Workspace */}
        <div className="w-full transition-all duration-300 rounded-lg hover:bg-tertiary-bg flex items-center gap-3 px-3 py-2 cursor-pointer">
          <Image
            src={"/pic.jpg"}
            alt="Profile Pic"
            width={40}
            height={40}
            className="border border-primary-border rounded-full cursor-pointer"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium">{"NextGenZ Labs"}</span>
            <span className="text-xs text-secondary-text">
              {"20 Members"}
            </span>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
