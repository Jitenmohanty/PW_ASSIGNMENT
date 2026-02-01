import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateIdeaSummary, generateSmartTags } from "@/lib/gemini";
import { z } from "zod";

const aiRequestSchema = z.object({
  content: z.string().min(1),
  type: z.enum(["tags", "summary", "both"]),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, type } = aiRequestSchema.parse(body);

    let result: { tags?: string[]; summary?: string } = {};

    if (type === "tags" || type === "both") {
      result.tags = await generateSmartTags(content);
    }

    if (type === "summary" || type === "both") {
      result.summary = await generateIdeaSummary(content);
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
