import { NextResponse } from "next/server";

import { createClient } from "@/src/lib/supabase/server-client";

import { generateLesson, LessonTimeoutError } from "@/src/lib/ai/gemini";

import { LessonDraftInputSchema } from "@/src/features/lessons/schemas/lesson";



export async function POST(request: Request) {

    const requestId = crypto.randomUUID();

    try {

        const supabase = await createClient();

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            if (error.status === 401) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401, })
            } else {
                return NextResponse.json(
                    { error: "Failed to authenticate user" },
                    { status: 500, })
            }
        }

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, })
        }

    } catch (error) {

        console.error(`${requestId}| POST /api/gemini | Failed to authenticate user | ${error instanceof Error ? error.name : "UnknownError"}`)

        return NextResponse.json({
            error: "Failed to authenticate user"
        }, {
            status: 500,
        })


    }





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

        if (error instanceof LessonTimeoutError) {
            return NextResponse.json({
                error: "Lesson generation timed out after 20 seconds. Please try again.",
                requestId,
            }, {
                status: 504,
            })
        }

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
