"use client";
import Image from "next/image";
import { useState } from "react";
import Button, { ButtonVariant } from "./Button";

const Topbar = () => {
  const members = [
    { name: "John Doe", role: "Admin", avatar: "/pic.jpg" },
    { name: "Jane Smith", role: "Member", avatar: "/pic.jpg" },
    { name: "Alice Johnson", role: "Member", avatar: "/pic.jpg" },
    { name: "Bob Brown", role: "Member", avatar: "/pic.jpg" },
  ];

  const [isSiteOnline, setIsSiteOnline] = useState<boolean>(true);

  return (
    <main className="md:w-[93vw] lg:w-[75vw] xl:w-[80vw] h-[11vh] bg-secondary-bg border-b border-primary-border flex items-center justify-between px-2 py-1">
      <div className="hover:bg-tertiary-bg transition-all duration-300 flex px-2 py-1 rounded-lg items-center justify-center gap-2 cursor-pointer">
        <Image
          src="/pic.jpg"
          alt="Website Logo"
          width={40}
          height={40}
          className="cursor-pointer rounded-lg border border-primary-border"
        />

        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">NextGenz Labs</span>
          <span className="text-primary-text text-sm">nextgenzlabs.in</span>
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

        <select
          className={`bg-secondary-bg border rounded-lg px-3 py-1 text-primary-text text-sm font-medium hover:bg-tertiary-bg transition-all duration-300 cursor-pointer focus:outline-none ${isSiteOnline ? "border-green-600" : "border-red-500"}`}
          onChange={(e) => setIsSiteOnline(e.target.value == "online")}
          value={isSiteOnline ? "online" : "offline"}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div className="w-32">
        <Button
          variant={ButtonVariant.PRIMARY}
          text="New Project"
          onClick={() => alert("New Project Clicked")}
          extendStyle="py-1.5"
        />
      </div>
    </main>
  );
};

export default Topbar;
