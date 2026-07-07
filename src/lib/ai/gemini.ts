import { GoogleGenAI } from "@google/genai";

import { LessonSchema } from "./schema";


const JsonLessonSchema = LessonSchema.toJSONSchema();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});


export async function generateLesson() {

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: `
        Generate an English reading lesson.
        Topic: travelling in Japan.
        Level: B1.
        Length: medium.
        `,

        config: {

            responseMimeType: "application/json",

            responseSchema: JsonLessonSchema,

        },
    });


    return response.text;
}