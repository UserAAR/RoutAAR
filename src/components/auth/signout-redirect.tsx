"use client";

import { buttonVariants } from "@/ui/button";
import { signOut } from "next-auth/react";
import { LogIn } from "lucide-react";

export default function SignOutAndGo({ to = "/auth" }: { to?: string }) {
  const handle = async () => {
    await signOut({ callbackUrl: to });
  };
  return (
    <button onClick={handle} className={buttonVariants({ variant: "default" })}>
      <LogIn size={18} />
      <span>Sign in</span>
    </button>
  );
} 