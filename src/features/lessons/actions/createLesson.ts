"use server";

import { createClient } from "@/src/lib/supabase/server-client";

export async function createLesson(input: {
    title: string;
    prompt: string;
    keywords: string;
    length: "Short" | "Medium" | "Long";
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
    article: string;
    word_count: number;
    vocabulary: Array<{
        word: string;
        phonetic: string;
        meaning: string;
        tier: string;
        explanation: string;
    }>;
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
