import { z } from "zod";

export const lessonSchema = z.object({
    scenario: z.string().min(3, "Scenario is too short"),
    profession: z.string().min(2),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export type LessonForm = z.infer<typeof lessonSchema>;