import { createClient } from "@/src/lib/supabase/server-client";

export async function getLessons() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data
}