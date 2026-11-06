import { NextResponse } from "next/server";

import { generateLesson } from "@/src/lib/ai/gemini";

import { LessonDraftInputSchema } from "@/src/features/lessons/schemas/lesson";


export async function POST(request: Request) {

    const requestId = crypto.randomUUID();

    try {
        let input: unknown

        try {
            input = await request.json();
        } catch {
            return NextResponse.json({
                error: "Invalid JSON input",
            }, {
                status: 400,
            })
        }

        const result = LessonDraftInputSchema.safeParse(input);


        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid request input",
                },
                {
                    status: 400,
                }
            );
        }

        const lesson = await generateLesson(result.data);

        return NextResponse.json(lesson);


    } catch (error) {

        let errorType = error instanceof Error ? error.name : "UnknownError";

        console.error(`${requestId}| POST /api/gemini | Lesson generation failed | ${errorType}`)

        return NextResponse.json(
            {
                error: "Something went wrong, please try again later.",
                requestId,
            },
            {
                status: 500,
            }
        );
    }
}
