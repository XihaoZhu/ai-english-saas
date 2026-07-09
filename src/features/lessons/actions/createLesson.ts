"use server";

import { createClient } from "@/src/lib/supabase/server-client";
import type {
    LessonLevel,
    LessonLength,
    ReadingWord,
} from "@/src/features/lessons/types/lesson";

export async function createLesson(input: {
    title: string;
    prompt: string;
    keywords: string;
    length: LessonLength;
    level: LessonLevel;
    article: string;
    word_count: number;
    vocabulary: ReadingWord[];
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("lessons")
        .insert({
            user_id: user.id,
            ...input,
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}
