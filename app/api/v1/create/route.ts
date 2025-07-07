import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import validator from "validator";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { longUrl, shortPart, tag } = await request.json();
    const userId = session.user.id;

    const longUrlSchema = z.string().url();
    const shortPartSchema = z.string().min(1).max(20);
    const tagSchema = z.string().min(1).max(20);

    const longUrlResult = longUrlSchema.safeParse(longUrl);
    const shortPartResult = shortPartSchema.safeParse(shortPart);
    const tagResult = tagSchema.safeParse(tag);

    if (!longUrlResult.success) {
      return NextResponse.json(
        { error: longUrlResult.error.issues },
        { status: 400 }
      );
    }
    if (!shortPartResult.success) {
      return NextResponse.json(
        { error: shortPartResult.error.issues },
        { status: 400 }
      );
    }
    if (!tagResult.success) {
      return NextResponse.json(
        { error: tagResult.error.issues },
        { status: 400 }
      );
    }

    const longUrlValue = longUrlResult.data;
    const shortPartValue = shortPartResult.data;
    const tagValue = tagResult.data;

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
