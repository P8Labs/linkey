import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("authorization");

  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ip, device, shortId, agents } = await request.json();
  console.log(ip, device, shortId, agents);

  if (!shortId) {
    return NextResponse.json(
      {
        error: "Short Id not found",
      },
      { status: 404 }
    );
  }

  try {
    const shortUrlDoc = await prisma.shortUrl.findUnique({
      where: {
        shorten: shortId,
      },
    });

    if (!shortUrlDoc) {
      return NextResponse.json(
        {
          error: "No bind link found",
        },
        { status: 404 }
      );
    }

    if (ip || device || agents) {
      const rawExist = await prisma.rawData.findFirst({
        where: {
          ip: ip,
          shorturlId: shortUrlDoc.id,
        },
      });

      if (!rawExist) {
        await prisma.rawData.create({
          data: {
            agents: `${agents}`,
            device: `${device}`,
            ip: `${ip}`,
            shorturlId: shortUrlDoc.id,
          },
        });
      }
    }
    await prisma.shortUrl.update({
      where: {
        shorten: shortId,
      },
      data: {
        clicks: shortUrlDoc.clicks++,
      },
    });
    return NextResponse.json({
      success: true,
      redirection: shortUrlDoc.longUrl,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues, createdApiKey: null },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
