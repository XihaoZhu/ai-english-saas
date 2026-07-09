import { NextResponse } from "next/server";

import { generateLesson } from "@/src/lib/ai/gemini";
import type { LessonDraftInput } from "@/src/features/lessons/types/lesson";

export async function POST(request: Request) {
    try {
        const input = (await request.json()) as LessonDraftInput;
        const lesson = await generateLesson(input);

        return NextResponse.json(lesson);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Something went wrong, please try again later.",
            },
            {
                status: 500,
            }
        );
    }
}
