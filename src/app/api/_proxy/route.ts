import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const upstream = new URL(url);

    const upstreamHeaders = new Headers();
    // Forward a minimal set of headers
    const accept = req.headers.get("accept");
    if (accept) upstreamHeaders.set("accept", accept);
    const ua = req.headers.get("user-agent");
    if (ua) upstreamHeaders.set("user-agent", ua);
    upstreamHeaders.set("accept-encoding", "identity");

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: upstreamHeaders,
      redirect: "follow",
      // Do not forward cookies by default
    });

    const resHeaders = new Headers(res.headers);
    // Remove hop-by-hop and security headers that could conflict
    resHeaders.delete("set-cookie");
    resHeaders.delete("content-security-policy");
    resHeaders.delete("x-frame-options");
    resHeaders.delete("strict-transport-security");
    resHeaders.set("cache-control", "no-store");

    return new Response(res.body, {
      status: res.status,
      headers: resHeaders,
    });
  } catch (e) {
    return new Response("Proxy error", { status: 502 });
  }
}
