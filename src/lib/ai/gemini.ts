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

    const controller = new AbortController();

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
            const error = new LessonTimeoutError();
            controller.abort(error);
            reject(error);
        }, 20000);
    })


    try {
        const response = ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: GeneratePrompt(input),
            config: {
                responseMimeType: "application/json",
                responseSchema: JsonLessonSchema,
                abortSignal: controller.signal,
            },
        });

        const result = await Promise.race([response, timeoutPromise]);

        const json = JSON.parse(result.text!);
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

    } catch (error) {
        if (controller.signal.reason instanceof LessonTimeoutError) {
            throw (controller.signal.reason);
        }
        throw error

    }
    finally {
        clearTimeout(timeoutId);
    }

}

export class LessonTimeoutError extends Error {
    constructor() {
        super("Lesson generation timed out after 20 seconds");
        this.name = "LessonTimeoutError";
    }
}