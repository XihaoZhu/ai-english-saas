import { z } from "zod";
import { LessonDraftInput } from "../types/lesson";

export const LessonDraftInputSchema: z.ZodType<LessonDraftInput> = z.object({
    prompt: z.string().trim().min(1, "Prompt is required"),
    keywords: z.string().min(1, "Keywords are required"),
    length: z.enum(["Short", "Medium", "Long"]),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
});