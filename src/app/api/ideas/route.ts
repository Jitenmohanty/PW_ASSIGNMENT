import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ideaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
  summary: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, tags, summary } = ideaSchema.parse(body);

    const idea = await prisma.idea.create({
      data: {
        title,
        content,
        tags: tags || [],
        summary: summary || null,
        userId: userId,
      },
    });

    return NextResponse.json(idea);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }
    console.error("[IDEAS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ideas = await prisma.idea.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(ideas);
  } catch (error) {
    console.error("[IDEAS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
