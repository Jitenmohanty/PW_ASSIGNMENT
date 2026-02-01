import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ideaUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  summary: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const updateData = ideaUpdateSchema.parse(body);

    const idea = await prisma.idea.findUnique({
      where: { id },
    });

    if (!idea || idea.userId !== userId) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedIdea);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }
    console.error("[IDEA_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    const idea = await prisma.idea.findUnique({
      where: { id },
    });

    if (!idea || idea.userId !== userId) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.idea.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[IDEA_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
