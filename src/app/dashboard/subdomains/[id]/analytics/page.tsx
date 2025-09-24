import type { Metadata } from "next";
import { getSubdomainAnalytics } from "@/server/queries";

export const metadata: Metadata = {
  title: "Subdomain Analytics",
};

type VisitRow = {
  id: string;
  ts: string | Date;
  path: string;
  country: string | null;
  referrer: string | null;
};

type AnalyticsResult = {
  subdomain: {
    subdomain: string;
    mode: string;
    enabled: boolean;
    lastVisited: string | Date | null;
  };
  total: number;
  recent: VisitRow[];
};

const AnalyticsPage = async ({ params }: { params: { id: string } }) => {
  const data = (await getSubdomainAnalytics(params.id)) as AnalyticsResult | null;

  if (!data) {
    return (
      <main className="w-full duration-500 animate-in fade-in-5 slide-in-from-bottom-2">
        <div className="rounded-md border border-neutral-200 p-4 text-sm dark:border-neutral-800">
          Analytics not available.
        </div>
      </main>
    );
  }

  const { subdomain, total, recent } = data;

  return (
    <main className="w-full duration-500 animate-in fade-in-5 slide-in-from-bottom-2">
      <header className="mb-3 flex w-full items-center justify-between">
        <h2 className="text-base font-semibold">{subdomain.subdomain}.aars.works</h2>
        <div className="text-xs text-neutral-500">Mode: {subdomain.mode}</div>
      </header>
      <section className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
          <p className="text-xs text-neutral-500">Total visits</p>
          <p className="text-2xl font-semibold">{total}</p>
        </div>
        <div className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
          <p className="text-xs text-neutral-500">Last visited</p>
          <p className="text-sm">{subdomain.lastVisited ? new Date(subdomain.lastVisited).toLocaleString() : "-"}</p>
        </div>
        <div className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
          <p className="text-xs text-neutral-500">Status</p>
          <p className="text-sm">{subdomain.enabled ? "Enabled" : "Disabled"}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
          <p className="mb-2 text-sm font-medium">Recent visits</p>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white text-xs text-neutral-500 dark:bg-black">
                <tr>
                  <th className="px-2 py-1">Time</th>
                  <th className="px-2 py-1">Path</th>
                  <th className="px-2 py-1">Country</th>
                  <th className="px-2 py-1">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t border-neutral-100 dark:border-neutral-900">
                    <td className="px-2 py-1">{new Date(r.ts).toLocaleString()}</td>
                    <td className="px-2 py-1">{r.path}</td>
                    <td className="px-2 py-1">{r.country ?? "-"}</td>
                    <td className="px-2 py-1 truncate">{r.referrer ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-md border border-neutral-200 p-4 text-sm text-neutral-500 dark:border-neutral-800">
          More charts coming soon.
        </div>
      </section>
    </main>
  );
};

export default AnalyticsPage; 