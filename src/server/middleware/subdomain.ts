import { db } from "@/server/db";

export interface ResolveSubdomainInput {
  subdomain: string;
  path: string; // e.g., "/foo/bar"
  query: string; // e.g., "?a=1&b=2" or ""
  headers: {
    country?: string | null;
    ip?: string | null;
    referrer?: string | null;
    userAgent?: string | null;
  };
}

export interface ResolveSubdomainResult {
  error?: boolean;
  message?: string;
  notFound?: boolean;
  // For redirect mode
  redirectUrl?: string;
  statusCode?: number;
  // For render mode
  renderUrl?: string;
}

const joinUrl = (baseUrl: string, path: string, query: string, passthrough: boolean) => {
  try {
    const url = new URL(baseUrl);
    if (passthrough) {
      const basePath = url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname;
      const addPath = path ? path : "";
      const fullPath = `${basePath}${addPath}` || "/";
      url.pathname = fullPath;
      if (query && query.startsWith("?")) {
        const params = new URLSearchParams(query.substring(1));
        params.forEach((v, k) => url.searchParams.append(k, v));
      }
    }
    return url.toString();
  } catch (e) {
    return baseUrl; // fallback
  }
};

export const resolveSubdomain = async (
  input: ResolveSubdomainInput,
): Promise<ResolveSubdomainResult> => {
  try {
    const entry = await db.subdomains.findUnique({
      where: { subdomain: input.subdomain },
    });

    if (!entry || !entry.enabled) {
      return { notFound: true };
    }

    // Update counters (best-effort)
    await db.subdomains.update({
      where: { id: entry.id },
      data: {
        clicks: { increment: 1 },
        lastVisited: new Date(),
      },
    });

    // Log visit (best-effort)
    await db.visits.create({
      data: {
        subdomainId: entry.id,
        path: input.path || "/",
        query: input.query || "",
        country: input.headers.country ?? undefined,
        ip: input.headers.ip ?? undefined,
        referrer: input.headers.referrer ?? undefined,
        userAgent: input.headers.userAgent ?? undefined,
        mode: entry.mode,
        status: undefined,
      },
    });

    const destination = joinUrl(
      entry.targetBaseUrl,
      input.path,
      input.query,
      entry.passthrough,
    );

    if (entry.mode === "redirect") {
      return {
        redirectUrl: destination,
        statusCode: entry.statusCode ?? 302,
      };
    }

    // render mode
    return { renderUrl: destination };
  } catch (error) {
    console.error("Error resolving subdomain:", error);
    return { error: true, message: "Unexpected error." };
  }
}; 