"use client";

import type { z } from "zod";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { EditSubdomainSchema } from "@/server/schemas";
import { updateSubdomain } from "@/server/actions/subdomains";

import { Button } from "@/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input, Textarea } from "@/ui/input";
import { LoaderIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

interface Props {
  children: ReactNode;
  defaultValues: {
    id: string;
    subdomain: string;
    mode: "redirect" | "render" | string;
    targetBaseUrl: string;
    passthrough: boolean;
    statusCode: number;
    enabled: boolean;
    description?: string | null;
  };
}

export function EditSubdomain(props: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof EditSubdomainSchema>>({
    resolver: zodResolver(EditSubdomainSchema),
    defaultValues: {
      id: props.defaultValues.id,
      subdomain: props.defaultValues.subdomain,
      mode: props.defaultValues.mode as "redirect" | "render",
      targetBaseUrl: props.defaultValues.targetBaseUrl,
      passthrough: props.defaultValues.passthrough,
      statusCode: (props.defaultValues.statusCode as 301 | 302) ?? 302,
      enabled: props.defaultValues.enabled,
      description: props.defaultValues.description ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof EditSubdomainSchema>) => {
    try {
      setLoading(true);

      await updateSubdomain(values);

      toast.success("Subdomain updated", {
        description: `${values.subdomain} saved successfully`,
      });

      setOpen(false);
    } catch (e) {
      toast.error("An unexpected error has occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Edit subdomain</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subdomain:</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="cv" disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode:</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="redirect">Redirect</SelectItem>
                          <SelectItem value="render">Render</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetBaseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target URL:</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="passthrough"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Path & Query passthrough</FormLabel>
                      <FormControl>
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 dark:border-neutral-800 dark:text-white"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          <span>Enabled</span>
                        </label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="statusCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status code</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => field.onChange(parseInt(v) as 301 | 302)}
                          defaultValue={String(field.value)}
                          disabled={form.watch("mode") !== "redirect"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="302">302 (Temporary)</SelectItem>
                            <SelectItem value="301">301 (Permanent)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 dark:border-neutral-800 dark:text-white"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <span>Enabled</span>
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional):</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter a description" disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? <LoaderIcon size={16} className="animate-spin" /> : null}
                <span>{loading ? "Saving..." : "Save changes"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 