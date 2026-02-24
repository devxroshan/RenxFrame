"use client";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Published",
      path: "/published",
    },
    {
      name: "Unpublished",
      path: "/unpublished",
    },
    {
      name: "Templates",
      path: "/templates",
    },
    {
      name: "Settings",
      path: "/settings",
    },
    {
      name: "Trash",
      path: "/trash",
    },
    {
      name: "Subdomains",
      path: "/subdomains",
    },
    {
      name: "Drafts",
      path: "/drafts",
    },
  ];

  //   States
  const [activePath, setActivePath] = useState<string>("")

  //   Hooks
  const pathname = usePathname();

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname]);

  return (
    <nav className="w-[20vw] h-screen flex">
      <section className="w-[18%] h-screen border-r border-primary-border bg-secondary- py-4 flex flex-col items-center">
        <Image
          src={"/logo.png"}
          width={40}
          height={40}
          alt="Logo"
          className="rounded-md border border-primary-border"
        />
      </section>

      <section className="w-[82%] h-screen border-r border-primary-border bg-secondary-bg px-2 py-4 gap-4 flex flex-col items-start justify-start">
        <div className="flex w-full justify-between items-center">
          <span className="font-bold text-2xl">RenxFrame</span>
          <Menu className="w-5 h-5 cursor-pointer" />
        </div>

        <div className="w-full h-fit flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`px-2 py-1 rounded-lg ${activePath == link.path?'bg-primary-blue text-white':'hover:bg-primary-blue hover:text-white'} text-secondary-text transition-all duration-200 font-medium hover:px-3`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="w-full h-full">
          <select className="bg-secondary-bg w-full outline-none border-none text-primary-text font-semibold">
            <option value="recent-sites">Recent Sites</option>
            <option value="workspace">Joined Workspace</option>
          </select>
        </div>

        {/* Current Workspace */}
        <div className="w-full h-fit px-1 py-1 rounded-lg hover:bg-tertiary-bg transition-all duration-200 cursor-pointer flex items-center justify-start gap-2">
          <Image
            src={"/logo.png"}
            width={38}
            height={38}
            alt="Workspace Logo"
            className="rounded-lg"
          />

          <div className="flex flex-col">
            <span className="font-semibold">NextGenZ Labs</span>
            <span className="text-sm text-primary-text font-semibold">
              20 Members
            </span>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
