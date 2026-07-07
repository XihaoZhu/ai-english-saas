import { NextResponse } from "next/server";

import { generateLesson } from "@/src/lib/ai/gemini";

export async function GET() {
    try {
        const lesson = await generateLesson();

        return NextResponse.json(lesson);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}