import type {
    GeneratedLessonResult,
    LessonDraftInput,
} from "@/src/features/lessons/types/lesson";

export async function generateLesson(
    input: LessonDraftInput
): Promise<GeneratedLessonResult> {
    const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;

        throw new Error(payload?.error ?? "Failed to generate lesson.");
    }

    return (await response.json()) as GeneratedLessonResult;
}
