import { z } from "zod";

export const ReadingWordSchema = z.object({
    word: z.string(),
    phonetic: z.string(),
    meaning: z.string(),
    tier: z.enum([
        "core",
        "reinforce",
        "next",
    ]),
    explanation: z.string(),
});


export const LessonSchema = z.object({
    title: z.string(),
    article: z.string(),
    vocabulary: z.array(ReadingWordSchema),
});

export type ReadingWord = z.infer<typeof ReadingWordSchema>;
export type GeneratedLesson = z.infer<typeof LessonSchema>;
