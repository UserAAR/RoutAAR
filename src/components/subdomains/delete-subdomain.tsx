"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { deleteSubdomain } from "@/server/actions/subdomains";

interface Props {
  id: string;
  subdomain: string;
}

export function DeleteSubdomain(props: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteSubdomain(props.id);
      toast.success("Subdomain deleted", { description: props.subdomain });
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error("Unable to delete. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Delete subdomain</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Are you sure you want to delete <strong>{props.subdomain}</strong>? This action cannot be undone.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={loading}>Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 