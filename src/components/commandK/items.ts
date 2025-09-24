import { GithubLogo } from "@/components/icons/logos";
import { HomeIcon, LayoutDashboardIcon, SettingsIcon, MonitorIcon, MoonIcon, SunIcon, LinkIcon } from "lucide-react";

export const Pages = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export const ChangeTheme = [
  { name: "Light Theme", param: "light", icon: SunIcon },
  { name: "Dark Theme", param: "dark", icon: MoonIcon },
  { name: "System Theme", param: "system", icon: MonitorIcon },
];

export const SocialPages = [
  { name: "GitHub", href: "https://github.com/UserAAR", icon: GithubLogo },
  { name: "Social Links", href: "https://links.aars.works", icon: LinkIcon },
];
