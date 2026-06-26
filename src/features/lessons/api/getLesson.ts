import { createClient } from "@/src/lib/supabase/server-client";

export async function getLesson(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
}