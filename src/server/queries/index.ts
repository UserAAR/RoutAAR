import { cache } from "react";
import { auth } from "@/auth";
import { db } from "@/server/db";

/**
 * Get links with tags by user.
 * Authentication required.
 */
export const getLinksAndTagsByUser = cache(async () => {
  const currentUser = await auth();

  if (!currentUser) {
    console.error("Not authenticated.");
    return null;
  }

  try {
    
    const linkData = await db.links.findMany({
      where: {
        creatorId: currentUser.user?.id,
      },
      include: {
        tags: true,
      },
    });

    const tagsData = await db.tags.findMany({
      where: {
        creatorId: currentUser.user?.id,
      },
    });

    return {
      limit: currentUser.user?.limitLinks,
      links: linkData,
      tags: tagsData,
      userData: currentUser.user,
    };
  } catch (error) {
    console.error("🚧 Error while fetching links and tags:", error);
    throw error;
  }
});

/**
 * Get only tags by user.
 * Authentication required.
 */
export const getTagsByUser = cache(async () => {
  const currentUser = await auth();

  if (!currentUser) {
    console.error("Not authenticated.");
    return null;
  }

  const tagsData = await db.tags.findMany({
    where: {
      creatorId: currentUser.user?.id,
    },
  });

  return tagsData;
});

/**
 * Get analytics for a subdomain: totals and recent visits (last 200).
 * Authentication required.
 */
export const getSubdomainAnalytics = cache(async (subdomainId: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    console.error("Not authenticated.");
    return null;
  }

  const subdomain = await db.subdomains.findFirst({
    where: { id: subdomainId, creatorId: currentUser.user?.id },
  });
  if (!subdomain) return null;

  const total = await db.visits.count({ where: { subdomainId } });
  const recent = await db.visits.findMany({
    where: { subdomainId },
    orderBy: { ts: "desc" },
    take: 200,
  });

  return { subdomain, total, recent };
});
