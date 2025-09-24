import type { Metadata } from "next";
import { getSubdomainsByUser } from "@/server/actions/subdomains";
import { Button } from "@/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { CreateSubdomain } from "@/components/subdomains/create-subdomain";
import { EditSubdomain } from "@/components/subdomains/edit-subdomain";
import { DeleteSubdomain } from "@/components/subdomains/delete-subdomain";
import Link from "next/link";
import { env } from "@/env.mjs";
import SearchSubdomains from "@/components/subdomains/search-subdomain";
import SearchTag from "@/components/tags/search-tags";
import ShowClicks from "@/components/links/show-clicks-link";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { CopyIcon, QrCodeIcon, SettingsIcon } from "lucide-react";
import CopyLinkDropdown from "@/components/links/copy-link";
import CopyQR from "@/components/links/copy-qr";
import { buttonVariants } from "@/ui/button";
import { formatDate } from "@/utils/formatDate";

export const metadata: Metadata = {
  title: "Subdomains",
};

type SubdomainItem = {
  id: string;
  subdomain: string;
  mode: "redirect" | "render";
  targetBaseUrl: string;
  enabled: boolean;
  passthrough: boolean;
  statusCode: number;
  description: string | null;
  clicks: number;
  lastVisited: Date | string | null;
  createdAt: Date | string;
  tags: { tagId: string }[];
};

const SubdomainsPage = async ({
  searchParams,
}: {
  searchParams?: { search?: string; tag?: string };
}) => {
  const items = (await getSubdomainsByUser()) as SubdomainItem[];
  const search = searchParams?.search;
  const selectedTag = searchParams?.tag;

  const data = await import("@/server/queries");
  const linksAndTags = await data.getLinksAndTagsByUser();
  const tags = linksAndTags?.tags ?? [];

  const filtered = items.filter((s) => {
    if (!search && !selectedTag) return true;
    const matchName = !search || s.subdomain.includes(search);
    const matchTag = !selectedTag || s.tags.some((t) => t.tagId === selectedTag);
    return matchName && matchTag;
  });

  return (
    <main className="w-full duration-500 animate-in fade-in-5 slide-in-from-bottom-2">
      <header className="mb-3 flex w-full items-center space-x-2 md:justify-between">
        <SearchSubdomains className="w-full md:w-72 md:max-w-72" />
        <div className="flex items-center space-x-2">
          <div className={buttonVariants({ variant: "outline", className: "cursor-default font-mono shadow-none" })}>
            <div className="flex items-center space-x-2">
              <span>{items.length}/∞</span>
            </div>
          </div>
          <SearchTag tags={tags} tagSelected={selectedTag!} tagName={selectedTag} />
          <CreateSubdomain>
            <Button>
              <PlusIcon size={16} />
              <span className="hidden md:block">Create Subdomain</span>
            </Button>
          </CreateSubdomain>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2">
        {filtered.map((s) => (
          <div key={s.id} className="flex w-full flex-col rounded-md border border-neutral-200 p-3 shadow-sm dark:border-neutral-800">
            <div className="mb-1 flex w-full items-center justify-between space-x-2">
              <Link href={`https://${s.subdomain}.${env.PUBLIC_ROOT_HOST}`} target="_blank" rel="noopener noreferrer" className="block space-x-[1px] overflow-hidden truncate font-medium transition-opacity duration-75 hover:opacity-80">
                <span className="text-sm opacity-40">{s.subdomain}.</span>
                <span>{env.PUBLIC_ROOT_HOST}</span>
              </Link>
              <div className="flex items-center space-x-3">
                <ShowClicks numberOfClicks={s.clicks} lastDate={s.lastVisited ? new Date(s.lastVisited) : null} className="hidden border-r border-neutral-200 pr-2 dark:border-neutral-800 md:flex" />
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="transition-opacity hover:opacity-75">
                      <CopyIcon size={15} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <CopyLinkDropdown absoluteUrl={`https://${s.subdomain}.${env.PUBLIC_ROOT_HOST}`} />
                      <DialogTrigger asChild>
                        <DropdownMenuItem>
                          <QrCodeIcon size={15} />
                          <span>Copy QR Code</span>
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <CopyQR absoluteUrl={`https://${s.subdomain}.${env.PUBLIC_ROOT_HOST}`} filename={`${s.subdomain}.${env.PUBLIC_ROOT_HOST}`} />
                </Dialog>
                <EditSubdomain
                  defaultValues={{
                    id: s.id,
                    subdomain: s.subdomain,
                    mode: s.mode,
                    targetBaseUrl: s.targetBaseUrl,
                    passthrough: s.passthrough,
                    statusCode: s.statusCode,
                    enabled: s.enabled,
                    description: s.description,
                  }}
                >
                  <button className="transition-opacity hover:opacity-75">
                    <SettingsIcon size={16} />
                  </button>
                </EditSubdomain>
                <DeleteSubdomain id={s.id} subdomain={`${s.subdomain}.${env.PUBLIC_ROOT_HOST}`}>
                  <button className="transition-opacity hover:opacity-75" aria-label="Delete" title="Delete">
                    <TrashIcon size={16} />
                  </button>
                </DeleteSubdomain>
              </div>
            </div>
            <p className="mb-2 truncate select-all font-mono text-sm text-neutral-500 dark:text-neutral-400" title={s.targetBaseUrl}>
              {s.mode.toUpperCase()} → {s.targetBaseUrl}
            </p>
            <div className="flex items-center justify-between font-mono text-xs font-medium text-neutral-600 dark:text-neutral-400 md:space-x-2">
              <div className="flex max-w-[75%] items-center space-x-2">
                {s.tags.length > 0 && (
                  <div className="flex cursor-default items-center space-x-1">
                    {s.tags.map((tag) => (
                      <span key={tag.tagId} className="rounded-md border border-neutral-200 px-2 py-[0.5px] font-mono text-xs dark:border-neutral-800">
                        {tags.find((t) => t.id === tag.tagId)?.name}
                      </span>
                    ))}
                  </div>
                )}
                {s.description && (
                  <p className="hidden truncate md:block" title={s.description ?? ""}>
                    {s.description}
                  </p>
                )}
              </div>
              <p>{formatDate(new Date((s.lastVisited ?? s.createdAt) as string | number | Date))}</p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-4 flex flex-col items-center justify-center space-y-3 text-center">
          <p>No subdomains found</p>
          <CreateSubdomain>
            <Button variant="outline">
              <PlusIcon size={14} />
              <span>Create a new subdomain</span>
            </Button>
          </CreateSubdomain>
        </div>
      )}
    </main>
  );
};

export default SubdomainsPage; 