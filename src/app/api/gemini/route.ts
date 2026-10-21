import { NextResponse } from "next/server";

import { generateLesson } from "@/src/lib/ai/gemini";

import { LessonDraftInputSchema } from "@/src/features/lessons/schemas/lesson";


export async function POST(request: Request) {


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
