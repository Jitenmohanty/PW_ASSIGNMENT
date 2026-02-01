import { describe, it, expect } from "vitest";
import { z } from "zod";

const ideaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
});

describe("Idea Validation", () => {
  it("should validate a correct idea", () => {
    const result = ideaSchema.safeParse({
      title: "Test Idea",
      content: "This is a test content",
      tags: ["test", "ai"],
    });
    expect(result.success).toBe(true);
  });

  it("should fail validation if title is missing", () => {
    const result = ideaSchema.safeParse({
      content: "This is a test content",
    });
    expect(result.success).toBe(false);
  });
});
