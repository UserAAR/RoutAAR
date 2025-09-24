"use server";

import type { z } from "zod";
import type { CreateSubdomainSchema, EditSubdomainSchema } from "@/server/schemas";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export const checkIfSubdomainExists = async (subdomain: string) => {
  const result = await db.subdomains.findUnique({
    where: { subdomain },
  });
  return !!result;
};

export const getSingleSubdomain = async (id: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    console.error("Not authenticated.");
    return null;
  }
  const result = await db.subdomains.findUnique({ where: { id } });
  return result;
};

export const getSubdomainsByUser = async () => {
  const currentUser = await auth();
  if (!currentUser) {
    console.error("Not authenticated.");
    return [];
  }
  const result = await db.subdomains.findMany({
    where: { creatorId: currentUser.user?.id },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

interface createSubdomainResult {
  error?: string;
  subdomainId?: string;
}

export const createSubdomain = async (
  values: z.infer<typeof CreateSubdomainSchema>,
): Promise<createSubdomainResult> => {
  const currentUser = await auth();
  if (!currentUser) {
    console.error("Not authenticated.");
    return { error: "Not authenticated. Please login again." };
  }

  if (currentUser.user?.blocked) {
    return { error: "Your account is blocked. Please contact the support." };
  }

  const exists = await db.subdomains.findUnique({
    where: { subdomain: values.subdomain },
  });
  if (exists) {
    return { error: "Subdomain already exists." };
  }

  const created = await db.subdomains.create({
    data: {
      subdomain: values.subdomain,
      mode: values.mode,
      targetBaseUrl: values.targetBaseUrl,
      passthrough: values.passthrough,
      statusCode: values.statusCode,
      enabled: values.enabled,
      description: values.description,
      creatorId: currentUser.user?.id ?? "",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/subdomains");

  return { subdomainId: created.id };
};

export const updateSubdomain = async (
  values: z.infer<typeof EditSubdomainSchema>,
) => {
  const currentUser = await auth();
  if (!currentUser) {
    console.error("Not authenticated.");
    return null;
  }

  await db.subdomains.update({
    where: { id: values.id },
    data: {
      subdomain: values.subdomain,
      mode: values.mode,
      targetBaseUrl: values.targetBaseUrl,
      passthrough: values.passthrough,
      statusCode: values.statusCode,
      enabled: values.enabled,
      description: values.description,
      creatorId: currentUser.user?.id ?? "",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/subdomains");

  return;
};

export const deleteSubdomain = async (id: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    console.error("Not authenticated.");
    return null;
  }

  const result = await db.subdomains.delete({
    where: { id, creatorId: currentUser.user?.id },
  });

  revalidatePath("/dashboard/subdomains");
  return result;
}; 