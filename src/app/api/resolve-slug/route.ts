import type { NextRequest } from "next/server";
import { db } from "@/server/db";
import { checkBlocked } from "@/server/actions/profile";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return Response.json({ error: true, message: "Missing slug" }, { status: 400 });
  }

  try {
    const link = await db.links.findUnique({ where: { slug } });
    if (!link) {
      return Response.json({ redirect404: true }, { status: 200 });
    }

    const isUserBlocked = await checkBlocked(link.creatorId);
    if (isUserBlocked) {
      return Response.json({ redirect404: true }, { status: 200 });
    }

    await db.links.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 }, lastClicked: new Date() },
    });

    return Response.json({ url: link.url }, { status: 200 });
  } catch (e) {
    return Response.json({ error: true, message: "Error" }, { status: 500 });
  }
} 