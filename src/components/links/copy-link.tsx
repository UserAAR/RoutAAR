"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/ui/dropdown-menu";
import { ClipboardIcon } from "lucide-react";

interface CopyLinkProps {
  slug?: string;
  absoluteUrl?: string;
  className?: string;
}

const CopyLinkDropdown = (props: CopyLinkProps) => {
  const [, copy] = useCopyToClipboard();

  const buildUrl = () => {
    if (props.absoluteUrl) return props.absoluteUrl;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const path = props.slug ? `/${props.slug}` : "";
    return `${origin}${path}`;
  };

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        toast.success("Link copied to clipboard", {
          description: `${text}`,
        });
      })
      .catch((error) => {
        toast.error(
          "An unexpected error has occurred. Please try again later.",
          {
            description: String(error),
          },
        );
      });
  };

  const target = buildUrl();

  return (
    <DropdownMenuItem onClick={handleCopy(target)}>
      <ClipboardIcon size={15} />
      <span>Copy to clipboard</span>
    </DropdownMenuItem>
  );
};

export default CopyLinkDropdown;
