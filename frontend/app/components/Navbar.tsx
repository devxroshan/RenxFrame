"use client";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "../stores/app.store";


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


  // Stores
  const appStore = useAppStore();

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname]);

  return (
    <nav className="w-[20vw] h-screen flex">
    </nav>
  );
};

export default Navbar;
