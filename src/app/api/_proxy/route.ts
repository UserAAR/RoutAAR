import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const upstream = new URL(url);
    const originalHost = req.headers.get('host'); // Örn: "blogss.aars.works"

    const upstreamHeaders = new Headers();
    const accept = req.headers.get("accept");
    if (accept) upstreamHeaders.set("accept", accept);
    const ua = req.headers.get("user-agent");
    if (ua) upstreamHeaders.set("user-agent", ua);
    upstreamHeaders.set("accept-encoding", "identity");

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: upstreamHeaders,
      redirect: "follow",
    });

    const resHeaders = new Headers(res.headers);
    resHeaders.delete("set-cookie");
    resHeaders.delete("content-security-policy");
    resHeaders.delete("x-frame-options");
    resHeaders.delete("strict-transport-security");
    resHeaders.set("cache-control", "no-store");

    // DÜZELTİLMİŞ SATIR BURASI
    const contentType = res.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      return new Response(res.body, {
        status: res.status,
        headers: resHeaders,
      });
    }

    const htmlBody = await res.text();

    const rewrittenBody = htmlBody
      .replace(/href="\//g, `href="https://${originalHost}/`)
      .replace(/src="\//g, `src="https://${originalHost}/`)
      .replace(/action="\//g, `action="https://${originalHost}/`);

    resHeaders.delete('content-length');

    return new Response(rewrittenBody, {
      status: res.status,
      headers: resHeaders,
    });
    
  } catch (e) {
    console.error("Proxy Error:", e);
    return new Response("Proxy error", { status: 502 });
  }
}