"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button, { ButtonVariant } from "./Button";
import CreateNewProject from "../windows/CreateNewProject";

import { useAppStore, Site } from "../stores/app.store";

interface TopbarProps {
  currentSite: Site;
}

const Topbar = ({ currentSite }: TopbarProps) => {
  const members = [
    { name: "John Doe", role: "Admin", avatar: "/pic.jpg" },
    { name: "Jane Smith", role: "Member", avatar: "/pic.jpg" },
    { name: "Alice Johnson", role: "Member", avatar: "/pic.jpg" },
    { name: "Bob Brown", role: "Member", avatar: "/pic.jpg" },
  ];

  // States
  const [isNewProject, setIsNewProject] = useState<boolean>(false);


  return (
    <main className="md:w-[93vw] lg:w-[75vw] xl:w-[80vw] h-[11vh] bg-secondary-bg border-b border-primary-border flex items-center justify-between px-2 py-1">
      <div className="hover:bg-tertiary-bg transition-all duration-300 flex px-1.5 py-1.5 rounded-lg items-center justify-center gap-2 cursor-pointer">
        <Image
          src="/pic.jpg"
          alt="Website Logo"
          width={40}
          height={40}
          className="cursor-pointer rounded-lg border border-primary-border"
        />

        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">{currentSite?.name}</span>
          <span className="text-primary-text text-xs">
            {currentSite?.subdomain + ".renxframe.in"}
          </span>
        </div>

        <div className="flex flex-col items-end justify-center gap-0.5 w-18">
          <div className="flex w-full items-center justify-start flex-row-reverse">
            {members.map((member, index) => (
              <div key={index} className="-mr-2 first:mr-0">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={20}
                  height={20}
                  className="cursor-pointer rounded-full border border-primary-border"
                />
              </div>
            ))}
          </div>

          <span className="text-xs font-medium text-primary-text">
            6 Members
          </span>
        </div>
      </div>

      <div className="w-32">
        <Button
          variant={ButtonVariant.PRIMARY}
          text="New Project"
          onClick={() => setIsNewProject(true)}
          extendStyle="py-1.5"
        />
      </div>

      {isNewProject && <CreateNewProject setIsCreateNewProject={setIsNewProject}/>}
    </main>
  );
};

export default Topbar;
