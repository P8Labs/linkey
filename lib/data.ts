import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./prisma";

export async function fetchlinks() {
  try {
    const h = await headers();
    const session = await auth.api.getSession({
      headers: h, // you need to pass the headers object.
    });

    if (!session) throw new Error("No session found");

    const links = await prisma.shortUrl.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return links;
  } catch (error) {
    return [];
  }
}

export async function fetchLinkByShorten(shorten: string) {
  try {
    const link = await prisma.shortUrl.findUnique({
      where: {
        shorten,
      },
    });

    return link;
  } catch (error) {
    return null;
  }
}

export async function logClick(id: string, data: Record<string, any> = {}) {
  try {
    const footprint = await prisma.shortUrl.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
        rawData: {
          create: {
            agents: data.userAgent || "unknown",
            ip: data.ip || "unknown",
            device: data.device || "unknown",
          },
        },
      },
    });

    return footprint;
  } catch (error) {
    console.error("Error logging click:", error);
  }
}
