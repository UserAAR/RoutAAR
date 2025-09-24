import { auth } from "@/auth";
import { db } from "@/server/db";

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await db.subdomains.findMany({
    where: { creatorId: session.user?.id },
    select: {
      subdomain: true,
      mode: true,
      targetBaseUrl: true,
      passthrough: true,
      statusCode: true,
      enabled: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      clicks: true,
      lastVisited: true,
    },
  });
  return Response.json(result);
} 