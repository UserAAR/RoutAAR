import { Metadata } from "next";
import { getSubdomainsByUser } from "@/server/actions/subdomains";
import { Button } from "@/ui/button";
import { PlusIcon, BarChart3Icon, PencilIcon } from "lucide-react";
import { CreateSubdomain } from "@/components/subdomains/create-subdomain";
import { EditSubdomain } from "@/components/subdomains/edit-subdomain";
import { DeleteSubdomain } from "@/components/subdomains/delete-subdomain";
import Link from "next/link";
import { env } from "@/env.mjs";

export const metadata: Metadata = {
  title: "Subdomains",
};

type SubdomainItem = {
  id: string;
  subdomain: string;
  mode: string;
  targetBaseUrl: string;
  enabled: boolean;
  passthrough: boolean;
  statusCode: number;
  description: string | null;
};

const SubdomainsPage = async () => {
  const items = (await getSubdomainsByUser()) as SubdomainItem[];

  return (
    <main className="w-full duration-500 animate-in fade-in-5 slide-in-from-bottom-2">
      <header className="mb-3 flex w-full items-center justify-between">
        <h2 className="text-base font-semibold">Subdomains</h2>
        <CreateSubdomain>
          <Button>
            <PlusIcon size={16} />
            <span className="hidden md:block">Create Subdomain</span>
          </Button>
        </CreateSubdomain>
      </header>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2">
        {items.map((s) => (
          <div
            key={s.id}
            className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{s.subdomain}.{env.PRIMARY_HOST}</p>
                <p className="text-xs text-neutral-500">
                  {s.mode.toUpperCase()} → {s.targetBaseUrl}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-neutral-500">
                <Link
                  href={`/dashboard/subdomains/${s.id}/analytics`}
                  className="inline-flex items-center space-x-1 rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                >
                  <BarChart3Icon size={14} />
                  <span>Analytics</span>
                </Link>
                <EditSubdomain
                  defaultValues={{
                    id: s.id,
                    subdomain: s.subdomain,
                    mode: s.mode as any,
                    targetBaseUrl: s.targetBaseUrl,
                    passthrough: s.passthrough,
                    statusCode: s.statusCode,
                    enabled: s.enabled,
                    description: s.description,
                  }}
                >
                  <Button variant="outline" size="sm">
                    <PencilIcon size={14} />
                    <span className="ml-1">Edit</span>
                  </Button>
                </EditSubdomain>
                <DeleteSubdomain id={s.id} subdomain={`${s.subdomain}.${env.PRIMARY_HOST}`} />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-md border border-neutral-200 p-4 text-sm text-neutral-500 dark:border-neutral-800">
            No subdomains yet.
          </div>
        )}
      </div>
    </main>
  );
};

export default SubdomainsPage; 