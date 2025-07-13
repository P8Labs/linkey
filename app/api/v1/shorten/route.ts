import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createShortenSchema = z.object({
  longUrl: z.string().url(),
  shortPart: z.string().min(1),
  tag: z.string().min(1).max(20),
});
// Create the shorten URL
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await request.json();
    const userId = session.user.id;

    const parsedResult = createShortenSchema.safeParse(payload);

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.issues },
        { status: 400 }
      );
    }

    const longUrlValue = parsedResult.data.longUrl;
    const shortPartValue = parsedResult.data.shortPart;
    const tagValue = parsedResult.data.tag;

    const alreadyShorten = await prisma.shortUrl.findUnique({
      where: {
        shorten: shortPartValue,
      },
    });

    if (alreadyShorten) {
      return NextResponse.json(
        { error: "Short link already exists" },
        { status: 400 }
      );
    }

    const shorten = await prisma.shortUrl.create({
      data: {
        shorten: shortPartValue,
        longUrl: longUrlValue,
        clicks: 0,
        tag: tagValue,
        userId: userId,
      },
    });

    if (!shorten) {
      return NextResponse.json(
        { error: "Failed to create short link" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Short link created successfully",
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to do this action" },
      { status: 500 }
    );
  }
}

const updateShortenSchema = z.object({
  longUrl: z.string().url(),
  id: z.string().min(3),
  tag: z.string().min(1).max(20),
});
// Update the shorten URL
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await request.json();
    const userId = session.user.id;

    const parsedResult = updateShortenSchema.safeParse(payload);

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.issues },
        { status: 400 }
      );
    }
    const longUrlValue = parsedResult.data.longUrl;
    const shortenId = parsedResult.data.id;
    const tagValue = parsedResult.data.tag;

    const alreadyShorten = await prisma.shortUrl.findUnique({
      where: {
        id: shortenId,
      },
    });

    if (!alreadyShorten) {
      return NextResponse.json(
        { error: "Short link does not exist" },
        { status: 400 }
      );
    }

    if (alreadyShorten.userId !== userId) {
      return NextResponse.json(
        { error: "You do not have permission to update this short link" },
        { status: 403 }
      );
    }

    const shorten = await prisma.shortUrl.update({
      where: {
        id: alreadyShorten.id,
      },
      data: {
        longUrl: longUrlValue,
        tag: tagValue,
      },
    });

    if (!shorten) {
      return NextResponse.json(
        { error: "Failed to update short link" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Short link updated successfully",
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to do this action" },
      { status: 500 }
    );
  }
}

const deleteShortenSchema = z.object({
  id: z.string().min(3),
});
// Delete the shorten URL
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await request.json();
    const userId = session.user.id;

    const parsedResult = deleteShortenSchema.safeParse(payload);

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.issues },
        { status: 400 }
      );
    }

    const shortenId = parsedResult.data.id;

    const alreadyShorten = await prisma.shortUrl.findUnique({
      where: {
        id: shortenId,
      },
    });

    if (!alreadyShorten) {
      return NextResponse.json(
        { error: "Short link does not exist" },
        { status: 400 }
      );
    }

    if (alreadyShorten.userId !== userId) {
      return NextResponse.json(
        { error: "You do not have permission to delete this short link" },
        { status: 403 }
      );
    }

    await prisma.shortUrl.delete({
      where: {
        id: alreadyShorten.id,
      },
    });

    return NextResponse.json({
      message: "Short link deleted successfully",
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to do this action" },
      { status: 500 }
    );
  }
}
