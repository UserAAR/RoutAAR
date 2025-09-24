import { NextRequest } from "next/server";
import { resolveSubdomain } from "@/server/middleware/subdomain";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const subdomain = search.get("subdomain");
  const path = search.get("path") || "/";
  const query = search.get("query") || "";

  if (!subdomain) {
    return Response.json({ error: true, message: "Missing subdomain" }, { status: 400 });
  }

  const result = await resolveSubdomain({
    subdomain,
    path,
    query,
    headers: {
      country: req.headers.get("x-vercel-ip-country"),
      ip: req.headers.get("x-forwarded-for"),
      referrer: req.headers.get("referer"),
      userAgent: req.headers.get("user-agent"),
    },
  });

  return Response.json(result);
} 