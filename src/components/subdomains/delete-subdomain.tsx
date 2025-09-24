"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { deleteSubdomain } from "@/server/actions/subdomains";
import { Input } from "@/ui/input";
import { LoaderIcon, TrashIcon } from "lucide-react";

interface Props {
  id: string;
  subdomain: string; // e.g., cv.aars.works
  children?: ReactNode; // custom trigger
}

export function DeleteSubdomain(props: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmValue, setConfirmValue] = useState<string>("");
  const router = useRouter();

  const onDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmValue !== props.subdomain) {
      toast.error("The subdomain does not match.");
      return;
    }
    try {
      setLoading(true);
      await deleteSubdomain(props.id);
      setOpen(false);
      toast.success("Subdomain deleted successfully.", {
        description: `The subdomain ${props.subdomain} has been deleted.`,
      });
      router.refresh();
    } catch (e) {
      toast.error("An error occurred while deleting the subdomain. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.children ? (
          props.children
        ) : (
          <Button variant="outline" size="sm">Delete</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {props.subdomain}</DialogTitle>
          <DialogDescription className="text-red-500 dark:text-red-400">
            Access to the subdomain will be permanently removed. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onDelete}>
          <div className="space-y-3">
            <p className="text-sm">
              Type <span className="font-mono">{props.subdomain}</span> to confirm:
            </p>
            <Input
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value)}
              autoComplete="off"
              disabled={loading}
            />
            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button variant="ghost" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="destructive" type="submit" disabled={loading}>
                {loading ? <LoaderIcon size={16} className="animate-spin" /> : <TrashIcon size={16} />}
                <span>{loading ? "Deleting..." : "Delete"}</span>
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 