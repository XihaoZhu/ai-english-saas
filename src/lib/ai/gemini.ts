import { GoogleGenAI } from "@google/genai";

import { LessonSchema } from "./schema";

import { GeneratePrompt } from "./prompt";
import type {
    LessonDraftInput,
    GeneratedLessonResult,
} from "@/src/features/lessons/types/lesson";


const JsonLessonSchema = LessonSchema.toJSONSchema();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});


export async function generateLesson(
    input: LessonDraftInput
): Promise<GeneratedLessonResult> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: GeneratePrompt(input),
        config: {
            responseMimeType: "application/json",
            responseSchema: JsonLessonSchema,
        },
    });

    const json = JSON.parse(response.text!);
    const lesson = LessonSchema.parse(json);
    const wordCount = lesson.article.split(" ").length;

    return {
        ...lesson,
        id: crypto.randomUUID(),
        prompt: input.prompt,
        keywords: input.keywords,
        length: input.length,
        level: input.level,
        word_count: wordCount,
        createdAt: new Date().toISOString(),
    };
}
