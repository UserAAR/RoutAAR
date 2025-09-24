"use client";

import type { z } from "zod";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { CreateSubdomainSchema } from "@/server/schemas";
import { checkIfSubdomainExists, createSubdomain } from "@/server/actions/subdomains";

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
import { LoaderIcon, ShuffleIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

interface Props {
  children: ReactNode;
}

export function CreateSubdomain(props: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof CreateSubdomainSchema>>({
    resolver: zodResolver(CreateSubdomainSchema),
    defaultValues: {
      subdomain: "",
      mode: "redirect",
      targetBaseUrl: "",
      passthrough: true,
      statusCode: 302,
      enabled: true,
      description: "",
    },
  });

  const handleGenerateRandom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const random = Math.random().toString(36).substring(7);
    form.setValue("subdomain", random);
  };

  const onSubmit = async (values: z.infer<typeof CreateSubdomainSchema>) => {
    try {
      setLoading(true);

      const exists = await checkIfSubdomainExists(values.subdomain);
      if (exists) {
        toast.error("Subdomain already exists. Choose another.");
        return;
      }

      const result = await createSubdomain(values);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Subdomain created successfully", {
        description: `${values.subdomain}.aars.works → ${values.targetBaseUrl}`,
        duration: 8000,
        closeButton: true,
      });

      form.reset();
    } catch (e) {
      toast.error("An unexpected error has occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Create new subdomain</DialogTitle>
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
                      <div className="relative flex items-center">
                        <Input {...field} placeholder="cv" disabled={loading} />
                        <Button
                          onClick={handleGenerateRandom}
                          variant="outline"
                          className="absolute right-0 rounded-none rounded-br-md rounded-tr-md"
                        >
                          <ShuffleIcon size={14} />
                          <span>Randomize</span>
                        </Button>
                      </div>
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
                          onValueChange={(v) => field.onChange(parseInt(v))}
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
                <span>{loading ? "Creating..." : "Create"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 