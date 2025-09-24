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
    // Gerekli header'ları yönlendirmeye devam et (senin kodun gayet iyiydi)
    const accept = req.headers.get("accept");
    if (accept) upstreamHeaders.set("accept", accept);
    const ua = req.headers.get("user-agent");
    if (ua) upstreamHeaders.set("user-agent", ua);
    upstreamHeaders.set("accept-encoding", "identity"); // Bu satır linkleri değiştirebilmek için önemli!

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: upstreamHeaders,
      redirect: "follow",
    });

    // Güvenlik ve çakışma için header'ları temizle (senin kodun)
    const resHeaders = new Headers(res.headers);
    resHeaders.delete("set-cookie");
    resHeaders.delete("content-security-policy");
    resHeaders.delete("x-frame-options");
    resHeaders.delete("strict-transport-security");
    resHeaders.set("cache-control", "no-store");

    const contentType = res.headers.get("content-type") || "";

    // EĞER GELEN İÇERİK HTML DEĞİLSE, ESKİSİ GİBİ OLDUĞU GİBİ GÖNDER
    if (!contentType.includes("text/html")) {
      return new Response(res.body, {
        status: res.status,
        headers: resHeaders,
      });
    }

    // EĞER GELEN İÇERİK HTML İSE, LİNKLERİ DÜZELT
    const htmlBody = await res.text();

    const rewrittenBody = htmlBody
      .replace(/href="\//g, `href="https://${originalHost}/`)
      .replace(/src="\//g, `src="https://${originalHost}/`)
      .replace(/action="\//g, `action="https://${originalHost}/`);

    // İçeriği değiştirdiğimiz için eski 'content-length' başlığı artık geçersiz.
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