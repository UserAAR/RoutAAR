import ExternalLink from "@/ui/external-link";
import { cn } from "@/utils";
import React from "react";
import { ArrowUpRight, Heart, LinkIcon } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = (props: FooterProps) => {
  return (
    <footer
      className={cn(
        "group w-full text-sm text-neutral-600 animate-in fade-in-25 dark:text-neutral-400",
        "bg-white/60 backdrop-blur-md dark:bg-neutral-900/60",
        props.className,
      )}
    >
      <div className={cn("container flex items-center justify-between")}>
        <div className="flex items-center space-x-2">
          <Heart
            size={14}
            className="text-red-500 group-hover:transform group-hover:animate-pulse"
          />
          <ExternalLink href="https://dev.aars.works" className="flex items-center space-x-1">
            <p>Made by AAR</p>
            <ArrowUpRight size={14} />
          </ExternalLink>
        </div>
        <div className="flex items-center space-x-2">
          <LinkIcon className="h-3 w-3" />
          <ExternalLink href="https://links.aars.works" className="flex items-center space-x-1">
            <p className="hidden md:block">Social Links</p>
            <ArrowUpRight size={14} />
          </ExternalLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
