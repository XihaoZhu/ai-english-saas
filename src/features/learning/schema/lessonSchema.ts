import { z } from "zod";

export const lessonSchema = z.object({
    prompt: z.string().min(5, "Prompt is too short"),
    keywords: z.string().min(2, "Please add at least one keyword"),
    length: z.enum(["Short", "Medium", "Long"]),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
});

export type LessonForm = z.infer<typeof lessonSchema>;
