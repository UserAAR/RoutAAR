"use client";

import { DropdownMenuItem } from "@/ui/dropdown-menu";
import { ArrowUpRight, HomeIcon, LayoutDashboardIcon, SettingsIcon, BriefcaseIcon, LinkIcon } from "lucide-react";
import Link from "next/link";

const UserMenu = () => {
  const iconSize = 15;

  return (
    <>
      <DropdownMenuItem asChild>
        <Link href="/">
          <HomeIcon size={iconSize} />
          <span>Home</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/dashboard">
          <LayoutDashboardIcon size={iconSize} />
          <span>Dashboard</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/dashboard/settings">
          <SettingsIcon size={iconSize} />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="flex w-full items-center justify-between">
        <Link href="https://dev.aars.works" target="_blank">
          <div className="flex items-center space-x-3">
            <BriefcaseIcon size={iconSize} />
            <span>Portfolio Website</span>
          </div>
          <ArrowUpRight size={iconSize} className="opacity-40" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="flex w-full items-center justify-between">
        <Link href="https://links.aars.works" target="_blank">
          <div className="flex items-center space-x-3">
            <LinkIcon size={iconSize} />
            <span>Social Links</span>
          </div>
          <ArrowUpRight size={iconSize} className="opacity-40" />
        </Link>
      </DropdownMenuItem>
    </>
  );
};

export default UserMenu;
